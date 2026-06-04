import { ChangeEvent } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import Slider from 'src/components/common/core/slider/Slider';
import ModuleContext from 'src/components/modules/context/ModuleContext/ModuleContext';
import useSafeContext from 'src/hooks/useSafeContext';
import {
    EnvelopeModule,
    updateModule,
    useModule,
} from 'src/reducers/synthesisSlice';

// TODO: Envelope Controller with screen visualization/control (example: https://djpmusicschool.com/wp-content/uploads/ADSR-1024x499.jpg)
const EnvelopeController = () => {
    const dispatch = useAppDispatch();

    const { moduleId } = useSafeContext(ModuleContext);
    const module = useModule(moduleId) as EnvelopeModule;
    const { envelope } = {
        ...module,
    };
    const { attack = 0, decay = 0, sustain = 1, release = 0 } = envelope;

    const updateValue = (id: string, value: number): void => {
        dispatch(
            updateModule({
                ...module,
                envelope: {
                    ...envelope,
                    [id.replace(`${moduleId}_`, '')]: value,
                },
            } as EnvelopeModule),
        );
    };

    const change = (e: ChangeEvent): void => {
        const { id, value } = e.target as HTMLInputElement;
        updateValue(id, parseFloat(value));
    };

    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <Slider
                id={`${moduleId}_attack`}
                label="A"
                value={attack}
                min={0.005}
                max={2}
                step={0.005}
                onChange={change}
                onSliderReset={updateValue}
                resetValue={0.005}
            />
            <Slider
                id={`${moduleId}_decay`}
                label="D"
                value={decay}
                min={0}
                max={1}
                step={0.01}
                onChange={change}
                onSliderReset={updateValue}
                resetValue={0.1}
            />
            <Slider
                id={`${moduleId}_sustain`}
                label="S"
                value={sustain}
                min={0}
                max={1}
                step={0.01}
                onChange={change}
                onSliderReset={updateValue}
                resetValue={0.6}
            />
            <Slider
                id={`${moduleId}_release`}
                label="R"
                value={release}
                min={0}
                max={2}
                step={0.02}
                onChange={change}
                onSliderReset={updateValue}
                resetValue={0.1}
            />
        </div>
    );
};

export default EnvelopeController;
