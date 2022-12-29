import { FC, useState } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import Button from 'src/components/common/core/button';
import List from 'src/components/common/layouts/list';
import { freeze, release } from 'src/reducers/oscillatorsSlice';

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
