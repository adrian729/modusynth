import { useEffect, useState } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import CustomWaveTypeController from 'src/components/modules/components/core/controllers/customWaveTypeController/CustomWaveTypeController';
import WaveTableController from 'src/components/modules/components/core/controllers/waveTableController/WaveTableController';
import WaveTypeController from 'src/components/modules/components/core/controllers/waveTypeController/WaveTypeController';
import ModuleContext from 'src/components/modules/context/ModuleContext';
import useSafeContext from 'src/hooks/useSafeContext';
import {
    OscillatorModule,
    getModule,
    updateModule,
} from 'src/reducers/synthesisSlice';

import customPeriodicWaveOptions from '../../hooks/customWaveTypes/customWaveTypes';

const OscillatorWaveSelection = () => {
    const dispatch = useAppDispatch();

    const { moduleId } = useSafeContext(ModuleContext);
    const module = getModule(moduleId);
    const { type = 'sine', customType = 'none' } = {
        ...module,
    } as OscillatorModule;

    const [oscType, setOscType] = useState<OscType>('simple');
    const [selectionMemo, setSelectionMemo] = useState<Record<string, string>>({
        simple: 'sine',
        preset: Object.keys(customPeriodicWaveOptions)[0],
    });

    const updateModuleOscType = () => {
        let type = selectionMemo['simple'];
        let customType = 'none';
        if (oscType !== 'simple') {
            type = 'custom';
            customType =
                oscType === 'preset' ? selectionMemo['preset'] : WAVETABLE_TYPE;
        }
        dispatch(
            updateModule({
                ...module,
                type,
                customType,
            } as OscillatorModule),
        );
    };

    useEffect(() => {
        updateModuleOscType();
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
    }, [oscType]);

    const renderSelectOscType = () => {
        return oscillator_types.map((radioType) => (
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
        ));
    };

    const renderSelectedOscType = () => {
        switch (oscType) {
            case 'preset':
                return <CustomWaveTypeController />;
            case 'table':
                return <WaveTableController />;
            default:
                return <WaveTypeController />;
        }
    };
    return (
        <>
            <div style={{ display: 'flex' }}>{renderSelectOscType()}</div>
            {renderSelectedOscType()}
        </>
    );
};

export default OscillatorWaveSelection;

const WAVETABLE_TYPE = 'wavetable';
type OscType = 'simple' | 'table' | 'preset';
const oscillator_types: OscType[] = ['simple', 'table', 'preset'];
