import { useAppDispatch } from 'src/app/hooks';
import Button from 'src/components/common/core/button/Button';
import ModuleContext from 'src/components/modules/context/ModuleContext/ModuleContext';
import useSafeContext from 'src/hooks/useSafeContext';
import { Module, getModule, updateModule } from 'src/reducers/synthesisSlice';

interface ModuleWithType extends Module {
    // eslint-disable-next-line no-undef
    type: OscillatorType;
}

// eslint-disable-next-line no-undef
const waveTypes: OscillatorType[] = [
    'sine',
    'triangle',
    'square',
    'sawtooth',
    'custom',
];

const WaveTypeController = () => {
    const dispatch = useAppDispatch();

    const { moduleId } = useSafeContext(ModuleContext);
    const module = getModule(moduleId) as ModuleWithType;
    const { type } = module;

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
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {waveTypes.map((waveType) => (
                    <Button
                        id={`${moduleId}_${waveType}_type`}
                        key={waveType}
                        title={waveType}
                        buttonKind={waveType === type ? 'active' : undefined}
                        onClick={() => onChangeType(waveType)}
                    />
                ))}
            </div>
        </div>
    );
};

export default WaveTypeController;
