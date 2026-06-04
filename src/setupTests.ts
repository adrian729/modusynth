// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

// ---------------------------------------------------------------------------
// Web Audio API mock
//
// jsdom does not implement the Web Audio API, but the synth constructs audio
// nodes (GainNode, OscillatorNode, ...) and an AudioContext while mounting.
// These minimal mocks satisfy node construction, parameter access (e.g.
// `gain.value`, `frequency.setValueAtTime`) and the connect/disconnect graph so
// components can render under jsdom.
//
// NOTE: plain functions are used instead of jest.fn() on purpose — Create React
// App enables `resetMocks: true`, which would otherwise wipe these stub
// implementations before each test.
// ---------------------------------------------------------------------------
const AUDIO_PARAM_NAMES = [
    'gain',
    'frequency',
    'detune',
    'offset',
    'Q',
    'pan',
    'threshold',
    'knee',
    'ratio',
    'attack',
    'release',
    'delayTime',
];

class MockAudioParam {
    value: number;

    constructor(value = 0) {
        this.value = value;
    }

    setValueAtTime = (): this => this;
    linearRampToValueAtTime = (): this => this;
    exponentialRampToValueAtTime = (): this => this;
    setTargetAtTime = (): this => this;
    setValueCurveAtTime = (): this => this;
    cancelScheduledValues = (): this => this;
    cancelAndHoldAtTime = (): this => this;
}

class MockAudioNode {
    context: unknown;
    type = 'sine';
    fftSize = 2048;
    frequencyBinCount = 1024;

    constructor(context?: unknown, options: Record<string, unknown> = {}) {
        this.context = context;
        AUDIO_PARAM_NAMES.forEach((name) => {
            const provided = options[name];
            (this as Record<string, unknown>)[name] = new MockAudioParam(
                typeof provided === 'number' ? provided : 0,
            );
        });
        Object.entries(options).forEach(([key, val]) => {
            if (!AUDIO_PARAM_NAMES.includes(key)) {
                (this as Record<string, unknown>)[key] = val;
            }
        });
    }

    connect = (target?: unknown): unknown => target ?? this;
    disconnect = (): void => undefined;
    start = (): void => undefined;
    stop = (): void => undefined;
    setPeriodicWave = (): void => undefined;
    getByteFrequencyData = (): void => undefined;
    getByteTimeDomainData = (): void => undefined;
    getFloatFrequencyData = (): void => undefined;
    getFloatTimeDomainData = (): void => undefined;
}

class MockAudioContext extends MockAudioNode {
    currentTime = 0;
    sampleRate = 44100;
    state = 'running';
    destination = new MockAudioNode(this);

    resume = (): Promise<void> => Promise.resolve();
    suspend = (): Promise<void> => Promise.resolve();
    close = (): Promise<void> => Promise.resolve();
    createGain = (): MockAudioNode => new MockAudioNode(this);
    createOscillator = (): MockAudioNode => new MockAudioNode(this);
    createAnalyser = (): MockAudioNode => new MockAudioNode(this);
    createConstantSource = (): MockAudioNode => new MockAudioNode(this);
    createPeriodicWave = (): object => ({});
}

const audioGlobals = globalThis as Record<string, unknown>;
audioGlobals.AudioContext = MockAudioContext;
audioGlobals.webkitAudioContext = MockAudioContext;
audioGlobals.AudioNode = MockAudioNode;
audioGlobals.GainNode = MockAudioNode;
audioGlobals.OscillatorNode = MockAudioNode;
audioGlobals.AnalyserNode = MockAudioNode;
audioGlobals.DynamicsCompressorNode = MockAudioNode;
audioGlobals.ConstantSourceNode = MockAudioNode;
audioGlobals.PeriodicWave = class MockPeriodicWave {};

// ---------------------------------------------------------------------------
// Web MIDI API mock — jsdom has no navigator.requestMIDIAccess.
// ---------------------------------------------------------------------------
Object.defineProperty(navigator, 'requestMIDIAccess', {
    configurable: true,
    writable: true,
    value: (): Promise<unknown> =>
        Promise.resolve({
            inputs: new Map(),
            outputs: new Map(),
            onstatechange: null,
            addEventListener: (): void => undefined,
            removeEventListener: (): void => undefined,
        }),
});
