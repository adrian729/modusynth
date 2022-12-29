import { Envelope } from 'src/types/oscillator';

const MIN_GAIN = 0.5;

export interface UpdateParams {
    // eslint-disable-next-line no-undef
    type: OscillatorType;
    detune: number;
    synthDetune: number;
}

export interface OscillatorModuleType {
    stop: () => void;
    update: (params: UpdateParams) => void;
}

export interface OscillatorModuleParams {
    frequency: number;
    velocity?: number; // from 1 to 127, note key velocity
    audioContext: AudioContext;
    connection: AudioNode;
    // eslint-disable-next-line no-undef
    type: OscillatorType;
    detune: number;
    envelope: Envelope;
    synthDetune: number;
}
const OscillatorModule = ({
    frequency,
    velocity,
    audioContext,
    connection,
    type,
    detune,
    envelope,
    synthDetune,
}: OscillatorModuleParams): OscillatorModuleType => {
    const { currentTime } = audioContext;
    const velocityGainValue = velocity ? MIN_GAIN + velocity / 127 : 1;

    /**
     * Init osc && gateGain
     */

    const { attack, decay, sustain } = envelope;
    const easing = 0.005;

    const osc = audioContext.createOscillator();
    osc.type = type;
    osc.frequency.value = frequency;
    osc.detune.value = detune + synthDetune;

    const gateGain = audioContext.createGain();
    gateGain.gain.setValueAtTime(0, currentTime + easing);
    gateGain.gain.linearRampToValueAtTime(
        velocityGainValue,
        currentTime + attack,
    );
    gateGain.gain.linearRampToValueAtTime(
        sustain * velocityGainValue,
        currentTime + attack + decay + easing,
    );

    osc.connect(gateGain);
    gateGain.connect(connection);
    osc.onended = (): void => {
        gateGain.disconnect();
    };

    osc.start();

    const stop = () => {
        const { release } = envelope;
        gateGain.gain.cancelScheduledValues(currentTime);
        gateGain.gain.setTargetAtTime(0, currentTime, release);
        setTimeout(() => {
            osc.stop();
            osc.disconnect();
            gateGain.disconnect();
        }, 5000 + release * 1000);
    };

    const update = ({ type, detune, synthDetune }: UpdateParams) => {
        osc.type = type;
        osc.detune.value = detune + synthDetune;
    };

    return { stop, update };
};
export default OscillatorModule;
