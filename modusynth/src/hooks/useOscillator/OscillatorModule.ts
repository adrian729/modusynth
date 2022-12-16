import { Envelope } from 'src/types/oscillator';

import {
    ChangeOscModuleSettingsProps,
    OscModule,
    OscModuleSettings,
} from './types';

const OscillatorModule = (
    audioContext: AudioContext,
    connection: AudioNode,
    oscModuleSettings: OscModuleSettings,
): OscModule => {
    let { envelope } = oscModuleSettings;
    let { currentTime } = audioContext;
    let osc: OscillatorNode = audioContext.createOscillator();
    let gateGain: GainNode = audioContext.createGain();

    setupOsc(osc, oscModuleSettings);
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

    const changeOscSettings = (settings: ChangeOscModuleSettingsProps) => {
        let { type, detune } = settings;

        if (type !== undefined) {
            osc.type = type;
        }

        if (detune !== undefined) {
            osc.detune.value = detune;
        }
    };

    return { stop, changeOscSettings };
};
export default OscillatorModule;

const setupOsc = (
    osc: OscillatorNode,
    { type, frequency, detune }: OscModuleSettings,
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
