import { FC } from 'react';

import classNames from 'classnames';
import { UPDATE_SETTINGS } from 'src/actions/oscActions';
import { OscCTX } from 'src/context/OscStore';
import useSafeContext from 'src/hooks/useSafeContext';

import './MuteOsc.scss';

const MuteOsc: FC = () => {
    const { oscCtxState, dispatchOscState } = useSafeContext(OscCTX);
    let { settings } = oscCtxState;
    let { mute } = settings;

    const toggleMuted = (): void => {
        dispatchOscState({
            type: UPDATE_SETTINGS,
            payload: { settings: { ...settings, mute: !mute } },
        });
    };

    return (
        <button
            id="mute"
            name="mute"
            className={classNames(
                'muteosc__button',
                mute && 'muteosc__button--active',
            )}
            onClick={toggleMuted}
        >
            M
        </button>
    );
};

export default MuteOsc;
