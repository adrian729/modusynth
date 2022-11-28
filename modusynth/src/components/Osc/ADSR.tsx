import { ChangeEvent, FC, MouseEvent } from 'react';
import { Envelope } from 'src/types/oscillator';

export interface ADSRProps {
    envelope: Envelope;
    change: (e: ChangeEvent) => void;
    handleClick: (e: MouseEvent, id: string, val: number) => void;
}
const ADSR: FC<ADSRProps> = ({ envelope, change, handleClick }) => {
    let { attack, decay, sustain, release } = envelope;
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
