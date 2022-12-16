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
