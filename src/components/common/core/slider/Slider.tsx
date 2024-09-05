import {
    ChangeEvent,
    FC,
    InputHTMLAttributes,
    MouseEvent,
    useState,
} from 'react';

import Container from 'src/components/common/layouts/container/Container';

// import './styles.scss';

type Orientation = 'vertical' | 'horizontal';
type TitlePosition = 'top' | 'bottom' | 'none';
export interface SliderProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label?: string;
    value: number;
    ref?: any;
    min?: number;
    max?: number;
    step?: number;
    resetValue?: number;
    onChange: (e: ChangeEvent) => void;
    onSliderReset?: (id: string, val: number) => void;
    sliderSize?: number;
    sliderSizeUnits?: string;
    orientation?: Orientation;
    titlePosition?: TitlePosition;
}
const Slider: FC<SliderProps> = ({
    id, // TODO: IDs should be unique when creating different Sliders
    label,
    value = 0,
    resetValue,
    min = 0,
    max = 100,
    step = 1,
    onChange,
    onSliderReset,
    sliderSize = 10,
    sliderSizeUnits = 'rem',
    orientation = 'horizontal',
    // orientation = 'vertical',
    titlePosition = 'top',
    ...restProps
}: SliderProps) => {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const [input, setInput] = useState<HTMLInputElement | null>(null);

    if (container && input) {
        setSliderHeight({
            container,
            input,
            size: sliderSize,
            units: sliderSizeUnits,
            orientation,
        });
    }

    const handleClick = (e: MouseEvent): void => {
        let { detail, target } = e;
        if (detail === 2 && onSliderReset) {
            const val: number = resetValue ?? (max + min) / 2;
            const { id } = target as HTMLInputElement;
            onSliderReset(id, val);
        }
    };

    return (
        <Container alignContent="center-content" className="slider">
            <div className="slider__header">
                {titlePosition === 'top' && (
                    <h6 className="slider__title">{label ?? id}</h6>
                )}
                <h6 className="slider__value">
                    {value ? Math.floor(value * 100) / 100 : 0}
                </h6>
            </div>
            <div className="slider__container" ref={setContainer}>
                <input
                    ref={setInput}
                    id={id}
                    value={value}
                    min={min}
                    max={max}
                    step={step}
                    onClick={handleClick}
                    onChange={onChange}
                    type="range"
                    // className={!!orientation && `slider--${orientation}`}
                    {...restProps}
                />
            </div>
            <div className="slider__footer">
                {titlePosition === 'bottom' && (
                    <h6 className="slider__title">{label ?? id}</h6>
                )}
            </div>
        </Container>
    );
};

export default Slider;

interface SetSliderHeightParams {
    container: HTMLDivElement;
    input: HTMLInputElement;
    size: number;
    units: string;
    orientation: Orientation;
}
const setSliderHeight = ({
    container,
    input,
    size,
    units,
    orientation,
}: SetSliderHeightParams): void => {
    container.style.height = `${size}${units}`;
    input.style.width = `${size}${units}`;
    if (orientation === 'vertical') {
        input.style.transform = `rotate(-90deg) translate(${
            size / 2
        }${units}, ${1.5 / 2 - size / 2}rem)`;
    }
};
