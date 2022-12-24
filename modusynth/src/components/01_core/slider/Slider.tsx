import { ChangeEvent, FC, InputHTMLAttributes, MouseEvent } from 'react';

import './styles.scss';

type Orientation = 'vertical' | 'horizontal';
interface SliderProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    resetValue?: number;
    onChange: (e: ChangeEvent) => void;
    onSliderReset: (id: string, val: number) => void;
    orientation?: Orientation;
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
    orientation = 'vertical',
    ...restProps
}: any) => {
    const handleClick = (e: MouseEvent): void => {
        let { detail, target } = e;
        if (detail === 2) {
            let val: number = resetValue ?? (max + min) / 2;
            let { id } = target as HTMLInputElement;
            onSliderReset(id, val);
        }
    };

    return (
        <div className="flex flex-col flex-nowrap justify-center items-center">
            <h6>{id}</h6>
            <div>
                <h6>{value ? Math.floor(value * 100) / 100 : 0}</h6>
            </div>
            <div className="slider__container">
                <input
                    id={id}
                    value={value || 0}
                    min={min || 0}
                    max={max || 100}
                    step={step || 1}
                    onClick={handleClick}
                    onChange={onChange}
                    type="range"
                    className={orientation}
                    {...restProps}
                />
            </div>
        </div>
        // <div className="slider">
        // <h6>
        //     {id}: {value ? Math.round(value * 100) / 100 : 0}
        // </h6>
        //     <input
        //         id={id}
        //         value={value}
        //         min={min}
        //         max={max}
        //         step={step}
        //         type="range"
        //         onClick={handleClick}
        //         onChange={onChange}
        //         {...restProps}
        //     />
        // </div>
    );
};

export default Slider;
