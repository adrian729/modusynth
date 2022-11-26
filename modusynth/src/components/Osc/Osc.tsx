import { FC, useEffect, useState, MouseEvent, ChangeEvent } from 'react';
import { CTX } from 'src/context/Store';
import useSafeContext from 'src/hooks/useSafeContext';
import OscNode, { OscNodeType, OscNodeSettings, OscNodeProps } from './OscNode';

const eqSet = (xs: Set<string>, ys: Set<string>): boolean =>
    xs.size === ys.size && [...xs].every(x => ys.has(x));

const removeInactive = (
    records: Record<string, OscNodeType>,
    activeKeys: Set<string>
): void => {
    Object.keys(records)
        .filter(key => !activeKeys.has(key))
        .forEach(key => {
            records[key].stop();
            delete records[key];
        });
};

const addActive = (
    records: Record<string, OscNodeType>,
    activeRecords: Record<string, number>,
    activeKeys: string[],
    oscNodeProps: OscNodeProps
): void => {
    activeKeys
        .filter(key => !records[key])
        .forEach(key => {
            let oscNodePropsWithFreq: OscNodeProps = {
                ...oscNodeProps,
                frequency: activeRecords[key],
            };
            records[key] = OscNode(oscNodePropsWithFreq);
            records[key].start();
        });
};

interface OscProps {
    defaultType?: OscillatorType;
    defaultMute?: boolean;
}
const Osc: FC<OscProps> = ({ defaultType = 'sine', defaultMute = false }) => {
    const { state } = useSafeContext(CTX);
    const [nodes, setNodes] = useState<Record<string, OscNodeType>>({});
    const [drones, setDrones] = useState<Record<string, OscNodeType>>({});
    const [oscSettings, setOscSettings] = useState<OscNodeSettings>({
        type: defaultType,
        detune: 0,
        gain: 0.5,
        mute: defaultMute,
    });
    let { audioContext, mainGain, activeNotes, droneNotes } = state;
    let { type, detune, gain, mute } = oscSettings;

    useEffect((): void => {
        let activeNoteKeys = Object.keys(activeNotes);

        let nodesKeysSet = new Set(Object.keys(nodes));
        let activeNotesKeysSet = new Set(activeNoteKeys);

        if (!eqSet(nodesKeysSet, activeNotesKeysSet)) {
            setNodes(prevNodes => {
                let tmpNodes = { ...prevNodes };
                removeInactive(tmpNodes, activeNotesKeysSet);

                let oscNodeProps: OscNodeProps = {
                    audioContext,
                    type,
                    frequency: 0,
                    detune,
                    connection: mainGain,
                    gain,
                    mute,
                };
                addActive(tmpNodes, activeNotes, activeNoteKeys, oscNodeProps);

                return tmpNodes;
            });
        }
    }, [activeNotes, nodes, audioContext, detune, gain, mainGain, mute, type]);

    useEffect((): void => {
        let droneNoteKeys = Object.keys(droneNotes);

        let dronesKeysSet = new Set(Object.keys(drones));
        let droneNoteKeysSet = new Set(droneNoteKeys);

        if (!eqSet(dronesKeysSet, droneNoteKeysSet)) {
            setDrones(prevDrones => {
                let tmpDrones = { ...prevDrones };
                removeInactive(tmpDrones, droneNoteKeysSet);

                let oscNodeProps: OscNodeProps = {
                    audioContext,
                    type,
                    frequency: 0,
                    detune,
                    connection: mainGain,
                    gain,
                    mute,
                };
                addActive(tmpDrones, droneNotes, droneNoteKeys, oscNodeProps);
                return tmpDrones;
            });
        }
    }, [droneNotes, drones, audioContext, detune, gain, mainGain, mute, type]);

    useEffect((): void => {
        setNodes(prevNodes => {
            let tmpNodes = { ...prevNodes };
            Object.values(tmpNodes).map(val => val.changeSettings(oscSettings));
            return tmpNodes;
        });
    }, [oscSettings]);

    const changeMuted = (e: ChangeEvent): void => {
        let { checked } = e.target as HTMLInputElement;
        setOscSettings({
            ...oscSettings,
            mute: !checked,
        } as OscNodeSettings);
    };

    const change = (e: ChangeEvent): void => {
        let { id, value } = e.target as HTMLInputElement;
        setOscSettings({
            ...oscSettings,
            [id]: value as unknown as number,
        } as OscNodeSettings);
    };

    const changeType = (e: MouseEvent): void => {
        let { id } = e.target as HTMLInputElement;
        setOscSettings({
            ...oscSettings,
            type: id as OscillatorType,
        } as OscNodeSettings);
    };

    const handleClick = (e: MouseEvent, id: string, val: number): void => {
        let { detail } = e;
        if (detail === 2) {
            setOscSettings({
                ...oscSettings,
                [id]: val,
            } as OscNodeSettings);
        }
    };

    const WaveTypeSelector: FC = () => {
        const waveTypes = ['sine', 'triangle', 'square', 'sawtooth'];

        return (
            <>
                {waveTypes.map(waveType => (
                    <button
                        id={waveType}
                        key={waveType}
                        onClick={changeType}
                        className={(waveType === type && 'active') || ''}>
                        {waveType}
                    </button>
                ))}
            </>
        );
    };

    return (
        <div
            style={{
                display: 'inline-block',
                border: 'solid 1px black',
                borderRadius: '1rem',
                boxShadow:
                    '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                width: 'fit-content',
                margin: '1rem 1rem',
                padding: '.2rem',
            }}>
            <h5>
                Osc: {type}
                <input
                    type='checkbox'
                    id='osc'
                    name='osc'
                    onChange={changeMuted}
                    defaultChecked={!mute}
                />
            </h5>
            <div>
                <h6>Type</h6>
                <WaveTypeSelector />
            </div>
            <div style={{ display: 'inline-block' }}>
                <h6>Detune: {detune}</h6>
                <input
                    id='detune'
                    value={detune}
                    onChange={change}
                    onClick={e => handleClick(e, 'detune', 0)}
                    type='range'
                    min={-100}
                />
            </div>
            <div style={{ display: 'inline-block' }}>
                <h6>Gain: {gain}</h6>
                <input
                    id='gain'
                    value={gain}
                    onChange={change}
                    onClick={e => handleClick(e, 'gain', 1)}
                    type='range'
                    step={0.1}
                    min={0.1}
                    max={2}
                />
            </div>
        </div>
    );
};

export default Osc;
