import { FC } from 'react';
import OscStore from 'src/context/OscContext';
import OscController from './OscController';

interface OscProps {
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
