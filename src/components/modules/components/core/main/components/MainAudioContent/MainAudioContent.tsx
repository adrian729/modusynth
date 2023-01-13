import { FC, useEffect, useMemo } from 'react';

import _ from 'lodash';
import OscillatorComponent from 'src/components/modules/components/generators/oscillator/OscillatorComponent';
import ModulatorComponent from 'src/components/modules/components/modulators/modulator/ModulatorComponent';
import MainContext from 'src/components/modules/context/MainContext/MainContext';
import useSafeContext from 'src/hooks/useSafeContext';

const MainAudioContent: FC = () => {
    const {
        state: { mainConnection, modules },
    } = useSafeContext(MainContext);

    const moduleIds = [
        useMemo(() => _.uniqueId('oscillator_'), []),
        useMemo(() => _.uniqueId('modulator_'), []),
        useMemo(() => _.uniqueId('oscillator_'), []),
    ];

    useEffect(() => {
        const osc = modules[moduleIds[0]];
        if (osc) {
            osc.outputNode.connect(mainConnection);
        }
        const modulator = modules[moduleIds[1]];
        if (modulator) {
            modulator.outputNode.connect(mainConnection);
        }
    }, [modules]);

    // useEffect(() => {
    //     const cvs1 = document.querySelector('.oscilloscope1');
    //     const oscilloscope1 = new Oscilloscope(
    //         audioContext,
    //         mainConnection,
    //         cvs1,
    //         null,
    //         32768,
    //     );
    //     oscilloscope1.start();
    // }, []);

    return (
        <div>
            <h1>Main Module</h1>
            <OscillatorComponent moduleId={moduleIds[0]} />
            <ModulatorComponent moduleId={moduleIds[1]} />
        </div>
    );
};

export default MainAudioContent;
