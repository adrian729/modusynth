import { useEffect, useMemo, useState } from 'react';

import _ from 'lodash';
import MainContext, {
    ModuleInterface,
} from 'src/components/modules/context/MainContext/MainContext';
import useSafeContext from 'src/hooks/useSafeContext';

import CombinatorComponent from '../../combiners/combinator/CombinatorComponent';
import OscillatorComponent from '../../generators/oscillator/OscillatorComponent';

interface ModulatorProps {
    moduleId: string;
}
const ModulatorComponent = ({ moduleId }: ModulatorProps) => {
    const {
        state: { audioContext, modules },
        dispatch: dispatchMainCTX,
    } = useSafeContext(MainContext);

    const generatorsModuleId = useMemo(() => _.uniqueId('generators_'), []);
    const rmsModuleId = useMemo(() => _.uniqueId('rms_'), []);
    const fmsModuleId = useMemo(() => _.uniqueId('fms_'), []);

    const [generatorModuleIds] = useState<string[]>([
        useMemo(() => _.uniqueId('oscillator_'), []),
        useMemo(() => _.uniqueId('oscillator_'), []),
        useMemo(() => _.uniqueId('oscillator_'), []),
    ]);
    const [rmModuleIds] = useState<string[]>([
        useMemo(() => _.uniqueId('rm_oscillator_'), []),
        useMemo(() => _.uniqueId('rm_oscillator_'), []),
    ]);
    const [fmModuleIds] = useState<string[]>([
        useMemo(() => _.uniqueId('fm_oscillator_'), []),
        useMemo(() => _.uniqueId('fm_oscillator_'), []),
    ]);

    const [gainNode] = useState<GainNode>(
        new GainNode(audioContext, { gain: 0.2 }),
    );

    const [module] = useState<ModuleInterface>({
        outputNode: gainNode,
    });

    useEffect(() => {
        if (modules && !modules[moduleId]) {
            dispatchMainCTX({
                type: 'ADD_MODULE',
                payload: { id: moduleId, module },
            });
        }
    }, []);

    useEffect(() => {
        const generator = modules[generatorsModuleId];
        if (generator) {
            generator.outputNode.connect(gainNode);
            if (generator.addGainInputs) {
                generator.addGainInputs([rmsModuleId]);
            }
            if (generator.addFreqInputs) {
                generator.addFreqInputs([fmsModuleId]);
            }
        }
    }, [modules]);

    return (
        <div>
            <h4>Oscillators</h4>
            <div style={{ background: 'lightgray' }}>
                <CombinatorComponent moduleId={generatorsModuleId}>
                    <OscillatorComponent moduleId={generatorModuleIds[0]} />
                    <OscillatorComponent moduleId={generatorModuleIds[1]} />
                    <OscillatorComponent moduleId={generatorModuleIds[2]} />
                </CombinatorComponent>
            </div>
            <h4>RM</h4>
            <div style={{ background: 'tomato' }}>
                <h5>{rmsModuleId}</h5>
                <CombinatorComponent moduleId={rmsModuleId}>
                    <OscillatorComponent moduleId={rmModuleIds[0]} />
                    <OscillatorComponent moduleId={rmModuleIds[1]} />
                </CombinatorComponent>
            </div>
            <h4>FM</h4>
            <div style={{ background: 'lightgreen' }}>
                <h5>{fmsModuleId}</h5>
                <CombinatorComponent moduleId={fmsModuleId}>
                    <OscillatorComponent moduleId={fmModuleIds[0]} />
                    <OscillatorComponent moduleId={fmModuleIds[1]} />
                </CombinatorComponent>
            </div>
        </div>
    );
};

export default ModulatorComponent;
