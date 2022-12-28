import { useAppDispatch } from 'src/app/hooks';
import { addNote, removeNote } from 'src/reducers/synthSlice';

import useMidiNotes from './useMidiNotes';

const useMidiDevice = (): void => {
    const dispatch = useAppDispatch();

    navigator.requestMIDIAccess().then(success, failure);

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
        const { data } = inputEvent;
        const command = data[0];
        const midiNote = data[1];
        const velocity = data[2];

        switch (command) {
            case 144: // noteOn
                if (velocity > 0) {
                    noteOn(midiNote, velocity);
                } else {
                    noteOff(midiNote);
                }
                break;
            case 128: // noteOff
                noteOff(midiNote);
                break;
        }
    }

    function midiToFreq(midiNote: number): number {
        return (440 / 32) * 2 ** ((midiNote - 9) / 12);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function noteOn(note: number, velocity: number) {
        // TODO: add velocity feature to Oscillators
        const [noteName] = useMidiNotes(note);
        if (noteName) {
            dispatch(addNote({ note: noteName, freq: midiToFreq(note) }));
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
