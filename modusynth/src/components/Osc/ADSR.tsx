import { ChangeEvent, FC, MouseEvent } from 'react';
import { UPDATE_SETTINGS } from 'src/actions/oscActions';
import { OscCTX } from 'src/context/OscContext';
import useSafeContext from 'src/hooks/useSafeContext';
import { OscSettings } from 'src/types/oscillator';

const ADSR: FC = () => {
    const { oscCtxState, dispatchOscState } = useSafeContext(OscCTX);
    let { settings } = oscCtxState;
    let { envelope } = settings;
    let { attack, decay, sustain, release } = envelope;

    const change = (e: ChangeEvent): void => {
        let { id, value } = e.target as HTMLInputElement;
        let newEnvelope = { ...envelope, [id]: parseFloat(value) };
        let newSettings: OscSettings = {
            ...settings,
            envelope: newEnvelope,
        };
        dispatchOscState({
            type: UPDATE_SETTINGS,
            payload: { settings: newSettings },
        });
    };

    const handleClick = (e: MouseEvent, id: string, value: number): void => {
        let { detail } = e;
        if (detail === 2) {
            let newEnvelope = { ...envelope, [id]: value };
            let newSettings: OscSettings = {
                ...settings,
                envelope: newEnvelope,
            };
            dispatchOscState({
                type: UPDATE_SETTINGS,
                payload: { settings: newSettings },
            });
        }
    };

    return (
        <div>
            <div style={{ display: 'inline-block' }}>
                <h6>Attack: {attack}</h6>
                <input
                    id='attack'
                    value={attack}
                    onChange={change}
                    onClick={e => handleClick(e, 'attack', 0.005)}
                    type='range'
                    step={0.01}
                    min={0}
                    max={2}
                />
            </div>
            <div style={{ display: 'inline-block' }}>
                <h6>Decay: {decay}</h6>
                <input
                    id='decay'
                    value={decay}
                    onChange={change}
                    onClick={e => handleClick(e, 'decay', 0.1)}
                    type='range'
                    step={0.01}
                    min={0}
                    max={1}
                />
            </div>
            <div style={{ display: 'inline-block' }}>
                <h6>Sustain: {sustain}</h6>
                <input
                    id='sustain'
                    value={sustain}
                    onChange={change}
                    onClick={e => handleClick(e, 'sustain', 0.6)}
                    type='range'
                    step={0.01}
                    min={0}
                    max={1}
                />
            </div>
            <div style={{ display: 'inline-block' }}>
                <h6>Release: {release}</h6>
                <input
                    id='release'
                    value={release}
                    onChange={change}
                    onClick={e => handleClick(e, 'release', 0.1)}
                    type='range'
                    step={0.02}
                    min={0}
                    max={2}
                />
            </div>
        </div>
    );
};

export default ADSR;
