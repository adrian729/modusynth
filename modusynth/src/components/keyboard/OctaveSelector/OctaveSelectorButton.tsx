import { FC, MouseEvent } from 'react';

interface OctaveSelectorButtonProps {
    octaveName: string;
    keyboardStartingNote: string;
    changeOctave: (id: string) => void;
}
const OctaveSelectorButton: FC<OctaveSelectorButtonProps> = ({
    octaveName,
    keyboardStartingNote,
    changeOctave,
}) => {
    const onClick = (e: MouseEvent): void => {
        let { id } = e.target as HTMLInputElement;
        changeOctave(id);
    };

    return (
        <button
            id={octaveName}
            key={octaveName}
            onClick={onClick}
            className={(octaveName === keyboardStartingNote && 'active') || ''}
        >
            {octaveName}
        </button>
    );
};
export default OctaveSelectorButton;
