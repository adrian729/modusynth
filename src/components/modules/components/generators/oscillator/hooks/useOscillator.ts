import { useEffect, useState } from 'react';

import MainContext, {
    ModuleInterface,
} from 'src/context/MainContext/MainContext';
import useSafeContext from 'src/hooks/useSafeContext';
import { getNotes, getSynthPadNote } from 'src/reducers/oscillatorsSlice';
import {
    EnvelopeModule,
    OscillatorModule,
    getDefaultEnvelopeId,
    getModule,
} from 'src/reducers/synthesisSlice';

import customPeriodicWaveOptions from './customWaveTypes/customWaveTypes';

export interface OscillatorState {
    oscillators: Record<string, [OscillatorNode, GainNode]>;
    controlGainNode: GainNode;
    gainNode: GainNode;
}

interface UseOscillatorParams {
    moduleId: string;
}
const useOscillator = ({ moduleId }: UseOscillatorParams): void => {
    console.log('RENDER'); //TODO: how to fix synthPad so that it doesn't break this? ON CLICK
    const {
        state: { audioContext, modules },
        dispatch,
    } = useSafeContext(MainContext);
    const synthPadNote = getSynthPadNote();
    const notes = getNotes();

    const moduleState = getModule(moduleId) as OscillatorModule;
    const defaultEnvelopeId = getDefaultEnvelopeId();

    //! TODO: WE CAN JUST ADD DEFAULT VALUES WHEN DESTRUCTURING LIKE HERE!!! REFACTOR CODE IN OTHER PLACES!!!
    const {
        type = 'sine',
        freq = 0,
        periodicWaveOptions = { real: [0, 0], imag: [0, 1] },
        gain = 0,
        pitch = 0,
        envelopeId = defaultEnvelopeId,
        customType = 'none',
    } = { ...moduleState };

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
    const [gainInputIds, setGainInputIds] = useState<string[]>([]);
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
            const { currentTime } = audioContext;
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

        return () => {
            if (modules && !modules[moduleId]) {
                delete modules[moduleId];
            }
        };
    }, []);

    const getPeriodicWave = (): PeriodicWave | undefined => {
        const periodicWaveOpts =
            customType === WAVETABLE_TYPE
                ? periodicWaveOptions
                : customPeriodicWaveOptions[customType];

        if (!periodicWaveOpts) {
            return undefined;
        }

        const { real, imag } = periodicWaveOptions;
        if (!real || !imag) {
            return undefined;
        }

        return new PeriodicWave(audioContext, periodicWaveOpts);
    };

    const setOscWaveType = (oscillator: OscillatorNode): void => {
        if (type !== 'custom') {
            oscillator.type = type;
            return;
        }

        const periodicWave = getPeriodicWave();
        if (!periodicWave) {
            oscillator.type = 'sine';
            return;
        }
        oscillator.setPeriodicWave(periodicWave);
    };

    useEffect(() => {
        Object.values(oscillators).forEach(([oscillator]) => {
            setOscWaveType(oscillator);
        });
    }, [type, customType, periodicWaveOptions]);

    useEffect(() => {
        const { currentTime } = audioContext;
        const numOscs = Object.keys(oscillators).length || 1;
        gainNode.gain.setTargetAtTime(gain / numOscs, currentTime, 0.005);
    }, [gain, oscillators]);

    useEffect(() => {
        if (detuneConstantSource) {
            const { currentTime } = audioContext;
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
            frequency,
        });
        setOscWaveType(oscNode);

        const { currentTime } = audioContext;
        const velocityGain = velocity ? 0.1 + velocity / 127 : 1;
        const oscGain = new GainNode(audioContext, { gain: 0 });
        oscGain.gain.cancelScheduledValues(currentTime);
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
        // Detune by detuneConstantSource conencted to pitch
        detuneConstantSource?.connect(oscNode.detune);
        oscNode.start();

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
            const { currentTime } = audioContext;
            const newOscillators = { ...prevOscillatorState.oscillators };
            // If specific freq set, use freq, else get from notes
            const oscNotes = !freq
                ? notes
                : { [`freq_${freq}`]: { frequency: freq } };

            Object.entries(newOscillators)
                .filter(([key]) => !oscNotes[key] && key !== SYNTH_PAD_ID)
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

    const stopSynthPadOscillator = () => {
        const synthPadOscillator = oscillators[SYNTH_PAD_ID];
        if (synthPadOscillator) {
            setOscillatorState((prevOscillatorState) => {
                const { currentTime } = audioContext;
                const newOscillators = { ...prevOscillatorState.oscillators };
                const [oscNode, oscGainNode] = synthPadOscillator;
                stopOscillator({
                    oscNode,
                    oscGainNode,
                    currentTime,
                    release,
                });
                delete newOscillators[SYNTH_PAD_ID];

                return { ...prevOscillatorState, oscillators: newOscillators };
            });
        }
    };

    const newSynthPadOscillator = (
        frequency: number,
        velocity: number,
    ): [OscillatorNode, GainNode] => {
        const oscNode = new OscillatorNode(audioContext, {
            frequency,
        });
        setOscWaveType(oscNode);
        oscNode.start();
        // Detune by detuneConstantSource conencted to pitch
        detuneConstantSource?.connect(oscNode.detune);

        const { currentTime } = audioContext;
        const velocityGain = 0.1 + velocity / 127;
        const oscGain = new GainNode(audioContext, { gain: 0 });
        oscGain.gain.setTargetAtTime(
            sustain * velocityGain,
            currentTime,
            easing,
        );
        oscNode.connect(oscGain);
        oscGain.connect(controlGainNode);

        return [oscNode, oscGain];
    };

    useEffect(() => {
        const { frequency, velocity } = synthPadNote;
        if (!frequency || !velocity) {
            stopSynthPadOscillator();
        } else {
            const synthPadOscillator = oscillators[SYNTH_PAD_ID];
            if (!synthPadOscillator) {
                setOscillatorState((prevOscillatorState) => {
                    const { currentTime } = audioContext;
                    const newOscillators = {
                        ...prevOscillatorState.oscillators,
                    };

                    const oldSynthPadOscillator = newOscillators[SYNTH_PAD_ID];
                    if (oldSynthPadOscillator) {
                        const [oscNode, oscGainNode] = oldSynthPadOscillator;
                        stopOscillator({
                            oscNode,
                            oscGainNode,
                            currentTime,
                            release,
                        });
                    }

                    const newOsc = newSynthPadOscillator(frequency, velocity);
                    connectFreqInputs(newOsc[0]);
                    newOscillators[SYNTH_PAD_ID] = newOsc;
                    return {
                        ...prevOscillatorState,
                        oscillators: newOscillators,
                    };
                });
            } else {
                const { currentTime } = audioContext;
                const [oscNode, oscGainNode] = synthPadOscillator;
                oscNode.frequency.setTargetAtTime(
                    frequency,
                    currentTime,
                    0.005,
                );
                const velocityGain = 0.1 + velocity / 127;
                oscGainNode.gain.setTargetAtTime(
                    sustain * velocityGain,
                    currentTime,
                    0.005,
                );
            }
        }
    }, [synthPadNote]);
};

export default useOscillator;

const easing = 0.005;

const SYNTH_PAD_ID = 'synthPad';
const WAVETABLE_TYPE = 'wavetable';

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
    // TODO: check why if stop before starting decay it pops
    oscGainNode.gain.cancelScheduledValues(currentTime);
    oscGainNode.gain.setTargetAtTime(0, currentTime, release / 3 + easing); // Exponential ramp to target. After time/3 around 95% close to target
    setTimeout(() => {
        oscNode.stop();
        oscNode.disconnect();
        oscGainNode.disconnect();
    }, 10 * release * 1000 + 3000);
};
