import { useState } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import {
    addNote,
    removeNote,
    updateSynthDetune,
} from 'src/reducers/synthSlice';

import useMidiNotes from './useMidiNotes';

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

    // eslint-disable-next-line no-undef
    function handleInput(inputEvent: WebMidi.MIDIMessageEvent) {
        // console.log(
        //     '🚀 ~ file: useMidiDevice.ts:47 ~ handleInput ~ inputEvent',
        //     inputEvent,
        // );
        const { data } = inputEvent;
        const command = data[0];
        const val1 = data[1];
        const val2 = data[2];

        switch (command) {
            /**
             * Knobs
             * - val1: knob ID
             * - val2: knob value
             */
            case 176:
                dispatch(updateSynthDetune((val2 * 100) / 127));
                break;
            /**
             * Keys
             * - val1: midiNote
             * - val2: velocity
             */
            case 144:
                if (val2 > 0) {
                    noteOn(val1, val2);
                } else {
                    noteOff(val1);
                }
                break;
            case 128: // noteOff
                noteOff(val1);
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
