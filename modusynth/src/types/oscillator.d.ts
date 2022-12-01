export interface Envelope {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
}

export interface OscSettings {
    // eslint-disable-next-line no-undef
    type: OscillatorType;
    detune: number;
    envelope: Envelope;
    gain: number;
    mute: boolean;
}
