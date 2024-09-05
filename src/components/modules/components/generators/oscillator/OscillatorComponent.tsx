import { FC, useEffect, useState } from 'react';

import _ from 'lodash';
import { useAppDispatch } from 'src/app/hooks';
import { ModuleContextProvider } from 'src/components/modules/context/ModuleContext/ModuleContext';
import {
    OscillatorModule,
    addModule,
    getDefaultEnvelopeId,
    getModule,
    removeModule,
} from 'src/reducers/synthesisSlice';

import AudioControl from './components/AudioControll';
import OscillatorControllers from './components/OscillatorControllers';
import OscillatorWaveSelection from './components/OscillatorWaveSelection';
import './styles.scss';

interface OscillatorProps {
    moduleId: string;
    envelopeId?: string;
    parentModuleId?: string;
}
const OscillatorComponent: FC<OscillatorProps> = ({
    moduleId,
    envelopeId,
    parentModuleId,
}) => {
    const dispatch = useAppDispatch();
    const module = getModule(moduleId);

    const defaultEnvelopeId = getDefaultEnvelopeId();
    const [isSetup, setIsSetup] = useState<boolean>(false);

    useEffect(() => {
        if (!module) {
            const initialModule: OscillatorModule = {
                id: moduleId,
                type: 'sine',
                freq: 0,
                periodicWaveOptions: { real: [0, 0], imag: [0, 1] },
                gain: 0.5,
                pitch: 0,
                envelopeId: envelopeId || defaultEnvelopeId,
                customType: 'none',
                parentModuleId,
            };
            dispatch(addModule(initialModule));
            setIsSetup(true);
        }
        return () => {
            removeModule(moduleId);
        };
    }, []);

    return (
        <ModuleContextProvider moduleId={moduleId} moduleType="oscillator">
            <AudioControl />
            {isSetup ? (
                <div className="oscillator">
                    <div className="oscillator__header">
                        <h5>{moduleId}</h5>
                    </div>
                    <div className="oscillator__item">
                        <OscillatorControllers />
                    </div>
                    <div className="oscillator__item">
                        <OscillatorWaveSelection />
                    </div>
                </div>
            ) : null}
        </ModuleContextProvider>
    );
};

export default OscillatorComponent;
