import { useEffect, useState } from 'react';

import MainContext, {
    ModuleInterface,
} from 'src/context/MainContext/MainContext';
import useSafeContext from 'src/hooks/useSafeContext';

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

    const [module] = useState<ModuleInterface>({
        outputNode: new GainNode(audioContext, { gain: 1 }),
    });
    const { outputNode } = module;

    const generatorModule = modules[generatorsModuleId];

    useEffect(() => {
        if (modules && !modules[moduleId]) {
            dispatch({
                type: 'ADD_MODULE',
                payload: { id: moduleId, module },
            });
        }
    }, []);

    useEffect(() => {
        if (generatorModule) {
            generatorModule.outputNode.connect(outputNode);
            if (generatorModule.addGainInputs) {
                generatorModule.addGainInputs([rmsModuleId]);
            }
            if (generatorModule.addFreqInputs) {
                generatorModule.addFreqInputs([fmsModuleId]);
            }
        }
    }, [generatorModule, rmsModuleId, fmsModuleId]);
};

export default useModulator;
