import { ChangeEvent, FC, useState } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import Slider from 'src/components/common/core/slider/Slider';
import ModuleContext from 'src/components/modules/context/ModuleContext/ModuleContext';
import useSafeContext from 'src/hooks/useSafeContext';
import { Module, getModule, updateModule } from 'src/reducers/synthesisSlice';
import { useDebounce } from 'usehooks-ts';

interface ModuleWithGain extends Module {
    gain: number;
}

const GainController: FC = () => {
    const dispatch = useAppDispatch();

    const { moduleId } = useSafeContext(ModuleContext);
    const module = getModule(moduleId) as ModuleWithGain;
    const { gain } = module;

    // TODO: fix debounces usability
    const [maxGain, setMaxGain] = useState<number>(2);
    const debouncedMaxGain = useDebounce<number>(maxGain, 500);

    const onChangeGain = (e: ChangeEvent): void => {
        updateGain(parseFloat((e.target as HTMLInputElement).value));
    };

    const updateGain = (gain: number): void => {
        dispatch(updateModule({ ...module, gain } as ModuleWithGain));
    };

    const onChangeMaxGain = (e: ChangeEvent): void => {
        const { value } = e.target as HTMLInputElement;
        setMaxGain(value ? parseFloat(value) : 0);
    };

    return (
        <div>
            <Slider
                id={`${moduleId}_gain`}
                label="gain"
                value={gain}
                onChange={onChangeGain}
                onSliderReset={(id, value) => updateGain(value)}
                resetValue={0.2}
                min={0}
                max={debouncedMaxGain}
                step={0.005}
            />
            <span>Max:</span>
            <input
                type="number"
                id={`${moduleId}_max_gain`}
                value={maxGain}
                onChange={onChangeMaxGain}
                min={1}
            />
        </div>
    );
};

export default GainController;
