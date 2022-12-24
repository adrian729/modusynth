import { OscModule } from 'src/types/oscillator';

export interface OscState {
    noteModules: Record<string, OscModule | undefined>;
    droneModules: Record<string, OscModule | undefined>;
    gainControl: GainNode;
}
