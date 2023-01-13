/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';

import MainContext, {
    ModuleInterface,
} from 'src/components/modules/context/MainContext/MainContext';
import useSafeContext from 'src/hooks/useSafeContext';
import { getNotes } from 'src/reducers/oscillatorsSlice';
import {
    EnvelopeModule,
    OscillatorModule,
    getDefaultEnvelopeId,
    getModule,
} from 'src/reducers/synthesisSlice';

interface UseOscillatorParams {
    moduleId: string;
}
const useOscillator = ({ moduleId }: UseOscillatorParams): void => {
    const {
        state: { audioContext, modules },
        dispatch,
    } = useSafeContext(MainContext);
    const { currentTime } = audioContext;
    const notes = getNotes();

    const defaultModuleState: OscillatorModule = {
        id: '',
        note: '',
        type: 'sine',
        freq: 0,
        gain: 0,
        pitch: 0,
        envelopeId: getDefaultEnvelopeId(),
    };
    const moduleState = getModule(moduleId) as OscillatorModule;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { type, note, freq, gain, pitch, envelopeId } = {
        ...defaultModuleState,
        ...moduleState,
    };
    const envelopeModuleState = getModule(envelopeId) as EnvelopeModule;
    const { attack, decay, sustain, release } = envelopeModuleState.envelope;

    const [oscillatorState, setOscillatorState] = useState<OscillatorState>({
        oscillators: {},
        controlGainNode: new GainNode(audioContext, { gain: 1 }),
        gainNode: new GainNode(audioContext, { gain }),
    });
    const { oscillators, controlGainNode, gainNode } = oscillatorState;
    const [detuneConstantSource, setDetuneConstantSource] =
        useState<ConstantSourceNode>();

    const [inputIds, setInputIds] = useState<string[]>([]);
    const [gainInputIds, setGainInputIds] = useState<string[]>([]); // TODO: CHECK WHY IT SOUNDS WHEN PLAYING NTHING AND GAIN ON RMS HIGH
    const [freqInputIds, setFreqInputIds] = useState<string[]>([]);

    const [disconnectedInputs, setDisconnectedInputs] = useState<string[]>([]);
    const [disconnectedGainInputs, setDisconnectedGainInputs] = useState<
        string[]
    >([]);

    interface UpdateInputsParams {
        inputs: string[];
        moduleIds: string[];
    }
    const updateInputs = ({
        inputs,
        moduleIds,
    }: UpdateInputsParams): string[] => [
        ...inputs,
        ...moduleIds.filter((id) => !inputs.includes(id)),
    ];

    const addInputs = (moduleIds: string[]): void => {
        const newInputIds = updateInputs({ inputs: inputIds, moduleIds });
        setDisconnectedInputs(newInputIds.filter((id) => !modules[id]));
        setInputIds(newInputIds);

        newInputIds
            .filter((id) => modules[id])
            .forEach((id) => modules[id].outputNode.connect(gainNode));
    };

    const addGainInputs = (moduleIds: string[]): void => {
        const newGainInputs = updateInputs({ inputs: gainInputIds, moduleIds });
        setDisconnectedGainInputs(newGainInputs.filter((id) => !modules[id]));
        setGainInputIds(newGainInputs);

        newGainInputs
            .filter((id) => modules[id])
            .forEach((id) =>
                modules[id].outputNode.connect(controlGainNode.gain),
            );
    };

    const addFreqInputs = (moduleIds: string[]): void => {
        const newFreqInputs = updateInputs({
            inputs: freqInputIds,
            moduleIds,
        });
        setFreqInputIds(newFreqInputs);
    };

    const [module] = useState<ModuleInterface>({
        outputNode: gainNode,
        addInputs,
        addGainInputs,
        addFreqInputs,
    });

    useEffect(() => {
        let constantSourceNode = detuneConstantSource;
        if (detuneConstantSource === undefined) {
            constantSourceNode = new ConstantSourceNode(audioContext, {
                offset: undefined,
            });
            constantSourceNode.offset.setTargetAtTime(
                pitch,
                currentTime,
                0.005,
            );
            constantSourceNode.start();
            setDetuneConstantSource(constantSourceNode);
        }
        if (modules && !modules[moduleId]) {
            dispatch({
                type: 'ADD_MODULE',
                payload: { id: moduleId, module },
            });
        }
        controlGainNode.connect(gainNode);
    }, []);

    useEffect(() => {
        Object.values(oscillators).forEach(([oscillator]) => {
            oscillator.type = type;
        });
    }, [type]);

    useEffect(() => {
        const numOscs = Object.keys(oscillators).length || 1;
        gainNode.gain.setTargetAtTime(gain / numOscs, currentTime, 0.005);
    }, [gain, oscillators]);

    useEffect(() => {
        if (detuneConstantSource) {
            detuneConstantSource.offset.setTargetAtTime(
                pitch,
                currentTime,
                0.005,
            );
        }
    }, [detuneConstantSource, pitch]);

    const newOscillator = (
        frequency: number,
        velocity?: number,
    ): [OscillatorNode, GainNode] => {
        const oscNode = new OscillatorNode(audioContext, {
            type,
            frequency,
        });
        oscNode.start();
        // Detune by detuneConstantSource conencted to pitch
        detuneConstantSource?.connect(oscNode.detune);

        const velocityGain = velocity ? 0.1 + velocity / 127 : 1;
        const oscGain = new GainNode(audioContext, { gain: 0 });
        oscGain.gain.setTargetAtTime(0, currentTime, easing);
        oscGain.gain.linearRampToValueAtTime(
            velocityGain,
            currentTime + attack + easing,
        );
        oscGain.gain.linearRampToValueAtTime(
            sustain * velocityGain,
            currentTime + attack + decay + easing,
        );
        oscNode.connect(oscGain);
        oscGain.connect(controlGainNode);

        return [oscNode, oscGain];
    };

    const connectFreqInputs = (osc: OscillatorNode) => {
        freqInputIds
            .filter((id) => modules[id])
            .forEach((id) => {
                modules[id].outputNode.connect(osc.frequency);
            });
    };

    useEffect(() => {
        setOscillatorState((prevOscillatorState) => {
            const newOscillators = { ...prevOscillatorState.oscillators };

            // TODO: check if doing it another way
            // If specific freq set, use freq, else get from notes
            const oscNotes = !freq
                ? notes
                : { [`freq_${freq}`]: { frequency: freq } };

            Object.entries(newOscillators)
                .filter(([key]) => !oscNotes[key])
                .forEach(([key, [osc, oscGain]]) => {
                    stopOscillator({
                        oscNode: osc,
                        oscGainNode: oscGain,
                        currentTime,
                        release,
                    });
                    delete newOscillators[key];
                });

            Object.entries(oscNotes)
                .filter(([key]) => !newOscillators[key])
                .forEach(([key, { frequency, velocity }]) => {
                    const newOsc = newOscillator(frequency, velocity);
                    connectFreqInputs(newOsc[0]);
                    newOscillators[key] = newOsc;
                });

            return { ...prevOscillatorState, oscillators: newOscillators };
        });
    }, [freq, notes, modules]);

    useEffect(() => {
        Object.values(oscillators).forEach(([osc]) => {
            connectFreqInputs(osc);
        });
    }, [freqInputIds]);

    useEffect(() => {
        disconnectedInputs
            .filter((id) => modules[id])
            .forEach((id) => modules[id].outputNode.connect(gainNode));
        setDisconnectedInputs((prevDisconnectedInputs) =>
            prevDisconnectedInputs.filter((id) => !modules[id]),
        );

        disconnectedGainInputs
            .filter((id) => modules[id])
            .forEach((id) =>
                modules[id].outputNode.connect(controlGainNode.gain),
            );
        setDisconnectedGainInputs((prevDisconnectedGainInputs) =>
            prevDisconnectedGainInputs.filter((id) => !modules[id]),
        );
    }, [modules]);
};

export default useOscillator;

const easing = 0.005;

interface StopOscillatorParams {
    oscNode: OscillatorNode;
    oscGainNode: GainNode;
    currentTime: number;
    release: number;
}
const stopOscillator = ({
    oscNode,
    oscGainNode,
    currentTime,
    release,
}: StopOscillatorParams): void => {
    oscGainNode.gain.cancelScheduledValues(currentTime);
    oscGainNode.gain.setTargetAtTime(0, currentTime, release / 3 + easing); // Exponential ramp to target. After time/3 around 95% close to target
    setTimeout(() => {
        oscNode.stop();
        oscNode.disconnect();
        oscGainNode.disconnect();
    }, 10 * release * 1000 + 1000);
};

export interface OscillatorState {
    oscillators: Record<string, [OscillatorNode, GainNode]>;
    controlGainNode: GainNode;
    gainNode: GainNode;
}