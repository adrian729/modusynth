import { ChangeEvent, FC, InputHTMLAttributes, MouseEvent } from 'react';

import Container from 'src/components/00_layouts/container/Container';

import './styles.scss';

type Orientation = 'vertical' | 'horizontal';
export interface SliderProps extends InputHTMLAttributes<HTMLInputElement> {
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
}: SliderProps) => {
    const handleClick = (e: MouseEvent): void => {
        let { detail, target } = e;
        if (detail === 2) {
            const val: number = resetValue ?? (max + min) / 2;
            const { id } = target as HTMLInputElement;
            onSliderReset(id, val);
        }
    };

    return (
        <Container alignContent="center-content" className="slider">
            {/* <div className="flex flex-col flex-nowrap justify-center items-center"> */}
            <div className="slider__header">
                <h6 className="slider__title">{id}</h6>
                <h6 className="slider__value">
                    {value ? Math.floor(value * 100) / 100 : 0}
                </h6>
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
                    className={!!orientation && `slider--${orientation}`}
                    {...restProps}
                />
            </div>
            {/* </div> */}
        </Container>
    );
};

export default Slider;
