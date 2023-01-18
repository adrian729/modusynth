import { useEffect, useMemo, useState } from 'react';

import _ from 'lodash';
import { useAppDispatch } from 'src/app/hooks';
import Button from 'src/components/common/core/button/Button';
import MainContext, {
    ModuleInterface,
} from 'src/context/MainContext/MainContext';
import useSafeContext from 'src/hooks/useSafeContext';
import {
    CombinatorModule,
    getModule,
    updateModule,
} from 'src/reducers/synthesisSlice';

import CombinatorComponent from '../../combiners/combinator/CombinatorComponent';
import OscillatorComponent from '../../generators/oscillator/OscillatorComponent';

interface ModulatorProps {
    moduleId: string;
    parentModuleId?: string; // TODO: add module to Redux state when we add the envelope? And add then parentId
}
const ModulatorComponent = ({ moduleId }: ModulatorProps) => {
    // TODO: separate logic into hook
    const appDispatch = useAppDispatch();

    const {
        state: { audioContext, modules },
        dispatch,
    } = useSafeContext(MainContext);

    const [module] = useState<ModuleInterface>({
        outputNode: new GainNode(audioContext, { gain: 1 }),
    });
    const { outputNode } = module;

    const generatorsModuleId = useMemo(() => _.uniqueId('generators_'), []);
    const generatorModule = modules[generatorsModuleId];
    const generatorModuleState = getModule(
        generatorsModuleId,
    ) as CombinatorModule;
    const { childModuleIds: generatorChildModuleIds } = {
        ...{ childModuleIds: [] },
        ...generatorModuleState,
    };

    const rmsModuleId = useMemo(() => _.uniqueId('rms_'), []);
    const rmsModuleState = getModule(rmsModuleId) as CombinatorModule;
    const { childModuleIds: rmsChildModuleIds } = {
        ...{ childModuleIds: [] },
        ...rmsModuleState,
    };

    const fmsModuleId = useMemo(() => _.uniqueId('fms_'), []);
    const fmsModuleState = getModule(fmsModuleId) as CombinatorModule;
    const { childModuleIds: fmsChildModuleIds } = {
        ...{ childModuleIds: [] },
        ...rmsModuleState,
    };

    const [generators, setGenerators] = useState<Record<string, any>>({});
    const [rms, setRMs] = useState<Record<string, any>>({});
    const [fms, setFMs] = useState<Record<string, any>>({});

    const getGenerators = () => Object.values(generators) || null;
    const getRMs = () => Object.values(rms) || null;
    const getFMs = () => Object.values(fms) || null;

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

    const addGeneratorOsc = () => {
        const id = _.uniqueId(`${generatorsModuleId}--oscillator-`);
        setGenerators((prevGenerators) => {
            return {
                ...prevGenerators,
                [id]: (
                    <OscillatorComponent
                        key={id}
                        moduleId={id}
                        parentModuleId={generatorsModuleId}
                    />
                ),
            };
        });
        appDispatch(
            updateModule({
                ...generatorModuleState,
                childModuleIds: [...generatorChildModuleIds, id],
            } as CombinatorModule),
        );
    };

    const addRMOsc = () => {
        const id = _.uniqueId(`${rmsModuleId}--oscillator-`);
        setRMs((prevRMs) => {
            return {
                ...prevRMs,
                [id]: (
                    <OscillatorComponent
                        key={id}
                        moduleId={id}
                        parentModuleId={rmsModuleId}
                    />
                ),
            };
        });
        appDispatch(
            updateModule({
                ...rmsModuleState,
                childModuleIds: [...rmsChildModuleIds, id],
            } as CombinatorModule),
        );
    };

    const addFMOsc = () => {
        const id = _.uniqueId(`${fmsModuleId}--oscillator-`);
        setFMs((prevFMs) => {
            return {
                ...prevFMs,
                [id]: (
                    <OscillatorComponent
                        key={id}
                        moduleId={id}
                        parentModuleId={fmsModuleId}
                    />
                ),
            };
        });
        appDispatch(
            updateModule({
                ...fmsModuleState,
                childModuleIds: [...fmsChildModuleIds, id],
            } as CombinatorModule),
        );
    };

    return (
        <div>
            <h4>Oscillators</h4>
            <div style={{ background: 'lightgray' }}>
                <h5>{generatorsModuleId}</h5>
                <CombinatorComponent moduleId={generatorsModuleId}>
                    {getGenerators()}
                </CombinatorComponent>
                <Button
                    id={`${moduleId}_${generatorsModuleId}--add`}
                    title="Add Generator Osc"
                    onClick={addGeneratorOsc}
                />
            </div>
            <h4>RM</h4>
            <div style={{ background: 'tomato' }}>
                <h5>{rmsModuleId}</h5>
                <CombinatorComponent moduleId={rmsModuleId}>
                    {getRMs()}
                </CombinatorComponent>
                <Button
                    id={`${moduleId}_${rmsModuleId}--add`}
                    title="Add RM Osc"
                    onClick={addRMOsc}
                />
            </div>
            <h4>FM</h4>
            <div style={{ background: 'lightgreen' }}>
                <h5>{fmsModuleId}</h5>
                <CombinatorComponent moduleId={fmsModuleId}>
                    {getFMs()}
                </CombinatorComponent>
                <Button
                    id={`${moduleId}_${fmsModuleId}--add`}
                    title="Add FM Osc"
                    onClick={addFMOsc}
                />
            </div>
        </div>
    );
};

export default ModulatorComponent;
