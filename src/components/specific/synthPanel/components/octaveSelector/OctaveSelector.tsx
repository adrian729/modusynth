import { FC, MouseEvent } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import Button from 'src/components/common/core/button';
import List from 'src/components/common/layouts/list';
import { changeOctave, getOctave } from 'src/reducers/synthSlice';

const octaves = [-3, -2, -1, 0, 1, 2, 3];

const OctaveSelector: FC = () => {
    const dispatch = useAppDispatch();
    const currentOctave = getOctave();

    const onClick = (e: MouseEvent): void => {
        const { id } = e.target as HTMLInputElement;
        const newOctave = parseInt(id.replace('octaveselector', ''));
        dispatch(changeOctave(newOctave));
    };

    return (
        <List
            className="segmented mx-auto mb-[0.4rem] w-fit"
            direction="row"
            alignment="center"
        >
            {octaves.map((val) => {
                const octave = val;
                return (
                    <Button
                        key={octave}
                        id={`octaveselector${octave}`}
                        title={`${octave > 0 ? '+' : ''}${octave}`}
                        className={'text-[x-small]'}
                        onClick={onClick}
                        buttonKind={
                            currentOctave === octave ? 'active' : undefined
                        }
                    />
                );
            })}
        </List>
    );
};

export default OctaveSelector;
