import { FC } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import Button from 'src/components/common/core/button/Button';
import List from 'src/components/common/layouts/list/List';
import {
    clearDrones,
    freeze,
    getFrozenNotes,
} from 'src/reducers/oscillatorsSlice';

const Freezer: FC = () => {
    const dispatch = useAppDispatch();
    const hasDrones = Object.keys(getFrozenNotes()).length > 0;

    return (
        <List direction="row" alignment="center">
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
    );
};

export default Freezer;
