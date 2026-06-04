import { useAppDispatch } from 'src/app/hooks';
import Button from 'src/components/common/core/button/Button';
import FrequencyController from 'src/components/modules/components/core/controllers/frequencyController/FrequencyController';
import NumericController from 'src/components/modules/components/core/controllers/numericController/NumericController';
import ModuleContext from 'src/components/modules/context/ModuleContext/ModuleContext';
import useSafeContext from 'src/hooks/useSafeContext';
import {
    OscillatorModule,
    getModule,
    updateModule,
} from 'src/reducers/synthesisSlice';

const OscillatorControllers = () => {
    const dispatch = useAppDispatch();
    const { moduleId } = useSafeContext(ModuleContext);
    const module = getModule(moduleId) as OscillatorModule;
    const { mute = false } = { ...module };

    const toggleMute = () => {
        dispatch(updateModule({ ...module, mute: !mute } as OscillatorModule));
    };

    return (
        <>
            <FrequencyController />
            <NumericController
                paramId={'gain'}
                resetValue={0.2}
                step={0.01}
                min={0}
                max={2}
                hasMaxInput={true}
                controllerType="knob"
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
                controllerType="knob"
                knobSize="small"
            />
            <Button
                id={`${moduleId}_mute`}
                title="mute"
                buttonKind={mute ? 'active' : undefined}
                onClick={toggleMute}
            />
        </>
    );
};

export default OscillatorControllers;
