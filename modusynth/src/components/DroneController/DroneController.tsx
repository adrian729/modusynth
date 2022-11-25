import { FC, useContext, useState } from 'react';
import { ActionKind, CTX } from 'src/context/Store';

const DroneController: FC = () => {
    const { state, dispatch } = useContext(CTX);
    const [hasDrones, setHasDrones] = useState<boolean>(false);
    let { activeNotes } = state;

    const addDrones = (): void => {
        setHasDrones(true);
        dispatch({
            type: ActionKind.FREEZE_DRONES,
            payload: activeNotes,
        });
    };

    const killDrones = (): void => {
        setHasDrones(false);
        dispatch({
            type: ActionKind.RELEASE_DRONES,
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
