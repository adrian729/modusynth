import { ModuleInterface } from './MainContext';

export type MainContextActionType = {
    type: 'ADD_MODULE';
    payload: { id: string; module: ModuleInterface };
};
