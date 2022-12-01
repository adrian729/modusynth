import { FC } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import { freeze, hasDrones, relsease } from 'src/reducers/dronesSlice';

import './DroneController.scss';

const DroneController: FC = () => {
    const dispatch = useAppDispatch();
    const drones = hasDrones();

    const addDrones = (): void => {
        dispatch(freeze());
    };

    const killDrones = (): void => {
        dispatch(relsease());
    };

    return (
        <div className="dronecontroller">
            <button
                className={drones ? 'freeze--active' : ''}
                onClick={addDrones}
            >
                FREEZE
            </button>
            <button
                className={drones ? 'release--active' : ''}
                onClick={killDrones}
            >
                RELEASE
            </button>
        </div>
    );
};

export default DroneController;
