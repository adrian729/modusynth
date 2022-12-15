import { Envelope, OscNodeSettings } from 'src/types/oscillator';

import { ChangeSettingsParams, OscNodeType } from './types';

const OscNode = (
    audioContext: AudioContext,
    connection: AudioNode,
    OscNodeSettings: OscNodeSettings,
): OscNodeType => {
    let { envelope } = OscNodeSettings;
    let { currentTime } = audioContext;
    let osc: OscillatorNode = audioContext.createOscillator();
    let gateGain: GainNode = audioContext.createGain();

    setupOsc(osc, OscNodeSettings);
    setupGateGain(gateGain, envelope, currentTime);

    osc.connect(gateGain);
    gateGain.connect(connection);
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

    const changeSettings = (settings: ChangeSettingsParams) => {
        let { type, detune } = settings;

        if (type !== undefined) {
            osc.type = type;
        }

        if (detune !== undefined) {
            osc.detune.value = detune;
        }
    };

    return { stop, changeSettings };
};

export default OscNode;

const setupOsc = (
    osc: OscillatorNode,
    { type, frequency, detune }: OscNodeSettings,
): void => {
    osc.type = type;
    osc.frequency.value = frequency;
    osc.detune.value = detune;
};

const setupGateGain = (
    gateGain: GainNode,
    { attack, decay, sustain }: Envelope,
    currentTime: number,
): void => {
    let easing = 0.005;

    gateGain.gain.cancelScheduledValues(currentTime);
    gateGain.gain.setValueAtTime(0, currentTime + easing);
    gateGain.gain.linearRampToValueAtTime(1, currentTime + attack);
    gateGain.gain.linearRampToValueAtTime(
        sustain,
        currentTime + attack + decay + easing,
    );
};
