import { Envelope } from 'src/types/oscillator';

export interface OscNodeSettings {
    type?: OscillatorType;
    frequency?: number;
    detune?: number;
}

export interface OscNodeProps {
    type: OscillatorType;
    frequency: number;
    detune: number;
    envelope: Envelope;
}

export interface OscNodeType {
    stop(): void;
    changeSettings(settings: OscNodeSettings): void;
}

const OscNode = (
    audioContext: AudioContext,
    connection: AudioNode,
    oscNodeProps: OscNodeProps
): OscNodeType => {
    let { type, frequency, detune, envelope } = oscNodeProps;
    let easing = 0.005;

    let osc: OscillatorNode = audioContext.createOscillator();
    osc.frequency.value = frequency;
    osc.detune.value = detune;
    osc.type = type;
    let gateGain: GainNode = audioContext.createGain();
    osc.connect(gateGain);
    gateGain.connect(connection);
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
        if (type !== undefined) {
            osc.type = type;
        }
        if (frequency !== undefined) {
            osc.frequency.value = frequency;
        }
        if (detune !== undefined) {
            osc.detune.value = detune;
        }
    };

    return { stop, changeSettings };
};

export default OscNode;
