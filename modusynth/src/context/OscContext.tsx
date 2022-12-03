import { createContext } from 'react';

import _ from 'lodash';

export interface OscCTXState {
    oscId: string;
}

export const OscCTX = createContext<OscCTXState | null>(null);
