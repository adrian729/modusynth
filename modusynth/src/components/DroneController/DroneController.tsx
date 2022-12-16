import { FC, useState } from 'react';

import { useAppDispatch } from 'src/App/hooks';
import { freeze, release } from 'src/reducers/synthSlice';

import Button from '../core/Button';
import './DroneController.scss';

const DroneController: FC = () => {
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
        <div className="dronecontroller">
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

export default DroneController;
