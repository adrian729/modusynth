import { ChangeEvent } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import ModuleContext from 'src/components/modules/context/ModuleContext/ModuleContext';
import useSafeContext from 'src/hooks/useSafeContext';
import { Module, getModule, updateModule } from 'src/reducers/synthesisSlice';

import customPeriodicWaveOptions from '../../../generators/oscillator/hooks/customWaveTypes/customWaveTypes';

interface ModuleWithCustomType extends Module {
    customType: string;
}

const customWaveTypes = Object.keys(customPeriodicWaveOptions);

const CustomWaveTypeController = () => {
    const dispatch = useAppDispatch();

    const { moduleId } = useSafeContext(ModuleContext);
    const module = getModule(moduleId) as ModuleWithCustomType;
    const { customType = 'none' } = { ...module };

    const changeType = (e: ChangeEvent): void => {
        const { value } = e.target as HTMLInputElement;
        if (customType !== value) {
            dispatch(
                updateModule({
                    ...module,
                    customType: value,
                } as ModuleWithCustomType),
            );
        }
    };

    return (
        <div>
            <select
                id={`${moduleId}_custom_wavetype_selector`}
                onChange={changeType}
                value={customType}
            >
                {customWaveTypes.map((waveType) => (
                    <option
                        key={`${moduleId}_custom_wavetype_${waveType}`}
                        value={waveType}
                    >
                        {waveType}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CustomWaveTypeController;
