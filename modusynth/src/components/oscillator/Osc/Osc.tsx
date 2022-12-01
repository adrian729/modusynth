import { FC } from 'react';

import OscStore from 'src/context/oscContext';

import OscController from '../OscController';

interface OscProps {
    // eslint-disable-next-line no-undef
    type?: OscillatorType;
    mute?: boolean;
}
const Osc: FC<OscProps> = ({ type, mute }) => {
    return (
        <OscStore>
            <OscController defaultType={type} defaultMute={mute} />
        </OscStore>
    );
};

export default Osc;
