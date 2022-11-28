import { FC, useEffect, MouseEvent, ChangeEvent } from 'react';
import { UPDATE_DRONES, UPDATE_SETTINGS } from 'src/actions/oscActions';
import { CTX } from 'src/context/MainStore';
import { OscCTX } from 'src/context/OscContext';
import useSafeContext from 'src/hooks/useSafeContext';
import { OscSettings } from 'src/types/oscillator';
import ADSR from './ADSR';

interface OscProps {
    defaultType?: OscillatorType;
    defaultMute?: boolean;
}
const OscController: FC<OscProps> = ({
    defaultType = 'sine',
    defaultMute = false,
}) => {
    const { oscCtxState, dispatchOscState } = useSafeContext(OscCTX);
    let { settings } = oscCtxState;
    let { type, detune, gain, mute } = settings;

    useEffect(() => {
        dispatchOscState({
            type: UPDATE_SETTINGS,
            payload: {
                settings: { ...settings, mute: defaultMute, type: defaultType },
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const changeMuted = (e: ChangeEvent): void => {
        let { checked } = e.target as HTMLInputElement;
        dispatchOscState({
            type: UPDATE_SETTINGS,
            payload: { settings: { ...settings, mute: !checked } },
        });
    };

    const change = (e: ChangeEvent): void => {
        let { id, value } = e.target as HTMLInputElement;
        let newSettings = {
            ...settings,
            [id]: value as unknown as number,
        } as OscSettings;
        dispatchOscState({
            type: UPDATE_SETTINGS,
            payload: { settings: newSettings },
        });
    };

    const changeType = (e: MouseEvent): void => {
        let { id } = e.target as HTMLInputElement;
        let newSettings: OscSettings = {
            ...settings,
            type: id as OscillatorType,
        };
        dispatchOscState({
            type: UPDATE_SETTINGS,
            payload: { settings: newSettings },
        });
    };

    const handleClick = (e: MouseEvent, id: string, val: number): void => {
        let { detail } = e;
        if (detail === 2) {
            let newSettings: OscSettings = {
                ...settings,
                [id]: val,
            };
            dispatchOscState({
                type: UPDATE_SETTINGS,
                payload: { settings: newSettings },
            });
        }
    };

    const WaveTypeSelector: FC = () => {
        const waveTypes = ['sine', 'triangle', 'square', 'sawtooth'];
        return (
            <>
                {waveTypes.map(waveType => (
                    <button
                        id={waveType}
                        key={waveType}
                        onClick={changeType}
                        className={(waveType === type && 'active') || ''}>
                        {waveType}
                    </button>
                ))}
            </>
        );
    };

    return (
        <div
            style={{
                display: 'inline-block',
                border: '1px solid black',
                borderRadius: '1rem',
                boxShadow:
                    '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                width: 'fit-content',
                margin: '1rem 1rem',
                padding: '.2rem',
            }}>
            <h5>
                Osc: {type}
                <input
                    type='checkbox'
                    id='osc'
                    name='osc'
                    onChange={changeMuted}
                    defaultChecked={!mute}
                />
            </h5>
            <div>
                <h6>Type</h6>
                <WaveTypeSelector />
            </div>
            <div style={{ display: 'inline-block' }}>
                <h6>Detune: {detune}</h6>
                <input
                    id='detune'
                    value={detune}
                    onChange={change}
                    onClick={e => handleClick(e, 'detune', 0)}
                    type='range'
                    min={-100}
                />
            </div>
            <div style={{ display: 'inline-block' }}>
                <h6>Gain: {gain}</h6>
                <input
                    id='gain'
                    value={gain}
                    onChange={change}
                    onClick={e => handleClick(e, 'gain', 1)}
                    type='range'
                    step={0.1}
                    min={0.1}
                    max={2}
                />
            </div>
            <ADSR />
        </div>
    );
};
export default OscController;
