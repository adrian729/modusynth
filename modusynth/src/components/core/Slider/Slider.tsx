import { ChangeEvent, FC, InputHTMLAttributes, MouseEvent } from 'react';

import './Slider.scss';

interface SliderProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    resetValue?: number;
    onChange: (e: ChangeEvent) => void;
    onSliderReset: (id: string, val: number) => void;
}
const Slider: FC<SliderProps> = ({
    id,
    value,
    resetValue,
    min = 0,
    max = 100,
    step = 1,
    onChange,
    onSliderReset,
    ...restProps
}) => {
    const handleClick = (e: MouseEvent): void => {
        let { detail, target } = e;
        if (detail === 2) {
            let val: number = resetValue ?? (max + min) / 2;
            let { id } = target as HTMLInputElement;
            onSliderReset(id, val);
        }
    };

    return (
        <div className="slider">
            <h6>
                {id}: {value ? Math.round(value * 100) / 100 : 0}
            </h6>
            <input
                id={id}
                value={value}
                min={min}
                max={max}
                step={step}
                type="range"
                onClick={handleClick}
                onChange={onChange}
                {...restProps}
            />
        </div>
    );
};

export default Slider;
