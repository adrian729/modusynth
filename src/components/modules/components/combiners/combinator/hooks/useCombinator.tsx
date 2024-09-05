import { useEffect, useState } from 'react';

import MainContext, {
    ModuleInterface,
} from 'src/context/MainContext/MainContext';
import useSafeContext from 'src/hooks/useSafeContext';
import { CombinatorModule, getModule } from 'src/reducers/synthesisSlice';

interface UseCombinatorParams {
    moduleId: string;
}
const useCombinator = ({ moduleId }: UseCombinatorParams) => {
    const {
        state: { audioContext, modules },
        dispatch,
    } = useSafeContext(MainContext);

    const moduleState = getModule(moduleId) as CombinatorModule;
    const { childModuleIds = [] } = { ...moduleState };
    const [inputIds, setInputIds] = useState<string[]>([]);
    const [gainInputIds, setGainInputIds] = useState<string[]>([]);
    const [freqInputIds, setFreqInputIds] = useState<string[]>([]);

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

    const [module] = useState<ModuleInterface>({
        outputNode: new GainNode(audioContext, { gain: 0.5 }),
        addInputs: (moduleIds: string[]): void =>
            setInputIds(updateInputs({ inputs: inputIds, moduleIds })),
        addGainInputs: (moduleIds: string[]): void =>
            setGainInputIds(updateInputs({ inputs: gainInputIds, moduleIds })),
        addFreqInputs: (moduleIds: string[]): void =>
            setFreqInputIds(updateInputs({ inputs: freqInputIds, moduleIds })),
    });
    const { outputNode } = module;

    useEffect(() => {
        if (modules && !modules[moduleId]) {
            dispatch({
                type: 'ADD_MODULE',
                payload: { id: moduleId, module },
            });
        }
    }, []);

    useEffect(() => {
        if (modules) {
            childModuleIds
                .filter((id) => modules[id])
                .forEach((id) => {
                    const childModule = modules[id];
                    childModule.outputNode.connect(outputNode);
                    if (childModule.addInputs) {
                        childModule.addInputs(inputIds);
                    }
                    if (childModule.addGainInputs) {
                        childModule.addGainInputs(gainInputIds);
                    }
                    if (childModule.addFreqInputs) {
                        childModule.addFreqInputs(freqInputIds);
                    }
                });
        }
    }, [childModuleIds, modules]);

    useEffect(() => {
        if (modules) {
            childModuleIds
                .filter((id) => modules[id])
                .forEach((id) => {
                    const childModule = modules[id];
                    if (childModule.addInputs) {
                        childModule.addInputs(inputIds);
                    }
                });
        }
    }, [inputIds]);

    useEffect(() => {
        if (modules) {
            childModuleIds
                .filter((id) => modules[id])
                .forEach((id) => {
                    const childModule = modules[id];
                    if (childModule.addGainInputs) {
                        childModule.addGainInputs(gainInputIds);
                    }
                });
        }
    }, [gainInputIds]);

    useEffect(() => {
        if (modules) {
            childModuleIds
                .filter((id) => modules[id])
                .forEach((id) => {
                    const childModule = modules[id];
                    if (childModule.addFreqInputs) {
                        childModule.addFreqInputs(freqInputIds);
                    }
                });
        }
    }, [freqInputIds]);
};

export default useCombinator;
