import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { useAppSelector } from 'src/app/hooks';
import { Envelope } from 'src/types/oscillator';

export type ID = string;

/**
 * Generators: synthesis module that creates sound (oscillator, sample, etc)
 */
// export type GeneratorModule = CombinatorModule | OscillatorModule;
/**
 * Combiners: combine generators together (mixer, crossfade, etc)
 */
export type CombinerModule = CombinatorModule;
/**
 * Modifiers:
 */
// export type ModifierModule =
//     | EnvelopeModule
//     | ModulatorModule
//     | CombinatorModule
//     | OscillatorModule;

export interface Module {
    id: string;
    parentModuleId?: string;
}

export interface OscillatorModule extends Module {
    // eslint-disable-next-line no-undef
    type: OscillatorType;
    freq: number;
    // eslint-disable-next-line no-undef
    periodicWaveOptions: PeriodicWaveOptions;
    gain: number;
    pitch: number;
    envelopeId: ID;
    customType: string;
}

export interface EnvelopeModule extends Module {
    envelope: Envelope;
}

export interface CombinatorModule extends Module {
    childModuleIds: string[];
}

export interface SynthesisState {
    modules: Record<string, Module>;
}

const DEFAULT_ENVELOPE_MODULE_ID = 'envelope_default';
const defaultEnvelope: EnvelopeModule = {
    id: DEFAULT_ENVELOPE_MODULE_ID,
    envelope: { attack: 0, decay: 0, sustain: 1, release: 0 },
};

const initialState: SynthesisState = {
    modules: { envelope_default: defaultEnvelope },
};
export const synthesisSlice = createSlice({
    name: 'synthesis',
    initialState,
    reducers: {
        addModule: (state, action: PayloadAction<Module>): void => {
            const { id } = action.payload;
            state.modules[id] = action.payload;
        },
        updateModule: (state, action: PayloadAction<Module>): void => {
            const { id } = action.payload;
            const { modules } = state;
            if (modules[id]) {
                state.modules[id] = action.payload;
            }
        },
        removeModule: (state, action: PayloadAction<ID>): void => {
            const moduleId = action.payload;
            const { modules } = state;
            const module = modules[moduleId];
            if (!module) {
                return;
            }

            if (module.parentModuleId) {
                const parentModule = modules[
                    module?.parentModuleId
                ] as CombinatorModule;
                const { childModuleIds } = parentModule;
                const childIdx = childModuleIds?.indexOf(moduleId);
                if (childIdx >= 0) {
                    parentModule.childModuleIds.splice(childIdx, 1);
                }
            }

            delete modules[moduleId];
        },
    },
});

export const { addModule, updateModule, removeModule } = synthesisSlice.actions;
export const getDefaultEnvelopeId = () =>
    useAppSelector(() => DEFAULT_ENVELOPE_MODULE_ID);
export const getModules = () =>
    useAppSelector(({ synthesis }) => synthesis.modules);
export const getModule = (id: string) =>
    useAppSelector(({ synthesis }) => synthesis.modules[id]);

export default synthesisSlice.reducer;
