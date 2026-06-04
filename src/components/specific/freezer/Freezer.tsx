import { FC } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import Button from 'src/components/common/core/button/Button';
import List from 'src/components/common/layouts/list/List';
import {
    clearDrones,
    freeze,
    useFrozenNotes,
} from 'src/reducers/oscillatorsSlice';

const Freezer: FC = () => {
    const dispatch = useAppDispatch();
    const hasDrones = Object.keys(useFrozenNotes()).length > 0;

    return (
        <div className="flex flex-col items-center gap-1">
            <span className="control-label">freezer</span>
            <List
                className="gap-x-8 gap-y-4"
                direction="column"
                alignment="center"
            >
                <Button
                    title="FREEZE"
                    buttonKind={hasDrones ? 'active' : undefined}
                    onClick={() => dispatch(freeze())}
                />
                <Button
                    title="RELEASE"
                    buttonKind={hasDrones ? 'warning' : undefined}
                    onClick={() => dispatch(clearDrones())}
                />
            </List>
        </div>
    );
};

export default Freezer;
