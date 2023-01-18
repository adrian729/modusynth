import { Bass, BassFuzz, BassSubDub, Trombone } from '@mohayonao/wave-tables';

import bass2 from './waveTables/bass2';
import organ from './waveTables/organ';

const customPeriodicWaveOptions: Record<
    string,
    // eslint-disable-next-line no-undef
    PeriodicWaveOptions
> = {
    Bass,
    bass2,
    BassFuzz,
    BassSubDub,
    organ,
    Trombone,
    none: {},
};

export default customPeriodicWaveOptions;
