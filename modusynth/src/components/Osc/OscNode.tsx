export interface AudioSettings {
    audioContext: AudioContext;
    connection: AudioNode;
}

export interface Envelope {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
}

export interface OscNodeSettings {
    type?: OscillatorType;
    frequency?: number;
    detune?: number;
    envelope?: Envelope;
    gain?: number;
    mute?: boolean;
}

export type OscNodeProps = AudioSettings & OscNodeSettings;

export interface OscNodeType {
    start(): void;
    stop(): void;
    changeSettings(settings: OscNodeSettings): void;
}

const defaultEnvelope: Envelope = {
    attack: 0.005,
    decay: 0.1,
    sustain: 0.6,
    release: 0.1,
};

const OscNode = ({
    audioContext,
    connection,
    type = 'sine',
    frequency = 0,
    detune = 0,
    envelope = defaultEnvelope,
    gain = 0.5,
    mute = false,
}: OscNodeProps): OscNodeType => {
    let osc: OscillatorNode, gateGain: GainNode, oscGainControl: GainNode;
    let easing = 0.005;

    const init = () => {
        osc = audioContext.createOscillator();
        osc.frequency.value = frequency;
        osc.detune.value = detune;
        osc.type = type;
        gateGain = audioContext.createGain();
        osc.connect(gateGain);
        oscGainControl = audioContext.createGain();
        oscGainControl.gain.value = mute ? 0 : gain;
        gateGain.connect(oscGainControl);
        oscGainControl.connect(connection);
    };
    init();

    const start = () => {
        let { currentTime } = audioContext;
        let { attack, decay, sustain } = envelope;
        gateGain.gain.cancelScheduledValues(currentTime);
        gateGain.gain.setValueAtTime(0, currentTime + easing);
        gateGain.gain.linearRampToValueAtTime(1, currentTime + attack);
        gateGain.gain.linearRampToValueAtTime(
            sustain,
            currentTime + attack + decay + easing
        );
        osc.start();
    };

    const stop = () => {
        let { currentTime } = audioContext;
        let { release } = envelope;
        gateGain.gain.cancelScheduledValues(currentTime);
        gateGain.gain.setTargetAtTime(0, currentTime, release);
        setTimeout(() => {
            osc.disconnect();
        }, 10000);
    };

    const changeSettings = (settings: OscNodeSettings) => {
        let { type, frequency, detune } = settings;
        let { currentTime } = audioContext;
        if (type) {
            osc.type = type;
        }
        if (frequency) {
            osc.frequency.value = frequency;
        }
        if (detune) {
            osc.detune.value = detune;
        }
        if (settings.mute !== undefined) {
            mute = settings.mute;
        }
        if (settings.gain) {
            gain = settings.gain;
        }
        if (mute !== undefined || gain) {
            oscGainControl.gain.cancelScheduledValues(currentTime);
            oscGainControl.gain.setValueAtTime(mute ? 0 : gain, currentTime);
        }
    };

    return { start, stop, changeSettings };
};

export default OscNode;
