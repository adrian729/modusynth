export interface Envelope {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
}

// eslint-disable-next-line no-undef
export type OscSettingsTypes = number | boolean | OscillatorType | Envelope;
export interface OscillatorSettings {
    // eslint-disable-next-line no-undef
    type: OscillatorType;
    detune: number;
    envelope: Envelope;
    gain: number;
    mute: boolean;
}

export interface OscModuleSettings {
    // eslint-disable-next-line no-undef
    type: OscillatorType;
    frequency: number;
    detune: number;
    envelope: Envelope;
    velocity?: number; // from 1 to 127, note key velocity
}

export interface ChangeOscModuleSettingsProps {
    // eslint-disable-next-line no-undef
    type?: OscillatorType;
    detune?: number;
}

export interface OscModule {
    stop: () => void;
    changeOscSettings: (settings: ChangeOscModuleSettingsProps) => void;
}
