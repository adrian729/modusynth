/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable jsx-a11y/no-access-key */

/* eslint-disable react/no-unknown-property */

/* eslint-disable jsx-a11y/label-has-associated-control */
import { ChangeEvent, FC, InputHTMLAttributes, useRef } from 'react';

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
}
const Knob: FC<KnobProps> = ({
    id,
    label,
    value,
    min = 0,
    max = 100,
    step = (max - min) / 100,
    onChange,
}) => {
    const inputRef = useRef(null);
    const labelRef = useRef(null);
    const { current: currentInput } = { ...inputRef };
    const { current: currentLabel } = { ...labelRef };

    return (
        <div className="knob">
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
