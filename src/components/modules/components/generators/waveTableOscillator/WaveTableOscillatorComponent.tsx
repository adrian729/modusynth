import { FC, useEffect } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import { ModuleContextProvider } from 'src/components/modules/context/ModuleContext/ModuleContext';
import {
    OscillatorModule,
    addModule,
    getDefaultEnvelopeId,
    getModule,
    removeModule,
} from 'src/reducers/synthesisSlice';

import NumericController from '../../core/controllers/numericController/NumericController';
import WaveTableController from '../../core/controllers/waveTableController/WaveTableController';
import useOscillator from '../oscillator/hooks/useOscillator';
import './styles.scss';

interface WaveTableOscillatorProps {
    moduleId: string;
    envelopeId?: string;
    parentModuleId?: string;
}
const WaveTableOscillatorComponent: FC<WaveTableOscillatorProps> = ({
    moduleId,
    envelopeId,
    parentModuleId,
}) => {
    const dispatch = useAppDispatch();
    const module = getModule(moduleId);
    const defaultEnvelopeId = getDefaultEnvelopeId();

    useOscillator({ moduleId });

    // TODO: move this into a WaveTableController
    // TODO: make divisions settable (via input) to say how many we want
    // TODO: If divisions augment, just add 0s to both arrays (each element is a k // harmonic).
    // TODO : If divisions decrease, remove elems from end of the array.

    // const screenSection = (key: number) => (
    //     <div key={key} className="wavetableoscillator__division"></div>
    // );

    useEffect(() => {
        if (!module) {
            const initialModule: OscillatorModule = {
                id: moduleId,
                type: 'custom',
                freq: 0,
                // periodicWaveOptions: { real: [0, 0], imag: [0, 1] },
                periodicWaveOptions: {
                    real: [0, 0.2, 0.8, 0.1],
                    imag: [0, 0.3, -0.8, 0.1],
                },
                gain: 0.5,
                pitch: 0,
                envelopeId: envelopeId || defaultEnvelopeId,
                customType: WAVETABLE_TYPE,
                parentModuleId,
            };
            dispatch(addModule(initialModule));
        }
        return () => {
            removeModule(moduleId);
        };
    }, []);

    return (
        <ModuleContextProvider
            moduleId={moduleId}
            moduleType="wavetable_oscillator"
        >
            {module ? (
                <>
                    <WaveTableController />
                    <NumericController
                        paramId={'gain'}
                        resetValue={0.2}
                        step={0.005}
                        min={0}
                        max={2}
                        hasMaxInput={true}
                    />
                    <NumericController
                        paramId={'pitch'}
                        resetValue={0}
                        step={0.01}
                        min={-1200}
                        max={1200}
                        hasMinInput={true}
                        minInputMin={-7200}
                        minInputMax={7200}
                        hasMaxInput={true}
                        maxInputMin={-7200}
                        maxInputMax={7200}
                    />
                </>
            ) : null}
        </ModuleContextProvider>
    );
};

export default WaveTableOscillatorComponent;

const WAVETABLE_TYPE = 'wavetable';
