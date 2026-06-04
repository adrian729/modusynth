import { FC, ReactNode, useEffect, useRef, useState } from 'react';

import { createPortal } from 'react-dom';
import InfoIcon from 'src/components/common/core/icons/InfoIcon';

const Key: FC<{ children: ReactNode }> = ({ children }) => (
    <kbd className="rounded border border-border bg-panel-2 px-1.5 py-0.5 text-[0.7rem] text-accent">
        {children}
    </kbd>
);

const Section: FC<{ title: string; children: ReactNode }> = ({
    title,
    children,
}) => (
    <section className="flex flex-col gap-1.5">
        <h3 className="font-display text-xs font-bold uppercase tracking-widest text-accent">
            {title}
        </h3>
        <div className="flex flex-col gap-1.5 text-sm leading-relaxed text-text-dim">
            {children}
        </div>
    </section>
);

interface InfoModalProps {
    onClose: () => void;
}

const InfoModal: FC<InfoModalProps> = ({ onClose }) => {
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        panelRef.current?.focus();
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    return createPortal(
        <div
            role="presentation"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={(e) => {
                // Close only on backdrop clicks, not clicks inside the panel.
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="appInfoTitle"
                tabIndex={-1}
                className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded border border-border bg-panel font-mono shadow-panel outline-hidden"
            >
                <header className="flex items-center justify-between border-b border-border px-5 py-3">
                    <h2
                        id="appInfoTitle"
                        className="font-display text-sm font-bold uppercase tracking-[0.2em] text-accent"
                    >
                        How to use Modusynth
                    </h2>
                    <button
                        aria-label="Close"
                        className="rounded border border-border bg-panel-2 px-2 py-0.5 text-sm text-text-dim transition-colors hover:border-accent-dim hover:text-accent"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </header>
                <div className="flex flex-col gap-5 overflow-y-auto px-5 py-4">
                    <Section title="What is this?">
                        <p>
                            A modular synthesizer running entirely in your
                            browser (Web Audio). Play notes with the keyboard
                            below, then shape the sound with the oscillator and
                            modulator modules.
                        </p>
                    </Section>
                    <Section title="Playing notes">
                        <p>
                            Click the on-screen keys, or use your computer
                            keyboard: the middle letter row (<Key>A</Key>{' '}
                            <Key>S</Key> <Key>D</Key> <Key>F</Key> …) plays the
                            white keys and the row above (<Key>W</Key>{' '}
                            <Key>E</Key> <Key>T</Key> <Key>Y</Key> <Key>U</Key>{' '}
                            …) plays the black keys. The octave selector
                            transposes the whole keyboard up or down.
                        </p>
                        <p>
                            A connected MIDI keyboard is picked up automatically
                            (Web MIDI — Chrome/Edge).
                        </p>
                    </Section>
                    <Section title="Synth panel">
                        <p>
                            <span className="text-text">gain</span> /{' '}
                            <span className="text-text">detune</span> set the
                            master volume and global pitch offset. Double-click
                            any slider or knob to reset it to its default.
                        </p>
                        <p>
                            <span className="text-text">Freezer</span>: FREEZE
                            holds the notes currently sounding as endless
                            drones; RELEASE stops them.
                        </p>
                    </Section>
                    <Section title="Synth pad">
                        <p>
                            Click and drag on the grid to play freely:
                            horizontal position sets the pitch (between the
                            adjustable min/max frequencies), vertical position
                            sets the intensity.
                        </p>
                    </Section>
                    <Section title="Main module">
                        <p>
                            Each oscillator has a waveform selector (sine,
                            triangle, square, sawtooth — or draw your own
                            wavetable), gain and pitch knobs, and a mute button.
                        </p>
                        <p>
                            The modulator hosts extra generator oscillators plus
                            RM (ring modulation) and FM (frequency modulation)
                            sources — add oscillators to each bank to layer and
                            modulate the sound. The Envelope section shapes its
                            attack / decay / sustain / release.
                        </p>
                    </Section>
                </div>
            </div>
        </div>,
        document.body,
    );
};

const AppInfo: FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                aria-label="About Modusynth"
                title="How to use Modusynth"
                className="rounded-full border border-border bg-panel-2 p-1.5 text-text-dim transition-colors hover:border-accent-dim hover:text-accent"
                onClick={() => setIsOpen(true)}
            >
                <InfoIcon />
            </button>
            {isOpen ? <InfoModal onClose={() => setIsOpen(false)} /> : null}
        </>
    );
};

export default AppInfo;
