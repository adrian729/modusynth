export interface ChangeSettingsParams {
    // eslint-disable-next-line no-undef
    type?: OscillatorType;
    detune?: number;
}

export interface OscNodeType {
    stop: () => void;
    changeSettings: (settings: ChangeSettingsParams) => void;
}

export interface OscState {
    noteNodes: Record<string, OscNodeType | undefined>;
    droneNodes: Record<string, OscNodeType | undefined>;
    gainControl: GainNode;
}
