import { FC, useState } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import { freeze, release } from 'src/reducers/oscillatorsSlice';

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
