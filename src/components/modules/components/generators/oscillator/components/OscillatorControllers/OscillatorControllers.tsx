import FrequencyController from 'src/components/modules/components/core/controllers/frequencyController/FrequencyController';
import NumericController from 'src/components/modules/components/core/controllers/numericController/NumericController';

const OscillatorControllers = () => {
    return (
        <div className="flex flex-wrap items-end gap-3">
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
        </div>
    );
};

export default OscillatorControllers;
