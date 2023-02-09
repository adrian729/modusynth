import { ChangeEvent, FC, useEffect, useState } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import Knob from 'src/components/common/core/knob/Knob';
import Slider, { SliderProps } from 'src/components/common/core/slider/Slider';
import ModuleContext from 'src/components/modules/context/ModuleContext/ModuleContext';
import useSafeContext from 'src/hooks/useSafeContext';
import { Module, getModule, updateModule } from 'src/reducers/synthesisSlice';
import { useDebounce } from 'usehooks-ts';

interface ModuleWithNumericParam {
    [key: string]: number;
}

type ControllerType = 'fader' | 'knob';

// TODO: check properties of slider, knob etc and make them the same type
// TODO: fix Slider styles and change name to fader
export interface NumericControllerProps extends Partial<SliderProps> {
    controllerType?: ControllerType;
    paramId: string;
    hasMinInput?: boolean;
    hasMaxInput?: boolean;
    minInputMin?: number;
    minInputMax?: number;
    maxInputMin?: number;
    maxInputMax?: number;
    knobSize?: 'small' | 'medium' | 'big';
}
const NumericController: FC<NumericControllerProps> = ({
    controllerType = 'fader',
    paramId,
    hasMinInput = false,
    hasMaxInput = false,
    minInputMin,
    maxInputMin,
    minInputMax,
    maxInputMax,
    min = 0,
    max = 100,
    knobSize,
    ...restProps
}) => {
    const dispatch = useAppDispatch();

    const { moduleId } = useSafeContext(ModuleContext);
    const module = getModule(moduleId) as unknown as ModuleWithNumericParam;
    const { [paramId]: paramValue = 0 } = { ...module };

    const [value, setValue] = useState<number>(paramValue);
    const [minVal, setMinVal] = useState<number>(min);
    const [maxVal, setMaxVal] = useState<number>(max);

    const debouncedValue = useDebounce<number>(value, 2);
    const debouncedMin = useDebounce<number>(minVal, 500);
    const debouncedMax = useDebounce<number>(maxVal, 500);

    const onChangeValue = (e: ChangeEvent): void => {
        updateValue(parseFloat((e.target as HTMLInputElement).value));
    };

    const updateValue = (value: number): void => {
        setValue(value);
    };

    useEffect(() => {
        dispatch(
            updateModule({
                ...module,
                [paramId]: debouncedValue,
            } as unknown as Module),
        );
    }, [debouncedValue]);

    const onChangeMinVal = (e: ChangeEvent): void => {
        const { value = '0' } = e.target as HTMLInputElement;
        setMinVal(parseFloat(value));
    };

    const onChangeMaxVal = (e: ChangeEvent): void => {
        const { value = '0' } = e.target as HTMLInputElement;
        setMaxVal(parseFloat(value));
    };

    const renderInput = () => {
        switch (controllerType) {
            case 'knob':
                return (
                    <Knob
                        id={`${moduleId}_${paramId}_knob`}
                        label={paramId}
                        value={debouncedValue}
                        min={debouncedMin}
                        max={debouncedMax}
                        updateValue={updateValue}
                        knobSize={knobSize}
                    />
                );
            default: {
                return (
                    <Slider
                        {...{
                            ...restProps,
                            id: `${moduleId}_${paramId}`,
                            label: paramId,
                            value,
                            onChange: onChangeValue,
                            onSliderReset: (id, value) => updateValue(value),
                            min: debouncedMin,
                            max: debouncedMax,
                        }}
                    />
                );
            }
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexFlow: 'column',
                alignItems: 'center',
            }}
        >
            {renderInput()}
            {hasMinInput ? (
                <>
                    <span>min:</span>
                    <input
                        type="number"
                        id={`${moduleId}_min_${paramId}`}
                        value={minVal}
                        onChange={onChangeMinVal}
                        min={minInputMin}
                        max={
                            minInputMax ? Math.min(minInputMax, maxVal) : maxVal
                        }
                        style={{ maxWidth: '70px' }}
                    />
                </>
            ) : null}
            {hasMaxInput ? (
                <>
                    <span>max:</span>
                    <input
                        type="number"
                        id={`${moduleId}_max_${paramId}`}
                        value={maxVal}
                        onChange={onChangeMaxVal}
                        min={
                            maxInputMin ? Math.max(maxInputMin, minVal) : minVal
                        }
                        max={maxInputMax}
                        style={{ maxWidth: '70px' }}
                    />
                </>
            ) : null}
        </div>
    );
};

export default NumericController;
