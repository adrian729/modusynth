import { ChangeEvent, FC, useState } from 'react';

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

interface NumericControllerProps extends Partial<SliderProps> {
    paramId: string;
    hasMinInput?: boolean;
    hasMaxInput?: boolean;
    minInputMin?: number;
    minInputMax?: number;
    maxInputMin?: number;
    maxInputMax?: number;
}
const NumericController: FC<NumericControllerProps> = ({
    paramId,
    hasMinInput = false,
    hasMaxInput = false,
    minInputMin,
    maxInputMin,
    minInputMax,
    maxInputMax,
    min = 0,
    max = 100,
    ...restProps
}) => {
    const dispatch = useAppDispatch();

    const { moduleId } = useSafeContext(ModuleContext);
    const module = getModule(moduleId) as unknown as ModuleWithNumericParam;
    const { [paramId]: value = 0 } = { ...module };

    const [minVal, setMinVal] = useState<number>(min);
    const [maxVal, setMaxVal] = useState<number>(max);
    const debouncedMin = useDebounce<number>(minVal, 500);
    const debouncedMax = useDebounce<number>(maxVal, 500);

    const onChangeValue = (e: ChangeEvent): void => {
        updateValue(parseFloat((e.target as HTMLInputElement).value));
    };

    const updateValue = (value: number): void => {
        dispatch(
            updateModule({ ...module, [paramId]: value } as unknown as Module),
        );
    };

    const onChangeMinVal = (e: ChangeEvent): void => {
        const { value = '0' } = e.target as HTMLInputElement;
        setMinVal(parseFloat(value));
    };

    const onChangeMaxVal = (e: ChangeEvent): void => {
        const { value = '0' } = e.target as HTMLInputElement;
        setMaxVal(parseFloat(value));
    };

    return (
        <div>
            <Knob
                id={`${moduleId}_${paramId}_knob`}
                label={paramId}
                value={value}
                onChange={onChangeValue}
                min={debouncedMin}
                max={debouncedMax}
            />
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
            {hasMinInput ? (
                <>
                    <span>Min:</span>
                    <input
                        type="number"
                        id={`${moduleId}_min_${paramId}`}
                        value={minVal}
                        onChange={onChangeMinVal}
                        min={minInputMin}
                        max={
                            minInputMax ? Math.min(minInputMax, maxVal) : maxVal
                        }
                    />
                </>
            ) : null}
            {hasMaxInput ? (
                <>
                    <span>Max:</span>
                    <input
                        type="number"
                        id={`${moduleId}_max_${paramId}`}
                        value={maxVal}
                        onChange={onChangeMaxVal}
                        min={
                            maxInputMin ? Math.max(maxInputMin, minVal) : minVal
                        }
                        max={maxInputMax}
                    />
                </>
            ) : null}
        </div>
    );
};

export default NumericController;
