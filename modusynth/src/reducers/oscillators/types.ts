import { OscSettings } from 'src/types/oscillator';

export type OscID = string;
export type NoteName = string;
export type Frequency = number;

export interface OscNodeState {
    drones: Record<NoteName, Frequency>;
    settings: OscSettings;
}

export interface OscillatorState {
    octave: number;
    notes: Record<NoteName, Frequency>;
    oscillators: Record<OscID, OscNodeState>;
}
