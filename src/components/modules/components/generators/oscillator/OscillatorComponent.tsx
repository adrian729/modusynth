import { FC, useEffect, useState } from 'react';

import _ from 'lodash';
import { useAppDispatch } from 'src/app/hooks';
import Button from 'src/components/common/core/button/Button';
import { ModuleContextProvider } from 'src/components/modules/context/ModuleContext/ModuleContext';
import {
    OscillatorModule,
    addModule,
    getDefaultEnvelopeId,
    getModule,
    removeModule,
    updateModule,
} from 'src/reducers/synthesisSlice';

import AudioControl from './components/AudioControll';
import OscillatorControllers from './components/OscillatorControllers';
import OscillatorWaveSelection from './components/OscillatorWaveSelection';

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

    const { mute = false } = { ...(module as OscillatorModule) };
    const toggleMute = () => {
        dispatch(updateModule({ ...module, mute: !mute } as OscillatorModule));
    };

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
                mute: false,
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
                <div className="flex w-fit min-w-[300px] max-w-full flex-col flex-nowrap overflow-hidden rounded-lg border border-border bg-panel shadow-panel">
                    <div className="flex items-center justify-between border-b border-border bg-panel-2 px-[0.6rem] py-[0.4rem] text-[0.7rem] uppercase tracking-[0.1em] text-accent">
                        <h5>{moduleId}</h5>
                        <Button
                            id={`${moduleId}_mute`}
                            title="mute"
                            buttonKind={mute ? 'active' : undefined}
                            className="m-0! px-2! py-0.5! text-[0.65rem]!"
                            onClick={toggleMute}
                        />
                    </div>
                    {/* -1px margins on the items keep a single divider line
                        whether they sit side by side or wrap into a column
                        (the body clips the outer edges). */}
                    <div className="flex flex-row flex-wrap overflow-hidden">
                        <div className="-ml-px -mt-px flex-[1_1_18rem] border-l border-t border-border p-2">
                            <OscillatorControllers />
                        </div>
                        <div className="-ml-px -mt-px flex-[0_1_auto] border-l border-t border-border p-2">
                            <OscillatorWaveSelection />
                        </div>
                    </div>
                </div>
            ) : null}
        </ModuleContextProvider>
    );
};

export default OscillatorComponent;
