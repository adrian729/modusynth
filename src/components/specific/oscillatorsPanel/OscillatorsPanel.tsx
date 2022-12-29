import { FC, useState } from 'react';

import Box from 'src/components/common/core/box/Box';
import Button from 'src/components/common/core/button';
import Oscillator from 'src/components/specific/oscillator/Oscillator';

import './styles.scss';

const OscillatorsPanel: FC = () => {
    const [oscList, setOscList] = useState<any[]>([
        <Oscillator key={0} mute={false} />,
    ]);

    const addOsc = () => {
        setOscList(oscList.concat(<Oscillator key={oscList.length} />));
    };

    return (
        <Box alignContent="center-content" className="oscillatorspanel center">
            <Button id="addOsc" title="Add Oscillator" onClick={addOsc} />
            <div className="oscillatorspanel__container">{oscList}</div>
        </Box>
    );
};

export default OscillatorsPanel;
