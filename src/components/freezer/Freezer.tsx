import { FC, useState } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import List from 'src/components/00_layouts/list';
import Button from 'src/components/01_core/button';
import { freeze, release } from 'src/reducers/synthSlice';

const Freezer: FC = () => {
    const dispatch = useAppDispatch();
    const [hasDrones, setHasDrones] = useState<boolean>();

    const addDrones = (): void => {
        dispatch(freeze());
        setHasDrones(true);
    };

    const killDrones = (): void => {
        dispatch(release());
        setHasDrones(false);
    };

    return (
        <List direction="row" alignment="center">
            <Button
                title="FREEZE"
                buttonKind={hasDrones ? 'active' : undefined}
                onClick={addDrones}
            />
            <Button
                title="RELEASE"
                buttonKind={hasDrones ? 'warning' : undefined}
                onClick={killDrones}
            />
        </List>
    );
};

export default Freezer;
