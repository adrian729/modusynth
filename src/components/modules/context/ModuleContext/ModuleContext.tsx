import { FC, createContext } from 'react';

import { Props } from 'src/types/core';

export interface ModuleContextState {
    moduleId: string;
    moduleType?: string;
}

const ModuleContext = createContext<ModuleContextState | null>(null);
export default ModuleContext;

export interface ModuleContextProviderProps extends Props {
    moduleId: string;
    moduleType?: string;
}
export const ModuleContextProvider: FC<ModuleContextProviderProps> = ({
    moduleId,
    moduleType = 'module',
    children,
}) => {
    return (
        <ModuleContext.Provider value={{ moduleId, moduleType }}>
            {module ? children : null}
        </ModuleContext.Provider>
    );
};
