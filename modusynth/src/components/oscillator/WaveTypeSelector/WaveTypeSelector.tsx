import { FC, MouseEvent } from 'react';

import { UPDATE_SETTINGS } from 'src/actions/oscActions';
import { OscCTX } from 'src/context/OscStore';
import useSafeContext from 'src/hooks/useSafeContext';
import { OscSettings } from 'src/types/oscillator';

const waveTypes = ['sine', 'triangle', 'square', 'sawtooth'];
const WaveTypeSelector: FC = () => {
    const { oscCtxState, dispatchOscState } = useSafeContext(OscCTX);
    let { settings } = oscCtxState;
    let { type } = settings;

    const changeType = (e: MouseEvent): void => {
        let { id } = e.target as HTMLInputElement;
        dispatchOscState({
            type: UPDATE_SETTINGS,
            payload: {
                settings: {
                    ...settings,
                    // eslint-disable-next-line no-undef
                    type: id,
                } as OscSettings,
            },
        });
    };

    return (
        <div>
            {waveTypes.map((waveType) => (
                <button
                    id={waveType}
                    key={waveType}
                    onClick={changeType}
                    className={(waveType === type && 'active') || ''}
                >
                    {waveType}
                </button>
            ))}
        </div>
    );
};

export default WaveTypeSelector;
