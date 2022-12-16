import { createContext } from 'react';

import _ from 'lodash';

export interface OscillatorContextState {
    oscId: string;
}

const OscillatorContext = createContext<OscillatorContextState | null>(null);
export default OscillatorContext;
