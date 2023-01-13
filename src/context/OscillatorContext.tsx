import { FC, createContext, useMemo } from 'react';

import _ from 'lodash';
import { Props } from 'src/types/core';

export interface OscillatorContextState {
    oscId: string;
}

const OscillatorContext = createContext<OscillatorContextState | null>(null);
export default OscillatorContext;

export const OscillatorContextProvider: FC<Props> = ({ children }) => {
    const oscId = useMemo(() => _.uniqueId('osc_'), []);

    return (
        <OscillatorContext.Provider value={{ oscId }}>
            {children}
        </OscillatorContext.Provider>
    );
};
