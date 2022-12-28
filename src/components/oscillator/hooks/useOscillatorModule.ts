import {
    ChangeOscModuleSettingsProps,
    Envelope,
    OscModule,
    OscModuleSettings,
} from 'src/types/oscillator';

export interface UseOscillatorModuleParams {
    audioContext: AudioContext;
    connection: AudioNode;
    oscModuleSettings: OscModuleSettings;
}
const useOscillatorModule = ({
    audioContext,
    connection,
    oscModuleSettings,
}: UseOscillatorModuleParams): OscModule => {
    const { envelope, velocity } = oscModuleSettings;
    const { currentTime } = audioContext;
    const osc: OscillatorNode = audioContext.createOscillator();
    const gateGain: GainNode = audioContext.createGain();

    setupOsc(osc, oscModuleSettings);
    setupGateGain({ gateGain, envelope, currentTime, velocity });

    osc.connect(gateGain);
    gateGain.connect(connection);
    osc.start();

    osc.onended = (): void => {
        gateGain.disconnect();
    };

    const stop = (): void => {
        const { currentTime } = audioContext;
        const { release } = envelope;

        gateGain.gain.cancelScheduledValues(currentTime);
        gateGain.gain.setTargetAtTime(0, currentTime, release);
        setTimeout(() => {
            osc.stop();
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

interface SetupGateGainParams {
    gateGain: GainNode;
    envelope: Envelope;
    currentTime: number;
    velocity?: number;
}
const setupGateGain = ({
    gateGain,
    envelope,
    currentTime,
    velocity = 127,
}: SetupGateGainParams): void => {
    const { attack, decay, sustain } = envelope;
    const easing = 0.005;

    gateGain.gain.cancelScheduledValues(currentTime);
    gateGain.gain.setValueAtTime(0, currentTime + easing);
    gateGain.gain.linearRampToValueAtTime(velocity / 127, currentTime + attack);
    gateGain.gain.linearRampToValueAtTime(
        sustain,
        currentTime + attack + decay + easing,
    );
};
