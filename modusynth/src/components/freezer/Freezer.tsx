import { FC, useState } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import Button from 'src/components/01_core/button';
import { freeze, release } from 'src/reducers/synthSlice';
import 'src/styles/index.scss';

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
        <div id="freezer">
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
        </div>
    );
};

export default Freezer;