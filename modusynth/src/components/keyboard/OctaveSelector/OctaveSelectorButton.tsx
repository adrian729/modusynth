import { FC, MouseEvent } from 'react';

interface OctaveSelectorButtonProps {
    octave: number;
    startingOctave: number;
    changeOctave: (id: number) => void;
}
const OctaveSelectorButton: FC<OctaveSelectorButtonProps> = ({
    octave,
    startingOctave,
    changeOctave,
}) => {
    const onClick = (e: MouseEvent): void => {
        let { id } = e.target as HTMLInputElement;
        changeOctave(parseInt(id.replace('octave', '')));
    };

    return (
        <button
            id={`${octave}octave`}
            key={octave}
            onClick={onClick}
            className={octave === startingOctave ? 'active' : ''}
        >
            {`C${octave}`}
        </button>
    );
};
export default OctaveSelectorButton;
