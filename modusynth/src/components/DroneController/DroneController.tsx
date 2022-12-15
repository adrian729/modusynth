import { FC, useState } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import { freeze, release } from 'src/reducers/oscillators/oscillatorsSlice';

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
            <button className={hasDrones ? 'active' : ''} onClick={addDrones}>
                FREEZE
            </button>
            <button className={hasDrones ? 'warning' : ''} onClick={killDrones}>
                RELEASE
            </button>
        </div>
    );
};

export default DroneController;
