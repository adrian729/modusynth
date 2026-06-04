import { RenderResult, act, render } from '@testing-library/react';
import App from 'src/app/App';
import store from 'src/app/store';
import { removeAllNotes } from 'src/reducers/oscillatorsSlice';
import {
    updateSynthDetuneValue,
    updateSynthGain,
} from 'src/reducers/synthSlice';

/**
 * MIDI wiring test.
 *
 * jsdom has no Web MIDI, so this fakes `navigator.requestMIDIAccess` with a
 * connected input, mounts the REAL App (SynthPanel -> useMidiDevice), and
 * pushes raw MIDI messages through the captured `midimessage` listeners.
 * Assertions are on the Redux store — the store -> audio-graph half of the
 * chain is already covered by rmRouting.test.tsx, so together they prove
 * MIDI message -> audible note.
 */

type MidiHandler = (event: { data: Uint8Array }) => void;
type StateChangeHandler = (event: { port: unknown }) => void;

const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;
const CONTROL_CHANGE = 0xb0;
const PITCH_BEND = 0xe0;

const CC_CHANNEL_VOLUME = 7;
const CC_ALL_SOUND_OFF = 120;
const CC_ALL_NOTES_OFF = 123;

const makeInput = (name: string) => {
    const handlers = new Set<MidiHandler>();
    return {
        name,
        manufacturer: 'Jest',
        state: 'connected',
        type: 'input',
        handlers,
        addEventListener(type: string, handler: MidiHandler): void {
            if (type === 'midimessage') {
                handlers.add(handler);
            }
        },
        removeEventListener(type: string, handler: MidiHandler): void {
            handlers.delete(handler);
        },
    };
};

type FakeInput = ReturnType<typeof makeInput>;

let input: FakeInput;
let stateChangeHandlers: Set<StateChangeHandler>;
let view: RenderResult;

const sendTo = (target: FakeInput, ...bytes: number[]): void => {
    act(() => {
        target.handlers.forEach((handler) =>
            handler({ data: new Uint8Array(bytes) }),
        );
    });
};

const send = (...bytes: number[]): void => sendTo(input, ...bytes);

const notes = () => store.getState().oscillators.notes;
const detuneValue = () => store.getState().synth.synthSettings.detune.value;
const gain = () => store.getState().synth.synthSettings.gain;

beforeEach(async () => {
    // Reset the (module-singleton) store slices these tests touch.
    act(() => {
        store.dispatch(removeAllNotes());
        store.dispatch(updateSynthDetuneValue(0));
        store.dispatch(updateSynthGain(0.2));
    });

    input = makeInput('Fake Keys');
    stateChangeHandlers = new Set();
    const fakeAccess = {
        inputs: new Map([['fake-keys', input]]),
        outputs: new Map(),
        addEventListener(type: string, handler: StateChangeHandler): void {
            if (type === 'statechange') {
                stateChangeHandlers.add(handler);
            }
        },
        removeEventListener(type: string, handler: StateChangeHandler): void {
            stateChangeHandlers.delete(handler);
        },
    };
    (navigator as unknown as Record<string, unknown>).requestMIDIAccess =
        (): Promise<unknown> => Promise.resolve(fakeAccess);

    view = render(<App />);
    // Let requestMIDIAccess resolve and attach the midimessage listeners.
    await act(async () => undefined);
});

test('grants MIDI access and subscribes to the connected input', () => {
    expect(input.handlers.size).toBeGreaterThan(0);
    expect(stateChangeHandlers.size).toBeGreaterThan(0);
});

test('NOTE_ON adds the note to the store, keyed like the on-screen keyboard', () => {
    send(NOTE_ON, 60, 100); // middle C, velocity 100

    // Scientific pitch notation: MIDI 60 = C4, the same name qwerty-hancock
    // emits, so MIDI and on-screen keys share note keys.
    expect(Object.keys(notes())).toEqual(['C4']);
    expect(notes().C4.frequency).toBeCloseTo(261.63, 1);
    expect(notes().C4.velocity).toBe(100);
});

test('NOTE_OFF removes the note', () => {
    send(NOTE_ON, 60, 100);
    expect(Object.keys(notes())).toHaveLength(1);

    send(NOTE_OFF, 60, 0);
    expect(Object.keys(notes())).toHaveLength(0);
});

test('NOTE_ON with velocity 0 acts as note off (running status)', () => {
    send(NOTE_ON, 64, 90);
    expect(Object.keys(notes())).toHaveLength(1);

    send(NOTE_ON, 64, 0);
    expect(Object.keys(notes())).toHaveLength(0);
});

test('noteOn/noteOff use the same key so chords release cleanly', () => {
    send(NOTE_ON, 48, 80);
    send(NOTE_ON, 52, 80);
    send(NOTE_ON, 55, 80);
    expect(Object.keys(notes()).sort()).toEqual(['C3', 'E3', 'G3']);

    send(NOTE_OFF, 52, 0);
    expect(Object.keys(notes()).sort()).toEqual(['C3', 'G3']);
    send(NOTE_OFF, 48, 0);
    send(NOTE_OFF, 55, 0);
    expect(Object.keys(notes())).toHaveLength(0);
});

test('pitch bend maps the 14-bit range onto detune [-100, 100]', () => {
    send(PITCH_BEND, 0x00, 0x00); // min: 0
    expect(detuneValue()).toBeCloseTo(-100, 5);

    send(PITCH_BEND, 0x7f, 0x7f); // max: 16383
    expect(detuneValue()).toBeCloseTo(100, 5);

    send(PITCH_BEND, 0x00, 0x40); // center: 8192
    expect(detuneValue()).toBeCloseTo(0, 1);
});

test('CC channel volume maps onto the synth gain slider range [0, 1.5]', () => {
    send(CONTROL_CHANGE, CC_CHANNEL_VOLUME, 127);
    expect(gain()).toBeCloseTo(1.5, 5);

    send(CONTROL_CHANGE, CC_CHANNEL_VOLUME, 0);
    expect(gain()).toBeCloseTo(0, 5);
});

test('CC all-notes-off and all-sound-off release every held note', () => {
    send(NOTE_ON, 60, 100);
    send(NOTE_ON, 64, 100);
    expect(Object.keys(notes())).toHaveLength(2);

    send(CONTROL_CHANGE, CC_ALL_NOTES_OFF, 0);
    expect(Object.keys(notes())).toHaveLength(0);

    send(NOTE_ON, 67, 100);
    send(CONTROL_CHANGE, CC_ALL_SOUND_OFF, 0);
    expect(Object.keys(notes())).toHaveLength(0);
});

test('hot-plug: a device connected after load gets wired up via statechange', () => {
    const latecomer = makeInput('Plugged In Later');
    act(() => {
        stateChangeHandlers.forEach((handler) => handler({ port: latecomer }));
    });
    expect(latecomer.handlers.size).toBeGreaterThan(0);

    sendTo(latecomer, NOTE_ON, 69, 100); // A4
    expect(notes().A4.frequency).toBeCloseTo(440, 1);
});

test('unmount detaches all MIDI listeners', () => {
    expect(input.handlers.size).toBeGreaterThan(0);
    view.unmount();
    expect(input.handlers.size).toBe(0);
    expect(stateChangeHandlers.size).toBe(0);
});

test('renders without crashing when the browser has no Web MIDI', () => {
    view.unmount();
    delete (navigator as unknown as Record<string, unknown>).requestMIDIAccess;

    expect(() => render(<App />)).not.toThrow();
});
