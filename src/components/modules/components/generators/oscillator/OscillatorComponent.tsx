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

import CustomWaveTypeController from '../../core/controllers/customWaveTypeController/CustomWaveTypeController';
import FrequencyController from '../../core/controllers/frequencyController/FrequencyController';
import NumericController from '../../core/controllers/numericController/NumericController';
import WaveTypeController from '../../core/controllers/waveTypeController/WaveTypeController';
import useOscillator from './hooks/useOscillator';

interface OscillatorProps {
    moduleId: string;
    envelopeId?: string;
    parentModuleId?: string;
}
const OscillatorComponent: FC<OscillatorProps> = ({
    moduleId,
    envelopeId,
    parentModuleId,
}) => {
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
                freq: 0,
                periodicWaveOptions: { real: [0, 0], imag: [0, 1] },
                gain: 0.5,
                pitch: 0,
                envelopeId: envelopeId || defaultEnvelopeId,
                customType: 'none',
                parentModuleId,
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
                        <NumericController
                            paramId={'gain'}
                            resetValue={0.2}
                            step={0.005}
                            min={0}
                            max={2}
                            hasMaxInput={true}
                        />
                        <NumericController
                            paramId={'pitch'}
                            resetValue={0}
                            step={0.01}
                            min={-1200}
                            max={1200}
                            hasMinInput={true}
                            minInputMin={-7200}
                            minInputMax={7200}
                            hasMaxInput={true}
                            maxInputMin={-7200}
                            maxInputMax={7200}
                        />
                        <WaveTypeController />
                        <CustomWaveTypeController />
                    </div>
                </div>
            ) : null}
        </ModuleContextProvider>
    );
};

export default OscillatorComponent;
