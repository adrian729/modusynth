import { ButtonHTMLAttributes, FC, MouseEvent } from 'react';

import classNames from 'classnames';
import { useAppDispatch } from 'src/app/hooks';
import { changeOctave, getOctave } from 'src/reducers/notesSlice';

import './OctaveSelector.scss';

interface OctaveSelectorButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    octaveNumber: number;
}
const OctaveSelectorButton: FC<OctaveSelectorButtonProps> = ({
    octaveNumber,
    ...restProps
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
            className={classNames(
                octaveNumber === octave ? 'active' : '',
                'octaveselector__button',
            )}
            {...restProps}
        >
            {`C${octaveNumber}`}
        </button>
    );
};
export default OctaveSelectorButton;
