import { FC, useEffect, useMemo } from 'react';

import _ from 'lodash';
import OscillatorComponent from 'src/components/modules/components/generators/oscillator/OscillatorComponent';
import EnvelopeComponent from 'src/components/modules/components/modulators/envelope/EnvelopeComponent';
import ModulatorComponent from 'src/components/modules/components/modulators/modulator/ModulatorComponent';
import MainContext from 'src/context/MainContext/MainContext';
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
    // Envelope shared by the modulator's oscillators; rendered up here so it
    // sits next to the main module instead of at the bottom.
    const envelopeId = useMemo(() => _.uniqueId('envelope_'), []);

    useEffect(() => {
        const osc = modules[moduleIds[0]];
        if (osc) {
            osc.outputNode.connect(mainConnection);
        }
        const modulator = modules[moduleIds[1]];
        if (modulator) {
            modulator.outputNode.connect(mainConnection);
        }
        const wavetableOsc = modules[moduleIds[2]];
        if (wavetableOsc) {
            wavetableOsc.outputNode.connect(mainConnection);
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
        <div className="flex flex-col gap-4">
            <h2 className="font-display text-sm font-bold uppercase tracking-widest text-text-dim">
                Main Module
            </h2>
            <div className="flex flex-wrap items-start gap-4">
                <OscillatorComponent moduleId={moduleIds[0]} />
                <section className="sect mb-0 self-stretch">
                    <h4 className="sect__title">Envelope</h4>
                    <EnvelopeComponent
                        moduleId={envelopeId}
                        parentModuleId={moduleIds[1]}
                    />
                </section>
            </div>
            <ModulatorComponent
                moduleId={moduleIds[1]}
                envelopeId={envelopeId}
            />
        </div>
    );
};

export default MainAudioContent;
