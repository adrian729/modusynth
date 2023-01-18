import { useAppDispatch } from 'src/app/hooks';
import Button from 'src/components/common/core/button/Button';
import ModuleContext from 'src/components/modules/context/ModuleContext/ModuleContext';
import useSafeContext from 'src/hooks/useSafeContext';
import { Module, getModule, updateModule } from 'src/reducers/synthesisSlice';

import customPeriodicWaveOptions from '../../../generators/oscillator/hooks/customWaveTypes/customWaveTypes';

interface ModuleWithCustomType extends Module {
    customType: string;
}

const customWaveTypes = Object.keys(customPeriodicWaveOptions);

const CustomWaveTypeController = () => {
    const dispatch = useAppDispatch();

    const { moduleId } = useSafeContext(ModuleContext);
    const module = getModule(moduleId) as unknown as ModuleWithCustomType;
    const { customType } = module;

    const onChangeType = (waveType: string) => {
        if (customType !== waveType) {
            dispatch(
                updateModule({
                    ...module,
                    customType: waveType,
                } as ModuleWithCustomType),
            );
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {customWaveTypes.map((waveType) => (
                    <Button
                        id={`${moduleId}_${waveType}_type`}
                        key={waveType}
                        title={waveType}
                        buttonKind={
                            waveType === customType ? 'active' : undefined
                        }
                        onClick={() => onChangeType(waveType)}
                    />
                ))}
            </div>
        </div>
    );
};

export default CustomWaveTypeController;
