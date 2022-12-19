import { FC, useState } from 'react';

import Oscillator from '../Oscillator/Oscillator';
import Button from '../core/Button';
import './OscillatorsPanel.scss';

const OscillatorsPanel: FC = () => {
    const [oscList, setOscList] = useState<any[]>([
        <Oscillator key={0} mute={false} />,
    ]);

    const addOsc = () => {
        setOscList(oscList.concat(<Oscillator key={oscList.length} />));
    };

    return (
        <div className="oscillatorspanel">
            <Button id="addOsc" title="Add Oscillator" onClick={addOsc} />
            <div className="oscillatorspanel__container">{oscList}</div>
        </div>
    );
};

export default OscillatorsPanel;
