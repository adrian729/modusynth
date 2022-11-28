import { FC, useState } from 'react';
import { CTX } from 'src/context/MainStore';
import useSafeContext from 'src/hooks/useSafeContext';
import { FREEZE_DRONES, RELEASE_DRONES } from '../../actions/synthActions';

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
        <div style={{ margin: '0 auto' }}>
            <button
                style={hasDrones ? { backgroundColor: 'aqua' } : {}}
                onClick={addDrones}>
                FREEZE
            </button>
            <button
                style={hasDrones ? { background: 'tomato' } : {}}
                onClick={killDrones}>
                RELEASE
            </button>
        </div>
    );
};

export default DroneController;
