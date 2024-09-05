import { useState } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import { addNote, removeNote } from 'src/reducers/oscillatorsSlice';
import { updateSynthDetuneValue } from 'src/reducers/synthSlice';

import useMidiNotes from './useMidiNotes';

const NOTE_OFF = 0b1000;
const NOTE_ON = 0b1001;
// const POLYPHONIC_AFTERTOUCH = 0b1010;
const CONTROL_CHANGE = 0b1011;
// const PROGRAM_CHANGE = 0b1100;
// const CHANNEL_AFTERTOUCH = 0b1101;
const PITCH_BEND_CHANGE = 0b1110;

const MAX_PITCH_BEND_VALUE = (1 << 14) - 1;
// const CHANNEL_MASK = (1 << 4) - 1;

const useMidiDevice = (): void => {
    const dispatch = useAppDispatch();
    const [hasMidiAccess, setHasMidiAccess] = useState<boolean>(false);

    if (!hasMidiAccess) {
        navigator.requestMIDIAccess().then(success, failure);
    }

    // eslint-disable-next-line no-undef
    function success(midiAccess: WebMidi.MIDIAccess) {
        midiAccess.addEventListener('statechange', updateDevices);

        const inputs = midiAccess.inputs;
        // eslint-disable-next-line no-console
        console.log(inputs);

        inputs.forEach((input) => {
            const { name, manufacturer, state, type } = input;
            // eslint-disable-next-line no-console
            console.log(
                `INPUT Name: ${name}, Manufacturer: ${manufacturer}, State: ${state}, Type: ${type}`,
            );
            input.addEventListener('midimessage', handleInput);
        });

        setHasMidiAccess(true);
    }

    // eslint-disable-next-line no-undef
    function updateDevices(event: WebMidi.MIDIConnectionEvent) {
        const { name, manufacturer, state, type } = event.port;
        // eslint-disable-next-line no-console
        console.log(
            `Name: ${name}, Manufacturer: ${manufacturer}, State: ${state}, Type: ${type}`,
        );
    }

    const statusToCommandCode = (statusByte: number): number =>
        statusByte >>> 4;

    const getPitchBendChangeValue = (least: number, most: number): number =>
        (least << 7) | most;

    // eslint-disable-next-line no-undef
    function handleInput(inputEvent: WebMidi.MIDIMessageEvent) {
        console.log(inputEvent);
        const { data } = inputEvent;
        const status = statusToCommandCode(data[0]);
        // const channel = data[0] & CHANNEL_MASK;
        const val1 = data[1];
        const val2 = data[2];

        switch (status) {
            /**
             * Keys
             * - val1: midiNote
             * - val2: velocity
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
                // console.log(status, val1, val2);
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
                            (getPitchBendChangeValue(val2, val1) /
                                MAX_PITCH_BEND_VALUE) -
                            100,
                    ),
                );
                break;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function midiToFreq(midiNote: number): number {
        return (440 / 32) * 2 ** ((midiNote - 9) / 12);
    }

    function noteOn(note: number, velocity: number) {
        const [noteName] = useMidiNotes(note);
        if (noteName) {
            dispatch(
                addNote({
                    note: noteName,
                    frequency: midiToFreq(note),
                    velocity,
                }),
            );
        }
    }

    function noteOff(note: number) {
        const [noteName] = useMidiNotes(note);
        if (noteName) {
            dispatch(removeNote(noteName));
        }
    }

    function failure() {
        // eslint-disable-next-line no-console
        console.warn('Could not connect MIDI');
    }
};

export default useMidiDevice;
