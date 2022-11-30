import { FC, useState } from 'react';

import { CTX } from 'src/context/MainStore';
import useSafeContext from 'src/hooks/useSafeContext';

import { FREEZE_DRONES, RELEASE_DRONES } from '../../actions/synthActions';
import './DroneController.scss';

const DroneController: FC = () => {
    const { dispatch } = useSafeContext(CTX);
    const [hasDrones, setHasDrones] = useState<boolean>(false);

    const addDrones = (): void => {
        setHasDrones(true);
        dispatch({
            type: FREEZE_DRONES,
            payload: {},
        });
    };

    const killDrones = (): void => {
        setHasDrones(false);
        dispatch({
            type: RELEASE_DRONES,
            payload: {},
        });
    };

    return (
        <div className="dronecontroller">
            <button
                className={hasDrones ? 'freeze--active' : ''}
                onClick={addDrones}
            >
                FREEZE
            </button>
            <button
                className={hasDrones ? 'release--active' : ''}
                onClick={killDrones}
            >
                RELEASE
            </button>
        </div>
    );
};

export default DroneController;
