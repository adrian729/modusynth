import { useAppDispatch } from 'src/app/hooks';
import Button from 'src/components/common/core/button/Button';
import ModuleContext from 'src/components/modules/context/ModuleContext/ModuleContext';
import useSafeContext from 'src/hooks/useSafeContext';
import { Module, getModule, updateModule } from 'src/reducers/synthesisSlice';

interface ModuleWithType extends Module {
    // eslint-disable-next-line no-undef
    type: OscillatorType;
}

interface waveTypeOption {
    label: string;
    // eslint-disable-next-line no-undef
    waveType: OscillatorType;
}

// eslint-disable-next-line no-undef
const waveTypes: waveTypeOption[] = [
    { label: 'sin', waveType: 'sine' },
    { label: 'trin', waveType: 'triangle' },
    { label: 'sqr', waveType: 'square' },
    { label: 'saw', waveType: 'sawtooth' },
];

const WaveTypeController = () => {
    const dispatch = useAppDispatch();

    const { moduleId } = useSafeContext(ModuleContext);
    const module = getModule(moduleId) as ModuleWithType;
    const { type = 'sine' } = { ...module };

    // eslint-disable-next-line no-undef
    const onChangeType = (waveType: OscillatorType) => {
        if (type !== waveType) {
            dispatch(
                updateModule({ ...module, type: waveType } as ModuleWithType),
            );
        }
    };

    return (
        <div>
            <div style={{ display: 'flex' }}>
                {waveTypes.map(({ label, waveType }) => (
                    <Button
                        id={`${moduleId}_${waveType}_type`}
                        key={waveType}
                        title={label}
                        buttonKind={waveType === type ? 'active' : undefined}
                        onClick={() => onChangeType(waveType)}
                    />
                ))}
            </div>
        </div>
    );
};

export default WaveTypeController;
