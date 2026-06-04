import { FC } from 'react';

export type WaveKind = 'sine' | 'triangle' | 'square' | 'sawtooth';

const PATHS: Record<WaveKind, string> = {
    sine: 'M1 8 Q 6 0 11 8 T 21 8',
    triangle: 'M1 12 L 6 4 L 11 12 L 16 4 L 21 12',
    square: 'M1 12 L 1 4 L 11 4 L 11 12 L 21 12 L 21 4',
    sawtooth: 'M1 12 L 11 4 L 11 12 L 21 4 L 21 12',
};

interface WaveIconProps {
    kind: WaveKind;
    className?: string;
}

// Inherits color via currentColor so active/inactive button states tint it.
const WaveIcon: FC<WaveIconProps> = ({ kind, className }) => (
    <svg
        className={className}
        width="22"
        height="16"
        viewBox="0 0 22 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d={PATHS[kind]} />
    </svg>
);

export default WaveIcon;
