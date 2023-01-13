import { ChangeEvent, FC } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import ModuleContext from 'src/components/modules/context/ModuleContext/ModuleContext';
import useSafeContext from 'src/hooks/useSafeContext';
import { Module, getModule, updateModule } from 'src/reducers/synthesisSlice';

interface ModuleWithFreq extends Module {
    freq: number;
}

const FrequencyController: FC = () => {
    const dispatch = useAppDispatch();

    const { moduleId } = useSafeContext(ModuleContext);
    const module = getModule(moduleId) as unknown as ModuleWithFreq;
    const { freq } = module;

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
        <div>
            <span>Freq:</span>
            <input
                type="number"
                id={`${moduleId}_freq`}
                value={freq}
                onChange={onChangeFreq}
                min={0}
                max={20000}
            />
        </div>
    );
};

export default FrequencyController;
