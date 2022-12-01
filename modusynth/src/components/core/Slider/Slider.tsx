import { ChangeEventHandler, FC, InputHTMLAttributes } from 'react';

import './Slider.scss';

interface SliderProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    value: number;
    change: ChangeEventHandler;
}
const Slider: FC<SliderProps> = ({
    id,
    value,
    change,
    min = 0,
    max = 100,
    step = 1,
    ...restProps
}) => {
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
                onChange={change}
                type="range"
                {...restProps}
            />
        </div>
    );
};

export default Slider;
