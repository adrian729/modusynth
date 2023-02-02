/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable jsx-a11y/no-access-key */

/* eslint-disable react/no-unknown-property */

/* eslint-disable jsx-a11y/label-has-associated-control */
import {
    ChangeEvent,
    FC,
    InputHTMLAttributes,
    MouseEvent,
    PointerEvent,
    WheelEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import { useWindowSize } from 'usehooks-ts';

import './styles.scss';

interface KnobProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label?: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    resetValue?: number;
    onChange: (e: ChangeEvent) => void;
    updateValue: (value: number) => void;
}
const Knob: FC<KnobProps> = ({
    id,
    label,
    value,
    min = 0,
    max = 100,
    step = (max - min) / 100,
    resetValue = 0,
    onChange,
    updateValue,
}) => {
    const { height } = useWindowSize();

    const knobRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const indicatorRef = useRef<SVGPathElement>(null);
    const emptyIndicatorRef = useRef<SVGPathElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const labelRef = useRef<HTMLLabelElement>(null);
    const { current: currentKnob } = { ...knobRef };
    const { current: currentSvg } = { ...svgRef };
    const { current: currentIndicator } = { ...indicatorRef };
    const { current: currentEmptyIndicator } = { ...emptyIndicatorRef };
    const { current: currentInput } = { ...inputRef };

    const [strokeDashoffset, setStrokeDashoffset] = useState(0);

    const [startClientY, setStartClientY] = useState<number>();
    const [initialValue, setInitialValue] = useState<number>(0);

    const changeInput = (event: ChangeEvent) => {
        const { value } = event.target as HTMLInputElement;
        updateInput(parseFloat(value));
    };

    const updateInput = (val: number) => {
        if (!val) {
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
        updateValue(resetValue);
    };

    const click = (event: MouseEvent) => {
        // if (!currentInput || !currentKnob || currentInput.disabled) {
        //     return;
        // }
        // const b = currentKnob.getBoundingClientRect();
        // const c = { x: b.width / 2, y: b.height / 2 };
        // const p1 = { x: 0, y: b.height }; // stroke-width 8 of path ?
        // const p2 = { x: event.pageX - b.left, y: event.pageY - b.top };
        // console.log('event', event);
        // console.log('b', b);
        // console.log('c', c);
        // console.log('p1', p1);
        // console.log('p2', p2);
        // const rad = angle(p1, c, p2);
        // console.log('rad', rad);
        // let deg = rad * (180 / Math.PI);
        // console.log('deg', deg);
        // if (p2.x > b.width / 2 && deg < 180) {
        //     deg = 360 - deg;
        // }
        // const dif = Math.abs(max - min);
        // deg = 360;
        // // console.log(parseInt(deg,10) +'°', (dif/270)*deg);
        // updateValue((dif / 360) * deg);
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

    const onStart = useCallback(
        (event: MouseEvent) => {
            setStartClientY(event.clientY);
            setInitialValue(value);
        },
        [value],
    );

    useEffect(() => {
        const onUpdate = (event: globalThis.MouseEvent) => {
            if (startClientY) {
                updateInput(
                    initialValue - step * (event.clientY - startClientY),
                );
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
            className="knob"
            ref={knobRef}
            onDoubleClick={dblclick}
            // onPointerDown={start}
        >
            <svg
                ref={svgRef}
                viewBox="0 0 100 100"
                onMouseDown={onStart}
                // onMouseMove={move}
                // onMouseUp={end}
                // onBlur={end}
            >
                <path
                    ref={emptyIndicatorRef}
                    d="M20,76 A 40 40 0 1 1 80 76"
                    onClick={click}
                ></path>
                <path
                    ref={indicatorRef}
                    d="M20,76 A 40 40 0 1 1 80 76"
                    style={{ strokeDashoffset: `${strokeDashoffset}%` }}
                    onClick={click}
                ></path>
            </svg>
            <input
                ref={inputRef}
                id={id}
                type="number"
                value={value}
                min={min}
                max={max}
                step={step}
                placeholder="-"
                autoComplete="off"
                onChange={changeInput}
                // onKeyDown={(e) => knobkeys(e)}
            />
            {label ? (
                <label ref={labelRef} htmlFor={id} data-unit="db">
                    {label}
                </label>
            ) : null}
        </div>
    );
};

export default Knob;

const path = '<path d="M20,76 A 40 40 0 1 1 80 76"/>'; // 184 svg units for full stroke

function angle(
    p1: { x: number; y: number },
    c: { x: number; y: number },
    p2: { x: number; y: number },
) {
    // Point 1, circle center point, point 2
    var p1c = Math.sqrt(Math.pow(c.x - p1.x, 2) + Math.pow(c.y - p1.y, 2)),
        cp2 = Math.sqrt(Math.pow(c.x - p2.x, 2) + Math.pow(c.y - p2.y, 2)),
        p1p2 = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    return Math.acos((cp2 * cp2 + p1c * p1c - p1p2 * p1p2) / (2 * cp2 * p1c));
}

/**
 * - Knob at 0 degrees points up (12 o'clock).
 * - Knob indicator covers 264 degrees (0 at 227 degrees and 264 at 132 degrees)
 */
