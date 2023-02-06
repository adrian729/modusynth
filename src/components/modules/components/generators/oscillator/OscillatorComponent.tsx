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
import './styles.scss';

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
        <>
            <ModuleContextProvider moduleId={moduleId} moduleType="oscillator">
                <OscillatorControl />
                {isSetup ? (
                    <div className="oscillator">
                        <h5 className="oscillator__title">{moduleId}</h5>
                        <div className="oscillator__item  oscillator__item--column">
                            <FrequencyController />
                            <WaveTypeController />
                            <CustomWaveTypeController />
                        </div>
                        <div className="oscillator__item">
                            <NumericController
                                paramId={'gain'}
                                resetValue={0.2}
                                step={0.01}
                                min={0}
                                max={2}
                                hasMaxInput={true}
                                controllerType="knob"
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
                                controllerType="knob"
                                knobSize="small"
                            />
                        </div>
                    </div>
                ) : null}
            </ModuleContextProvider>
        </>
    );
};

export default OscillatorComponent;

/**
 * Separate logic so that render of whole OscillatorComponent doesn't happen when audio triggers
 */
const OscillatorControl: FC = () => {
    useOscillator();
    return null;
};
