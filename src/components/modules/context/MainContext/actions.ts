import { ModuleInterface } from './MainContext';

export type MainContextActionType =
    | {
          type: 'SET_AUDIO_CONNECTION';
          payload: AudioNode;
      }
    | {
          type: 'ADD_MODULE';
          payload: { id: string; module: ModuleInterface };
      };
