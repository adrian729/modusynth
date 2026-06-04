import { FC } from 'react';

interface InfoIconProps {
    className?: string;
}

// Inherits color via currentColor so button states tint it.
const InfoIcon: FC<InfoIconProps> = ({ className }) => (
    <svg
        className={className}
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
    >
        <circle cx="9" cy="9" r="7.5" />
        <line x1="9" y1="8" x2="9" y2="12.5" />
        <circle cx="9" cy="5.25" r="0.25" fill="currentColor" />
    </svg>
);

export default InfoIcon;
