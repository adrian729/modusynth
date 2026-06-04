import { FC } from 'react';

import { Provider } from 'react-redux';
import MainAudioComponent from 'src/components/modules/components/core/main/MainAudioComponent';
import SynthPadPanel from 'src/components/specific/synthPadPanel/SynthPadPanel';
import SynthPanel from 'src/components/specific/synthPanel/SynthPanel';
import { Props } from 'src/types/core';

import store from './store';

const App: FC<Props> = () => {
    return (
        <Provider store={store}>
            <div className="min-h-screen bg-surface font-mono text-text">
                <header className="flex items-baseline gap-3 border-b border-border px-6 py-4">
                    <h1 className="font-display text-2xl font-bold tracking-[0.25em] text-accent [text-shadow:0_0_12px_rgba(24,255,255,0.4)]">
                        MODUSYNTH
                    </h1>
                    <span className="text-xs uppercase tracking-widest text-text-dim">
                        modular synthesizer
                    </span>
                </header>
                <main className="flex flex-col gap-6 p-6">
                    <section className="flex flex-wrap items-start gap-6">
                        <SynthPanel />
                        <SynthPadPanel />
                    </section>
                    <MainAudioComponent />
                </main>
            </div>
        </Provider>
    );
};

export default App;
