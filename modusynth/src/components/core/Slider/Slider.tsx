import { ChangeEventHandler, FC, MouseEventHandler } from 'react';

import './Slider.scss';

interface SliderProps {
    id: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    change: ChangeEventHandler;
    onClick?: MouseEventHandler;
}
const Slider: FC<SliderProps> = ({
    id,
    value,
    change,
    onClick,
    step = 1,
    min = 0,
    max = 100,
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
                onClick={onClick}
                type="range"
            />
        </div>
    );
};

export default Slider;
