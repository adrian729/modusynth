import { ChangeEvent, FC, useState } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import Slider from 'src/components/common/core/slider/Slider';
import ModuleContext from 'src/components/modules/context/ModuleContext/ModuleContext';
import useSafeContext from 'src/hooks/useSafeContext';
import { Module, getModule, updateModule } from 'src/reducers/synthesisSlice';
import { useDebounce } from 'usehooks-ts';

interface ModuleWithPitch extends Module {
    pitch: number;
}

const PitchController: FC = () => {
    const dispatch = useAppDispatch();

    const { moduleId } = useSafeContext(ModuleContext);
    const module = getModule(moduleId) as ModuleWithPitch;
    const { pitch } = module;

    // TODO: fix debounces usability
    const [minPitch, setMinPitch] = useState<number>(-1200);
    const [maxPitch, setMaxPitch] = useState<number>(1200);
    const debouncedMinPitch = useDebounce<number>(minPitch, 500);
    const debouncedMaxPitch = useDebounce<number>(maxPitch, 500);

    const onChangePitch = (e: ChangeEvent): void => {
        updatePitch(parseFloat((e.target as HTMLInputElement).value));
    };

    const updatePitch = (pitch: number): void => {
        dispatch(updateModule({ ...module, pitch } as ModuleWithPitch));
    };

    const onChangeMinPitch = (e: ChangeEvent) => {
        const { value } = e.target as HTMLInputElement;
        setMinPitch(value ? parseFloat(value) : 0);
    };
    const onChangeMaxPitch = (e: ChangeEvent) => {
        const { value } = e.target as HTMLInputElement;
        setMaxPitch(value ? parseFloat(value) : 0);
    };

    return (
        <div>
            <Slider
                id={`${moduleId}_pitch`}
                label="pitch"
                value={pitch}
                onChange={onChangePitch}
                onSliderReset={(id, value) => updatePitch(value)}
                resetValue={0}
                min={debouncedMinPitch}
                max={debouncedMaxPitch}
                step={0.01}
            />
            <span>Min:</span>
            <input
                type="number"
                id={`${moduleId}_max_pitch`}
                value={minPitch}
                onChange={onChangeMinPitch}
                min={-7200}
                max={7200}
            />
            <span>Max:</span>
            <input
                type="number"
                id={`${moduleId}_max_pitch`}
                value={maxPitch}
                onChange={onChangeMaxPitch}
                min={-7200}
                max={7200}
            />
        </div>
    );
};

export default PitchController;
