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
}

export interface OscNodeType {
    start: () => void;
    stop: () => void;
    changeSettings: (settings: OscNodeSettings) => void;
}

export interface OscNodeProps {
    audioContext: AudioContext;
    type?: OscillatorType;
    frequency: number;
    detune?: number;
    envelope?: Envelope;
    connection: AudioNode;
}

const defaultEnvelope: Envelope = {
    attack: 0.005,
    decay: 0.1,
    sustain: 0.6,
    release: 0.1,
};

const OscNode = ({
    audioContext,
    type = 'sine',
    frequency,
    detune = 0,
    envelope = defaultEnvelope,
    connection,
}: OscNodeProps): OscNodeType => {
    let osc: OscillatorNode, gateGain: GainNode;
    let easing = 0.005;

    const init = () => {
        osc = audioContext.createOscillator();
        osc.frequency.value = frequency;
        osc.detune.value = detune;
        osc.type = type;
        gateGain = audioContext.createGain();
        osc.connect(gateGain);
        gateGain.connect(connection);
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
        if (type) {
            osc.type = type;
        }
        if (frequency) {
            osc.frequency.value = frequency;
        }
        if (detune) {
            osc.detune.value = detune;
        }
    };

    return { start, stop, changeSettings };
};

export default OscNode;
