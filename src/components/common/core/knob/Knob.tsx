/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable jsx-a11y/no-access-key */

/* eslint-disable react/no-unknown-property */

/* eslint-disable jsx-a11y/label-has-associated-control */
import {
    ChangeEvent,
    FC,
    InputHTMLAttributes,
    useEffect,
    useRef,
    useState,
} from 'react';

import { values } from 'lodash';

import './styles.scss';

interface KnobProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label?: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
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
    onChange,
    updateValue,
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const labelRef = useRef<HTMLLabelElement>(null);
    const { current: currentSvg } = { ...svgRef };
    const { current: currentInput } = { ...inputRef };
    const { current: currentLabel } = { ...labelRef };

    const [indicator, setIndicator] = useState<SVGElement | null>(null);
    const [fls, setFls] = useState<HTMLElement | null>(null);

    const [isSetup, setIsSetup] = useState<boolean>(false);

    const initSvg = (svg: SVGSVGElement) => {
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('aria-hidden', 'true');
        svg.innerHTML = path + path;
    };

    useEffect(() => {
        if (!isSetup && currentSvg && currentInput) {
            initSvg(currentSvg);
            setIndicator(
                currentSvg.querySelector('path:last-of-type') as SVGAElement,
            );
            setFls(currentInput.parentElement);
            setIsSetup(true);
        }
    }, [currentSvg, currentInput]);

    const input = () => {
        if (currentInput) {
            let val = parseFloat(currentInput.value.trim()) || min;
            if (val > max) val = max;
            else if (val < min) val = min;
            updateValue(val);
        }
    };

    useEffect(() => {
        if (indicator) {
            const dif = Math.abs(min) + Math.abs(max);
            const per = (value / dif) * 100;
            let deg = 0;
            // Normal number input
            if (per >= 0 && per <= 100 && per != 50) {
                deg = per * 1.32 * 2 - 132;
            }

            indicator.style.setProperty('stroke-dashoffset', -per * 1.84 + '%');
            fls?.style.setProperty('--knob-deg', deg.toString());
        }
    }, [indicator, value]);

    return (
        <div className="knob">
            <svg ref={svgRef} />
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
                onInput={input}
            />
            {label ? (
                <label ref={labelRef} htmlFor={id} accessKey="k" data-unit="db">
                    {label}
                </label>
            ) : null}
        </div>
    );
};

export default Knob;

const keys = {
    left: 37,
    right: 39,
    add: 107,
    sub: 109,
    home: 36,
    end: 35,
    space: 32,
    return: 13,
    esc: 27,
};
const path = '<path d="M20,76 A 40 40 0 1 1 80 76"/>'; // 184 svg units for full stroke
const curY = 0;
const moving = false;
