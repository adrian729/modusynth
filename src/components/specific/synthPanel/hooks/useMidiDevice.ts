import { useEffect } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import {
    addNote,
    removeAllNotes,
    removeNote,
} from 'src/reducers/oscillatorsSlice';
import {
    updateSynthDetuneValue,
    updateSynthGain,
} from 'src/reducers/synthSlice';

import { midiNoteName } from './midiNotes';

const NOTE_OFF = 0b1000;
const NOTE_ON = 0b1001;
// const POLYPHONIC_AFTERTOUCH = 0b1010;
const CONTROL_CHANGE = 0b1011;
// const PROGRAM_CHANGE = 0b1100;
// const CHANNEL_AFTERTOUCH = 0b1101;
const PITCH_BEND_CHANGE = 0b1110;

/** Control change controller ids */
const CC_CHANNEL_VOLUME = 7;
const CC_ALL_SOUND_OFF = 120;
const CC_ALL_NOTES_OFF = 123;

const MAX_CC_VALUE = (1 << 7) - 1;
const MAX_PITCH_BEND_VALUE = (1 << 14) - 1;
// const CHANNEL_MASK = (1 << 4) - 1;

/** Matches the gain slider range in SynthPanel */
const MAX_GAIN = 1.5;

const statusToCommandCode = (statusByte: number): number => statusByte >>> 4;

/** Rebuild a 14-bit value from its most/least significant 7-bit halves */
const fromMidi14Bit = (most: number, least: number): number =>
    (most << 7) | least;

const midiToFreq = (midiNote: number): number =>
    (440 / 32) * 2 ** ((midiNote - 9) / 12);

const useMidiDevice = (): void => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!navigator.requestMIDIAccess) {
            // eslint-disable-next-line no-console
            console.warn('Web MIDI is not supported in this browser');
            return undefined;
        }

        let cancelled = false;

        let access: WebMidi.MIDIAccess | undefined;

        function noteOn(note: number, velocity: number): void {
            dispatch(
                addNote({
                    note: midiNoteName(note),
                    frequency: midiToFreq(note),
                    velocity,
                }),
            );
        }

        function noteOff(note: number): void {
            dispatch(removeNote(midiNoteName(note)));
        }

        function controlChange(controller: number, value: number): void {
            switch (controller) {
                case CC_CHANNEL_VOLUME:
                    dispatch(
                        updateSynthGain((value / MAX_CC_VALUE) * MAX_GAIN),
                    );
                    break;
                case CC_ALL_SOUND_OFF:
                case CC_ALL_NOTES_OFF:
                    dispatch(removeAllNotes());
                    break;
            }
        }

        function handleInput(inputEvent: WebMidi.MIDIMessageEvent): void {
            const { data } = inputEvent;
            const status = statusToCommandCode(data[0]);
            // const channel = data[0] & CHANNEL_MASK;
            const val1 = data[1];
            const val2 = data[2];

            switch (status) {
                /**
                 * Keys
                 * - val1: midiNote
                 * - val2: velocity (NOTE_ON with velocity 0 means note off)
                 */
                case NOTE_ON:
                    if (val2 > 0) {
                        noteOn(val1, val2);
                    } else {
                        noteOff(val1);
                    }
                    break;
                case NOTE_OFF:
                    noteOff(val1);
                    break;
                /**
                 * Knobs
                 * - val1: controller number/id
                 * - val2: controller value
                 */
                case CONTROL_CHANGE:
                    controlChange(val1, val2);
                    break;
                /**
                 * Pitchbend
                 * - val1: least significant 7 bits of the value
                 * - val2: most significant 7 bits of the value
                 * Range: [0, 16383]
                 */
                case PITCH_BEND_CHANGE:
                    // Synth detune val in [-100, 100]
                    dispatch(
                        updateSynthDetuneValue(
                            200 *
                                (fromMidi14Bit(val2, val1) /
                                    MAX_PITCH_BEND_VALUE) -
                                100,
                        ),
                    );
                    break;
            }
        }

        function attachInput(input: WebMidi.MIDIInput): void {
            const { name, manufacturer, state, type } = input;
            // eslint-disable-next-line no-console
            console.log(
                `MIDI INPUT Name: ${name}, Manufacturer: ${manufacturer}, State: ${state}, Type: ${type}`,
            );
            // EventTarget dedupes identical listeners, so re-attaching on a
            // reconnect statechange is safe.
            input.addEventListener('midimessage', handleInput);
        }

        // Hot-plug: wire up devices connected after the page loaded.

        function handleStateChange(event: WebMidi.MIDIConnectionEvent): void {
            const { port } = event;
            if (port.type === 'input' && port.state === 'connected') {
                attachInput(port as WebMidi.MIDIInput);
            }
        }

        function failure(): void {
            // eslint-disable-next-line no-console
            console.warn('Could not connect MIDI');
        }

        navigator.requestMIDIAccess().then((midiAccess) => {
            if (cancelled) {
                return;
            }
            access = midiAccess;
            midiAccess.addEventListener('statechange', handleStateChange);
            midiAccess.inputs.forEach(attachInput);
        }, failure);

        return () => {
            cancelled = true;
            if (access) {
                // @types/webmidi only types the generic EventTarget signature
                // for removeEventListener, hence the casts.
                access.removeEventListener(
                    'statechange',

                    handleStateChange as EventListener,
                );
                access.inputs.forEach((input) =>
                    input.removeEventListener(
                        'midimessage',

                        handleInput as EventListener,
                    ),
                );
            }
        };
    }, [dispatch]);
};

export default useMidiDevice;
