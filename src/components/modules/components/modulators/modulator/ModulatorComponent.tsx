import { ReactNode, useMemo, useState } from 'react';

import _ from 'lodash';
import { useAppDispatch } from 'src/app/hooks';
import Button from 'src/components/common/core/button/Button';
import {
    CombinatorModule,
    getModule,
    updateModule,
} from 'src/reducers/synthesisSlice';

import CombinatorComponent from '../../combiners/combinator/CombinatorComponent';
import OscillatorComponent from '../../generators/oscillator/OscillatorComponent';
import useModulator from './hooks/useModulator';

interface ModulatorProps {
    moduleId: string;
    envelopeId: string; // envelope shared by all child oscillators; owned/rendered by the parent
    parentModuleId?: string; // TODO: add module to Redux state when we add the envelope? And add then parentId
}
const ModulatorComponent = ({ moduleId, envelopeId }: ModulatorProps) => {
    const dispatch = useAppDispatch();

    const generatorsModuleId = useMemo(() => _.uniqueId('generators_'), []);
    const generatorModuleState = getModule(
        generatorsModuleId,
    ) as CombinatorModule;
    const { childModuleIds: generatorChildModuleIds = [] } = {
        ...generatorModuleState,
    };

    const rmsModuleId = useMemo(() => _.uniqueId('rms_'), []);
    const rmsModuleState = getModule(rmsModuleId) as CombinatorModule;
    const { childModuleIds: rmsChildModuleIds = [] } = {
        ...rmsModuleState,
    };

    const fmsModuleId = useMemo(() => _.uniqueId('fms_'), []);
    const fmsModuleState = getModule(fmsModuleId) as CombinatorModule;
    const { childModuleIds: fmsChildModuleIds = [] } = {
        ...fmsModuleState,
    };

    // Seed one generator oscillator so the modulator (and the RM/FM sources
    // that modulate it) has a carrier out of the box. The combinator picks the
    // child id up from its React children when it registers itself.
    const [generators, setGenerators] = useState<Record<string, ReactNode>>(
        () => {
            const id = _.uniqueId(`${generatorsModuleId}--oscillator-`);
            return {
                [id]: (
                    <OscillatorComponent
                        key={id}
                        moduleId={id}
                        envelopeId={envelopeId}
                        parentModuleId={generatorsModuleId}
                    />
                ),
            };
        },
    );
    const [rms, setRMs] = useState<Record<string, ReactNode>>({});
    const [fms, setFMs] = useState<Record<string, ReactNode>>({});

    const getGenerators = () => Object.values(generators) || null;
    const getRMs = () => Object.values(rms) || null;
    const getFMs = () => Object.values(fms) || null;

    useModulator({ moduleId, generatorsModuleId, rmsModuleId, fmsModuleId });

    const addGeneratorOsc = () => {
        const id = _.uniqueId(`${generatorsModuleId}--oscillator-`);
        setGenerators((prevGenerators) => {
            return {
                ...prevGenerators,
                [id]: (
                    <OscillatorComponent
                        key={id}
                        moduleId={id}
                        envelopeId={envelopeId}
                        parentModuleId={generatorsModuleId}
                    />
                ),
            };
        });
        dispatch(
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
                        envelopeId={envelopeId}
                        parentModuleId={rmsModuleId}
                    />
                ),
            };
        });
        dispatch(
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
                        envelopeId={envelopeId}
                        parentModuleId={fmsModuleId}
                    />
                ),
            };
        });
        dispatch(
            updateModule({
                ...fmsModuleState,
                childModuleIds: [...fmsChildModuleIds, id],
            } as CombinatorModule),
        );
    };

    return (
        <div>
            <section className="sect sect--gen">
                <h4 className="sect__title">Oscillators</h4>
                <h5 className="mb-2 font-mono text-[0.65rem] text-text-dim">
                    {generatorsModuleId}
                </h5>
                <CombinatorComponent moduleId={generatorsModuleId}>
                    {getGenerators()}
                </CombinatorComponent>
                <Button
                    id={`${moduleId}_${generatorsModuleId}--add-osc`}
                    title="Add Generator Osc"
                    onClick={addGeneratorOsc}
                />
            </section>
            <section className="sect sect--rm">
                <h4 className="sect__title">RM</h4>
                <h5 className="mb-2 font-mono text-[0.65rem] text-text-dim">
                    {rmsModuleId}
                </h5>
                <CombinatorComponent moduleId={rmsModuleId}>
                    {getRMs()}
                </CombinatorComponent>
                <Button
                    id={`${moduleId}_${rmsModuleId}--add`}
                    title="Add RM Osc"
                    onClick={addRMOsc}
                />
            </section>
            <section className="sect sect--fm">
                <h4 className="sect__title">FM</h4>
                <h5 className="mb-2 font-mono text-[0.65rem] text-text-dim">
                    {fmsModuleId}
                </h5>
                <CombinatorComponent moduleId={fmsModuleId}>
                    {getFMs()}
                </CombinatorComponent>
                <Button
                    id={`${moduleId}_${fmsModuleId}--add`}
                    title="Add FM Osc"
                    onClick={addFMOsc}
                />
            </section>
        </div>
    );
};

export default ModulatorComponent;
