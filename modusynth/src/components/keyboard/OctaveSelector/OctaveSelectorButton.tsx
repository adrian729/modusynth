import { FC, MouseEvent } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import { changeOctave, getOctave } from 'src/reducers/notesSlice';

interface OctaveSelectorButtonProps {
    octaveNumber: number;
}
const OctaveSelectorButton: FC<OctaveSelectorButtonProps> = ({
    octaveNumber,
}) => {
    const dispatch = useAppDispatch();
    const octave = getOctave();

    const onClick = (e: MouseEvent): void => {
        let { id } = e.target as HTMLInputElement;
        let newOctave = parseInt(id.replace('octave', ''));
        dispatch(changeOctave(newOctave));
    };

    return (
        <button
            id={`${octaveNumber}octave`}
            onClick={onClick}
            className={octaveNumber === octave ? 'active' : ''}
        >
            {`C${octaveNumber}`}
        </button>
    );
};
export default OctaveSelectorButton;
