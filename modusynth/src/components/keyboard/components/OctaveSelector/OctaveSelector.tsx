import { FC, MouseEvent } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import Button from 'src/components/01_core/button';
import { changeOctave, getOctave } from 'src/reducers/synthSlice';

import './styles.scss';

const octaves = [...Array(9).keys()];

const OctaveSelector: FC = () => {
    const dispatch = useAppDispatch();
    const currentOctave = getOctave();

    const onClick = (e: MouseEvent): void => {
        const { id } = e.target as HTMLInputElement;
        const newOctave = parseInt(id.replace('octave', ''));
        dispatch(changeOctave(newOctave));
    };

    return (
        <div className="octaveselector">
            {octaves.map((octave) => (
                <Button
                    key={octave}
                    title={`C${octave}`}
                    id={`octave${octave}`}
                    onClick={onClick}
                    className={'octaveselector__button'}
                    buttonKind={currentOctave === octave ? 'active' : undefined}
                />
            ))}
        </div>
    );
};

export default OctaveSelector;
