import { FC, useEffect, useState } from 'react';

import _ from 'lodash';
import { useAppDispatch } from 'src/app/hooks';
import { ModuleContextProvider } from 'src/components/modules/context/ModuleContext/ModuleContext';
import {
    OscillatorModule,
    addModule,
    getDefaultEnvelopeId,
    getModule,
    removeModule,
} from 'src/reducers/synthesisSlice';

import FrequencyController from '../../core/controllers/frequencyController/FrequencyController';
import GainController from '../../core/controllers/gainController/GainController';
import PitchController from '../../core/controllers/pitchController/PitchController';
import WaveTypeController from '../../core/controllers/waveTypeController/WaveTypeController';
import useOscillator from './hooks/useOscillator';

interface OscillatorProps {
    moduleId: string;
    envelopeId?: string;
}
const OscillatorComponent: FC<OscillatorProps> = ({ moduleId, envelopeId }) => {
    const dispatch = useAppDispatch();
    const module = getModule(moduleId);
    const defaultEnvelopeId = getDefaultEnvelopeId();
    const [isSetup, setIsSetup] = useState<boolean>(false);

    useOscillator({ moduleId });

    useEffect(() => {
        if (!module) {
            const initialModule: OscillatorModule = {
                id: moduleId,
                type: 'sine',
                note: '',
                freq: 0,
                gain: 0.5,
                pitch: 0,
                envelopeId: envelopeId || defaultEnvelopeId,
            };
            dispatch(addModule(initialModule));
            setIsSetup(true);
        }
        return () => {
            removeModule(moduleId);
        };
    }, []);

    return (
        <ModuleContextProvider moduleId={moduleId} moduleType="oscillator">
            {isSetup ? (
                <div>
                    <h5>{moduleId}</h5>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <FrequencyController />
                        <GainController />
                        <PitchController />
                        <WaveTypeController />
                    </div>
                </div>
            ) : null}
        </ModuleContextProvider>
    );
};

export default OscillatorComponent;
