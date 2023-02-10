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
    updateModule,
} from 'src/reducers/synthesisSlice';

import CustomWaveTypeController from '../../core/controllers/customWaveTypeController/CustomWaveTypeController';
import FrequencyController from '../../core/controllers/frequencyController/FrequencyController';
import NumericController from '../../core/controllers/numericController/NumericController';
import WaveTableController from '../../core/controllers/waveTableController/WaveTableController';
import WaveTypeController from '../../core/controllers/waveTypeController/WaveTypeController';
import customPeriodicWaveOptions from './hooks/customWaveTypes/customWaveTypes';
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
    const { type = 'sine', customType = 'none' } = {
        ...module,
    } as OscillatorModule;
    const defaultEnvelopeId = getDefaultEnvelopeId();
    const [oscType, setOscType] = useState<OscType>('simple');
    const [isSetup, setIsSetup] = useState<boolean>(false);

    const [selectionMemo, setSelectionMemo] = useState<Record<string, string>>({
        simple: 'sine',
        preset: Object.keys(customPeriodicWaveOptions)[0],
    });

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

    useEffect(() => {
        let newModule: OscillatorModule | undefined;
        switch (oscType) {
            case 'simple': {
                newModule = {
                    ...module,
                    type: selectionMemo['simple'],
                    customType: 'none',
                } as OscillatorModule;
                break;
            }
            case 'preset': {
                newModule = {
                    ...module,
                    type: 'custom',
                    customType: selectionMemo['preset'],
                } as OscillatorModule;
                break;
            }
            case 'table': {
                newModule = {
                    ...module,
                    type: 'custom',
                    customType: WAVETABLE_TYPE,
                } as OscillatorModule;
                break;
            }
        }

        if (type && type !== 'custom') {
            setSelectionMemo((prevSelectionMemo) => ({
                ...prevSelectionMemo,
                simple: type,
            }));
        } else if (
            customType &&
            customType !== 'none' &&
            customType !== WAVETABLE_TYPE
        ) {
            setSelectionMemo((prevSelectionMemo) => ({
                ...prevSelectionMemo,
                preset: customType,
            }));
        }

        if (newModule) {
            dispatch(updateModule(newModule));
        }
    }, [oscType]);

    const renderSelectedOscType = () => {
        if (oscType === 'simple') {
            return (
                <>
                    <FrequencyController />
                    <WaveTypeController />
                </>
            );
        }

        if (oscType === 'preset') {
            return (
                <>
                    <FrequencyController />
                    <CustomWaveTypeController />
                </>
            );
        }

        if (oscType === 'table') {
            return <WaveTableController />;
        }
    };

    return (
        <>
            <ModuleContextProvider moduleId={moduleId} moduleType="oscillator">
                <OscillatorControl />
                {isSetup ? (
                    <div className="oscillator">
                        <h5 className="oscillator__title">{moduleId}</h5>
                        <div className="oscillator__item">
                            {oscillator_types.map((radioType) => (
                                <label key={`${moduleId}_${radioType}`}>
                                    <input
                                        type="radio"
                                        name={`${moduleId}_osc_type`}
                                        value={radioType}
                                        checked={radioType === oscType}
                                        onChange={() => setOscType(radioType)}
                                    />
                                    {radioType}
                                </label>
                            ))}
                        </div>
                        <div className="oscillator__item  oscillator__item--column">
                            {renderSelectedOscType()}
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

const WAVETABLE_TYPE = 'wavetable';
type OscType = 'simple' | 'table' | 'preset';
const oscillator_types: OscType[] = ['simple', 'table', 'preset'];

/**
 * Separate logic so that render of whole OscillatorComponent doesn't happen when audio triggers
 */
const OscillatorControl: FC = () => {
    useOscillator();
    return null;
};
