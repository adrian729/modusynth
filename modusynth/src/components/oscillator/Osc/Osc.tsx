import { FC } from 'react';

import OscStore from 'src/context/OscStore';

import OscController from '../OscController';

interface OscProps {
    // eslint-disable-next-line no-undef
    type?: OscillatorType;
    mute?: boolean;
}
const Osc: FC<OscProps> = ({ type, mute }) => {
    return (
        <OscStore type={type} mute={mute}>
            <OscController />
        </OscStore>
    );
};

export default Osc;
