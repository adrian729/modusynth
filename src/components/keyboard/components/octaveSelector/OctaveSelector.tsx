import { FC, MouseEvent } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import List from 'src/components/00_layouts/list';
import Button from 'src/components/01_core/button';
import { changeOctave, getOctave } from 'src/reducers/synthSlice';

import './styles.scss';

const octaves = [...Array(9).keys()];

const OctaveSelector: FC = () => {
    const dispatch = useAppDispatch();
    const currentOctave = getOctave();

    const onClick = (e: MouseEvent): void => {
        const { id } = e.target as HTMLInputElement;
        const newOctave = parseInt(id.replace('C', ''));
        dispatch(changeOctave(newOctave));
    };

    return (
        <List className="octaveselector" direction="row" alignment="center">
            {octaves.map((octave) => (
                <Button
                    key={octave}
                    id={`C${octave}`}
                    title={`C${octave}`}
                    className={'octaveselector__item'}
                    onClick={onClick}
                    buttonKind={currentOctave === octave ? 'active' : undefined}
                />
            ))}
        </List>
    );
};

export default OctaveSelector;
