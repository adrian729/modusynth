export const imag = [0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1];
export const real = imag.map(() => 0);

// eslint-disable-next-line no-undef
const organ: PeriodicWaveOptions = { real, imag };

export default organ;
