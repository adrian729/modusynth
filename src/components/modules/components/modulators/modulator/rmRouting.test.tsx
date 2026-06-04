import { act, fireEvent, render, screen } from '@testing-library/react';
import App from 'src/app/App';
import store from 'src/app/store';
import { addNote } from 'src/reducers/oscillatorsSlice';

/**
 * Ring-mod routing regression test.
 *
 * The Web Audio mocks (setupTests.ts) satisfy node construction but record
 * nothing, so this file re-wraps the node globals with recording subclasses
 * and asserts the audio graph that the REAL component flow builds when the
 * user adds an RM oscillator in the Modulator and plays a note. The carrier
 * is the modulator's DEFAULT generator oscillator (seeded on mount):
 *
 *   RM osc -> ... -> rms combinator out ──> rmGain.gain   (modulation edge)
 *   default gen osc -> generators out ────> rmGain        (carrier edge)
 *   rmGain -> wet -> modulator out -> main -> compressor -> destination
 */

interface Edge {
    from: unknown;
    to: unknown;
}

const allNodes: Array<Record<string, unknown>> = [];
const edges: Edge[] = [];
const contexts: Array<Record<string, unknown>> = [];

const NODE_GLOBALS = [
    'GainNode',
    'OscillatorNode',
    'ConstantSourceNode',
    'DynamicsCompressorNode',
];

beforeAll(() => {
    const g = globalThis as Record<string, unknown>;
    NODE_GLOBALS.forEach((name) => {
        const Original = g[name] as new (...args: unknown[]) => Record<
            string,
            unknown
        >;
        g[name] = class extends Original {
            nodeName = name;
            connect = (target: unknown): unknown => {
                edges.push({ from: this, to: target });
                return target ?? this;
            };
            constructor(...args: unknown[]) {
                super(...args);
                allNodes.push(this);
            }
        };
    });
    const OriginalCtx = g.AudioContext as new (...args: unknown[]) => Record<
        string,
        unknown
    >;
    g.AudioContext = class extends OriginalCtx {
        constructor(...args: unknown[]) {
            super(...args);
            contexts.push(this);
        }
    };
});

const isParam = (x: unknown): boolean =>
    !!x &&
    typeof (x as Record<string, unknown>).setValueAtTime === 'function' &&
    typeof (x as Record<string, unknown>).connect !== 'function';

const ownerByGain = (param: unknown): Record<string, unknown> | undefined =>
    allNodes.find((n) => n.gain === param);

const ownerOfParam = (param: unknown): Record<string, unknown> | undefined =>
    allNodes.find(
        (n) =>
            n.gain === param ||
            n.frequency === param ||
            n.detune === param ||
            n.offset === param,
    );

/** Forward reachability over the recorded graph. Param edges continue through
 *  the param's owning node unless nodeOnly is set. */
const forwardReachable = (start: unknown, nodeOnly = false): Set<unknown> => {
    const seen = new Set<unknown>([start]);
    const queue: unknown[] = [start];
    while (queue.length) {
        const cur = queue.shift();
        edges
            .filter((e) => e.from === cur)
            .forEach(({ to }) => {
                let next = to;
                if (isParam(to)) {
                    if (nodeOnly) {
                        return;
                    }
                    next = ownerOfParam(to);
                }
                if (next && !seen.has(next)) {
                    seen.add(next);
                    queue.push(next);
                }
            });
    }
    return seen;
};

test('RM oscillator modulates the default generator, audibly routed', () => {
    render(<App />);

    // No 'Add Generator Osc' click: the modulator seeds one generator by
    // default, and it must serve as the RM carrier out of the box.
    fireEvent.click(screen.getByText('Add RM Osc'));

    act(() => {
        store.dispatch(addNote({ note: 'C4', frequency: 261.63 }));
    });

    const destination = contexts[0].destination;
    const oscillators = allNodes.filter((n) => n.nodeName === 'OscillatorNode');
    expect(oscillators.length).toBeGreaterThan(0);

    // 1) At least one oscillator voice reaches the speakers.
    const audible = oscillators.filter((o) =>
        forwardReachable(o).has(destination),
    );
    expect(audible.length).toBeGreaterThan(0);

    // 2) Something modulates a gain AudioParam (the rmGain.gain connection).
    const gainParamEdges = edges.filter(
        (e) => isParam(e.to) && ownerByGain(e.to),
    );
    expect(gainParamEdges.length).toBeGreaterThan(0);

    // 3) Full ring-mod condition: an oscillator-driven signal modulates the
    //    gain of a node that an oscillator-driven carrier flows through, and
    //    that node is audible.
    const rmWired = gainParamEdges.some(({ from, to }) => {
        const owner = ownerByGain(to);
        const modulatedByOsc = oscillators.some((o) =>
            forwardReachable(o, true).has(from),
        );
        const carrierThrough = oscillators.some((o) =>
            forwardReachable(o, true).has(owner),
        );
        const ownerAudible = forwardReachable(owner).has(destination);
        return modulatedByOsc && carrierThrough && ownerAudible;
    });
    expect(rmWired).toBe(true);
});
