/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';

import MainContext, {
    ModuleInterface,
} from 'src/context/MainContext/MainContext';
import useSafeContext from 'src/hooks/useSafeContext';

// TODO: refactor to add ringModGain and wet/dry control for the ring modulation
export interface ModulatorState {
    rmGain: GainNode;
    wetGain: GainNode;
    dryGain: GainNode;
}

interface UseModulatorParams {
    moduleId: string;
    generatorsModuleId: string;
    rmsModuleId: string;
    fmsModuleId: string;
}
const useModulator = ({
    moduleId,
    generatorsModuleId,
    rmsModuleId,
    fmsModuleId,
}: UseModulatorParams): void => {
    const {
        state: { audioContext, modules },
        dispatch,
    } = useSafeContext(MainContext);

    // TODO: add dry/wet control to control both together or two controls to do it separated
    const [modulatorState, setModulatorState] = useState<ModulatorState>({
        rmGain: new GainNode(audioContext, { gain: 0 }), // gain 0 to be modulated by rm inputs
        wetGain: new GainNode(audioContext, { gain: 0.5 }),
        dryGain: new GainNode(audioContext, { gain: 0.5 }),
    });
    const { rmGain, wetGain, dryGain } = modulatorState;

    const [module] = useState<ModuleInterface>({
        outputNode: new GainNode(audioContext, { gain: 1 }),
    });
    const { outputNode } = module;

    const generatorModule = modules[generatorsModuleId];
    const rmsModule = modules[rmsModuleId];

    useEffect(() => {
        if (modules && !modules[moduleId]) {
            dispatch({
                type: 'ADD_MODULE',
                payload: { id: moduleId, module },
            });
        }

        dryGain.connect(outputNode);
        rmGain.connect(wetGain);
        wetGain.connect(outputNode);
    }, []);

    useEffect(() => {
        if (generatorModule) {
            generatorModule.outputNode.connect(dryGain);
            generatorModule.outputNode.connect(rmGain);
            if (generatorModule.addFreqInputs) {
                generatorModule.addFreqInputs([fmsModuleId]);
            }
        }
    }, [generatorModule, fmsModuleId]);

    useEffect(() => {
        console.log('rmsMod', rmsModule);
        if (rmsModule) {
            rmsModule.outputNode.connect(rmGain.gain);
        }
    }, [rmsModule]);
};

export default useModulator;

/**
 * SOUND PATH:
 * - Generators -> [DRY, WET]
 * - DRY: dryGain -> out
 * - WET: rmGain -> wetGain -> out
 *
 * - RM Module -> rmGain[gain]
 */
