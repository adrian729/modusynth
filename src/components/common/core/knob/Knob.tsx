import {
    ChangeEvent,
    FC,
    InputHTMLAttributes,
    MouseEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import './styles.scss';

export interface KnobProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label?: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    resetValue?: number;
    updateValue: (value: number) => void;
    knobSize?: 'small' | 'medium' | 'big';
}
const Knob: FC<KnobProps> = ({
    id,
    label,
    value,
    min = 0,
    max = 100,
    step = (max - min) / 100,
    resetValue = 0,
    knobSize = 'medium',
    updateValue,
}) => {
    const knobRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const indicatorRef = useRef<SVGPathElement>(null);
    const emptyIndicatorRef = useRef<SVGPathElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const labelRef = useRef<HTMLLabelElement>(null);
    const { current: currentSvg } = { ...svgRef };
    const { current: currentKnob } = { ...knobRef };
    const { current: currentIndicator } = { ...indicatorRef };
    const { current: currentEmptyIndicator } = { ...emptyIndicatorRef };

    const [strokeDashoffset, setStrokeDashoffset] = useState(0);

    const [startClientY, setStartClientY] = useState<number>();

    const changeInput = (event: ChangeEvent) => {
        const { value } = event.target as HTMLInputElement;
        updateInput(parseFloat(value));
    };

    const updateInput = (val: number) => {
        if (!Number.isFinite(val)) {
            return;
        }
        let res = val;
        if (val > max) {
            res = max;
        }
        if (val < min) {
            res = min;
        }
        updateValue(res);
    };

    const dblclick = () => {
        updateInput(resetValue);
    };

    const moveIndicator = (event: MouseEvent) => {
        if (!currentSvg) {
            return;
        }
        const b = currentSvg.getBoundingClientRect();
        const centerPoint = { x: b.width / 2, y: b.height / 2 };
        const pointerPoint = {
            x: event.clientX - b.left,
            y: event.clientY - b.top,
        };
        const centerVector = { x: 0, y: -centerPoint.y }; // vector from center of the box straight to the top
        const pointerVector = {
            x: pointerPoint.x - centerPoint.x,
            y: pointerPoint.y - centerPoint.y,
        }; // vector from the center to the pointer
        const rad = angle(pointerVector, centerVector);
        let deg = rad * (180 / Math.PI);
        deg = pointerPoint.x < centerPoint.x ? 132 - deg : 132 + deg;
        const dif = Math.abs(max - min);
        updateInput((dif * deg) / 264 + min);
    };

    const scale = ({
        value,
        min = 0,
        max = 100,
        scaledMin = 0,
        scaledMax = 1,
    }: {
        value: number;
        min?: number;
        max?: number;
        scaledMin?: number;
        scaledMax?: number;
    }): number => {
        const range = Math.abs(max - min);
        const newRange = Math.abs(scaledMax - scaledMin);
        return (newRange * (value - min)) / range + scaledMin;
    };

    useEffect(() => {
        if (currentKnob) {
            const scaledValue = scale({ value, min, max });
            let deg = scale({
                value: scaledValue,
                min: 0,
                max: 1,
                scaledMin: -132,
                scaledMax: 132,
            });
            currentKnob.style.setProperty('--knob-deg', deg.toString());
        }
    }, [currentKnob, value]);

    useEffect(() => {
        if (!currentIndicator || !currentEmptyIndicator) {
            return;
        }
        setStrokeDashoffset(-scale({ value, min, max, scaledMax: 184 }));
    }, [currentIndicator, currentEmptyIndicator, value]);

    const onStart = useCallback((event: MouseEvent) => {
        setStartClientY(event.clientY);
        moveIndicator(event as unknown as MouseEvent);
    }, []);

    useEffect(() => {
        // TODO: check if we can also get the position with the degree between center and pointer (like we do on click)?
        const onUpdate = (event: globalThis.MouseEvent) => {
            if (startClientY) {
                moveIndicator(event as unknown as MouseEvent);
            }
        };

        const onEnd = () => {
            setStartClientY(undefined);
        };

        // TODO: while moving avoid selecting text/other items....
        document.addEventListener('mousemove', onUpdate);
        document.addEventListener('mouseup', onEnd);

        return () => {
            document.removeEventListener('mousemove', onUpdate);
            document.removeEventListener('mouseup', onEnd);
        };
    }, [startClientY]);

    return (
        <div
            className={`knob ${knobSize}`}
            ref={knobRef}
            onDoubleClick={dblclick}
        >
            <svg
                ref={svgRef}
                viewBox="0 0 100 100"
                onMouseDown={onStart}
                onClick={moveIndicator}
            >
                <path
                    ref={emptyIndicatorRef}
                    d="M20,76 A 40 40 0 1 1 80 76" // 184 svg units for full stroke
                ></path>
                <path
                    ref={indicatorRef}
                    d="M20,76 A 40 40 0 1 1 80 76" // 184 svg units for full stroke
                    style={{ strokeDashoffset: `${strokeDashoffset}%` }}
                ></path>
            </svg>
            <input
                ref={inputRef}
                id={id}
                type="number"
                value={getRoundedValue(value, 2)}
                min={min}
                max={max}
                step={step}
                placeholder="-"
                autoComplete="off"
                onChange={changeInput}
            />
            {label ? (
                <label ref={labelRef} htmlFor={id}>
                    {label}
                </label>
            ) : null}
            <data data-min={min} data-max={max} aria-hidden="true"></data>
        </div>
    );
};

export default Knob;

function getRoundedValue(value: number, decimals: number) {
    const decimator = Math.pow(10, decimals);
    return (Math.round(value * decimator) / decimator).toFixed(decimals);
}

function magnitude({ x, y }: { x: number; y: number }): number {
    return Math.sqrt(x * x + y * y);
}

function angle(
    vector1: { x: number; y: number },
    vector2: { x: number; y: number },
): number {
    return Math.acos(
        (vector2.x * vector1.x + vector2.y * vector1.y) /
            (magnitude(vector1) * magnitude(vector2)),
    );
}

/**
 * - Knob at 0 degrees points up (12 o'clock).
 * - Knob indicator covers 264 degrees (0 at 227 degrees and 264 at 132 degrees)
 */
