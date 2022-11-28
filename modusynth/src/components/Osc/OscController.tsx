import { FC, useEffect, useState, MouseEvent, ChangeEvent } from 'react';
import { INIT_OSC_GAIN } from 'src/actions/oscActions';
import { CTX } from 'src/context/MainStore';
import { OscCTX } from 'src/context/OscContext';
import useSafeContext from 'src/hooks/useSafeContext';
import { Envelope, OscSettings } from 'src/types/oscillator';
import ADSR from './ADSR';
import OscNode, { OscNodeType, OscNodeProps } from './OscNode';

interface OscState {
    nodes: Record<string, OscNodeType>;
    drones: Record<string, OscNodeType>;
    oscSettings: OscSettings;
    oscGainControl: GainNode;
}

interface OscProps {
    defaultType?: OscillatorType;
    defaultMute?: boolean;
}

const OscController: FC<OscProps> = ({
    defaultType = 'sine',
    defaultMute = false,
}) => {
    const { state } = useSafeContext(CTX);
    const { oscCtxState, dispatchOscState } = useSafeContext(OscCTX);
    let { audioContext, mainGain, activeNotes, droneNotes } = state;
    // let { oscGainControl, oscSettings } = oscCtxState;
    const defaultEnvelope: Envelope = {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.6,
        release: 0.1,
    };
    const defaultOscSettings: OscSettings = {
        type: defaultType,
        detune: 0,
        envelope: defaultEnvelope,
        gain: 0.5,
        mute: defaultMute,
    };
    const [oscState, setOscState] = useState<OscState>({
        nodes: {},
        drones: {},
        oscSettings: defaultOscSettings,
        oscGainControl: audioContext.createGain(),
    });
    let { oscSettings, oscGainControl } = oscState;
    let { type, detune, envelope, gain, mute } = oscSettings;

    /**
     * Setup oscGainControl connection and initial gain
     */
    useEffect((): void => {
        // let oscGainControl = audioContext.createGain();
        // oscGainControl.gain.value = mute ? 0 : gain;
        // oscGainControl.connect(mainGain);

        setOscState(prevOscState => {
            let { oscGainControl } = prevOscState;
            let { gain, mute } = prevOscState.oscSettings;
            oscGainControl.gain.value = mute ? 0 : gain;
            oscGainControl.connect(mainGain);
            return { ...prevOscState, oscGainControl };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Control gain and mute change
     */
    useEffect((): void => {
        // let { currentTime } = audioContext;
        // let newOscGC = { ...oscGainControl };
        // newOscGC.gain.cancelScheduledValues(currentTime);
        // newOscGC.gain.setValueAtTime(mute ? 0 : gain, currentTime);

        setOscState(prevOscState => {
            let { oscSettings, oscGainControl } = prevOscState;
            let { gain } = oscSettings;
            let { currentTime } = audioContext;
            oscGainControl.gain.cancelScheduledValues(currentTime);
            oscGainControl.gain.setValueAtTime(mute ? 0 : gain, currentTime);
            return { ...prevOscState, oscGainControl };
        });
    }, [audioContext, mute, gain]);

    /**
     * Update nodes on activeNotes change
     */
    useEffect((): void => {
        setOscState(prevOscState => {
            let newNodes = updateNodes(
                audioContext,
                prevOscState,
                prevOscState.nodes,
                activeNotes
            );
            return { ...prevOscState, nodes: newNodes };
        });
    }, [audioContext, activeNotes]);

    /**
     * Update drones on droneNotes change
     */
    useEffect((): void => {
        setOscState(prevOscState => {
            let newDrones = updateNodes(
                audioContext,
                prevOscState,
                prevOscState.drones,
                droneNotes,
                false
            );
            return { ...prevOscState, drones: newDrones };
        });
    }, [audioContext, droneNotes]);

    /**
     * Update osc settings
     */
    useEffect((): void => {
        setOscState(prevOscState => {
            let newNodes = { ...prevOscState.nodes };
            Object.values(newNodes).map(val => val.changeSettings(oscSettings));
            return { ...prevOscState, nodes: newNodes };
        });
    }, [oscSettings]);

    const changeMuted = (e: ChangeEvent): void => {
        let { checked } = e.target as HTMLInputElement;
        let newOscSettings = {
            ...oscSettings,
            mute: !checked,
        } as OscSettings;
        setOscState({ ...oscState, oscSettings: newOscSettings });
    };

    const change = (e: ChangeEvent): void => {
        let { id, value } = e.target as HTMLInputElement;
        let newOscSettings = {
            ...oscSettings,
            [id]: value as unknown as number,
        } as OscSettings;
        setOscState({ ...oscState, oscSettings: newOscSettings });
    };

    const changeType = (e: MouseEvent): void => {
        let { id } = e.target as HTMLInputElement;
        let newOscSettings = {
            ...oscSettings,
            type: id as OscillatorType,
        } as OscSettings;
        setOscState({ ...oscState, oscSettings: newOscSettings });
    };

    const handleClick = (e: MouseEvent, id: string, val: number): void => {
        let { detail } = e;
        if (detail === 2) {
            let newOscSettings = {
                ...oscSettings,
                [id]: val,
            } as OscSettings;
            setOscState({ ...oscState, oscSettings: newOscSettings });
        }
    };

    const changeEnvelope = (e: ChangeEvent): void => {
        let { id, value } = e.target as HTMLInputElement;
        let newEnvelope: Envelope = {
            ...envelope,
            [id]: parseFloat(value),
        };
        let newOscSettings: OscSettings = {
            ...oscSettings,
            envelope: newEnvelope,
        };
        setOscState({ ...oscState, oscSettings: newOscSettings });
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
                border: '1px solid black',
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
            <ADSR
                envelope={envelope}
                change={changeEnvelope}
                handleClick={handleClick}
            />
        </div>
    );
};
export default OscController;

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
    audioContext: AudioContext,
    connection: AudioNode,
    oscNodeProps: OscNodeProps
): void => {
    activeKeys
        .filter(key => !records[key])
        .forEach(key => {
            let oscNodePropsWithFreq: OscNodeProps = {
                ...oscNodeProps,
                frequency: activeRecords[key],
            };
            records[key] = OscNode(
                audioContext,
                connection,
                oscNodePropsWithFreq
            );
        });
};

const updateNodes = (
    audioContext: AudioContext,
    prevOscState: OscState,
    oldNodes: Record<string, OscNodeType>,
    notes: Record<string, number>,
    addIfMuted: boolean = true
): Record<string, OscNodeType> => {
    let { oscSettings, oscGainControl } = prevOscState;
    let { type, detune, envelope, mute } = oscSettings;
    let newNodes = { ...oldNodes };
    let noteKeys = Object.keys(notes);
    let noteKeysSet = new Set(noteKeys);

    removeInactive(newNodes, noteKeysSet);

    let oscNodeProps: OscNodeProps = {
        type,
        frequency: 0,
        detune,
        envelope,
    };

    if (addIfMuted || !mute) {
        addActive(
            newNodes,
            notes,
            noteKeys,
            audioContext,
            oscGainControl,
            oscNodeProps
        );
    }

    return newNodes;
};
