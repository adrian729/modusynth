import {
    ChangeOscModuleSettingsProps,
    Envelope,
    OscModule,
    OscModuleSettings,
} from 'src/types/oscillator';

const useOscillatorModule = (
    audioContext: AudioContext,
    connection: AudioNode,
    oscModuleSettings: OscModuleSettings,
): OscModule => {
    const { envelope } = oscModuleSettings;
    const { currentTime } = audioContext;
    const osc: OscillatorNode = audioContext.createOscillator();
    const gateGain: GainNode = audioContext.createGain();

    setupOsc(osc, oscModuleSettings);
    setupGateGain(gateGain, envelope, currentTime);

    osc.connect(gateGain);
    gateGain.connect(connection);
    osc.start();

    const stop = () => {
        const { currentTime } = audioContext;
        const { release } = envelope;

        gateGain.gain.cancelScheduledValues(currentTime);
        gateGain.gain.setTargetAtTime(0, currentTime, release);
        setTimeout(() => {
            osc.disconnect();
        }, 10000);
    };

    const changeOscSettings = (settings: ChangeOscModuleSettingsProps) => {
        const { type, detune } = settings;

        if (type !== undefined) {
            osc.type = type;
        }

        if (detune !== undefined) {
            osc.detune.value = detune;
        }
    };

    return { stop, changeOscSettings };
};
export default useOscillatorModule;

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
    const easing = 0.005;

    gateGain.gain.cancelScheduledValues(currentTime);
    gateGain.gain.setValueAtTime(0, currentTime + easing);
    gateGain.gain.linearRampToValueAtTime(1, currentTime + attack);
    gateGain.gain.linearRampToValueAtTime(
        sustain,
        currentTime + attack + decay + easing,
    );
};
