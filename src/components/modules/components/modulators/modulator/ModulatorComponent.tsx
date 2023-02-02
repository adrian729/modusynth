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
import WaveTableOscillatorComponent from '../../generators/waveTableOscillator/WaveTableOscillatorComponent';
import EnvelopeComponent from '../envelope/EnvelopeComponent';
import useModulator from './hooks/useModulator';

interface ModulatorProps {
    moduleId: string;
    parentModuleId?: string; // TODO: add module to Redux state when we add the envelope? And add then parentId
}
const ModulatorComponent = ({ moduleId }: ModulatorProps) => {
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
        ...rmsModuleState,
    };

    const envelopeId = useMemo(() => _.uniqueId('envelope_'), []);

    const [generators, setGenerators] = useState<Record<string, ReactNode>>({});
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

    const addWaveTableGeneratorOsc = () => {
        const id = _.uniqueId(`${generatorsModuleId}--oscillator-`);
        setGenerators((prevGenerators) => {
            return {
                ...prevGenerators,
                [id]: (
                    <WaveTableOscillatorComponent
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
            <h4>Oscillators</h4>
            <div style={{ background: 'lightgray' }}>
                <h5>{generatorsModuleId}</h5>
                <CombinatorComponent moduleId={generatorsModuleId}>
                    {getGenerators()}
                </CombinatorComponent>
                <Button
                    id={`${moduleId}_${generatorsModuleId}--add-osc`}
                    title="Add Generator Osc"
                    onClick={addGeneratorOsc}
                />
                <Button
                    id={`${moduleId}_${generatorsModuleId}--add-wavetable-osc`}
                    title="Add Generator Wavetable Osc"
                    onClick={addWaveTableGeneratorOsc}
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
            <h4>Envelope</h4>
            <EnvelopeComponent
                moduleId={envelopeId}
                parentModuleId={moduleId}
            />
        </div>
    );
};

export default ModulatorComponent;
