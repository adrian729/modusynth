import { ChangeEvent, FC } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import ModuleContext from 'src/components/modules/context/ModuleContext/ModuleContext';
import useSafeContext from 'src/hooks/useSafeContext';
import { Module, updateModule, useModule } from 'src/reducers/synthesisSlice';

interface ModuleWithFreq extends Module {
    freq: number;
}

const FrequencyController: FC = () => {
    const dispatch = useAppDispatch();

    const { moduleId } = useSafeContext(ModuleContext);
    const module = useModule(moduleId) as ModuleWithFreq;
    const { freq = 0 } = { ...module };

    const onChangeFreq = (e: ChangeEvent): void => {
        const { value } = e.target as HTMLInputElement;
        dispatch(
            updateModule({
                ...module,
                freq: value ? parseFloat(value) : 0,
            } as ModuleWithFreq),
        );
    };

    return (
        <label className="control-field">
            <span className="control-label">freq</span>
            <input
                className="control-input w-24"
                type="number"
                id={`${moduleId}_freq`}
                value={freq}
                onChange={onChangeFreq}
                min={0}
                max={20000}
            />
        </label>
    );
};

export default FrequencyController;
