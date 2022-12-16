import { Envelope } from 'src/types/oscillator';

export interface OscModuleSettings {
    // eslint-disable-next-line no-undef
    type: OscillatorType;
    frequency: number;
    detune: number;
    envelope: Envelope;
}

export interface ChangeOscModuleSettingsProps {
    // eslint-disable-next-line no-undef
    type?: OscillatorType;
    detune?: number;
}

export interface OscModule {
    stop: () => void;
    changeOscSettings: (settings: ChangeOscModuleSettingsProps) => void;
}

export interface OscState {
    noteModules: Record<string, OscModule | undefined>;
    droneModules: Record<string, OscModule | undefined>;
    gainControl: GainNode;
}
