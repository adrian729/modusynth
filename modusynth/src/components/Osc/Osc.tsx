import {
    useContext,
    useEffect,
    useState,
    MouseEvent,
    ChangeEvent,
} from 'react';
import { CTX } from 'src/context/Store';
import OscNode, { OscNodeType, OscNodeSettings } from './OscNode';

interface OscProps {
    defaultType?: OscillatorType;
    defaultActive?: boolean;
}

const Osc = ({ defaultType = 'sine', defaultActive = true }: OscProps) => {
    const [oscSettings, setOscSettings] = useState<OscNodeSettings>({
        type: defaultType,
        detune: 0,
    });
    const [active, setActive] = useState<boolean>(defaultActive);
    const [nodes, setNodes] = useState<Record<string, OscNodeType>>({});
    const { state } = useContext(CTX);
    let { audioContext, mainGain, activeNotes } = state;
    let { type, detune } = oscSettings;

    useEffect(() => {
        const createNode = (frequency: number): OscNodeType => {
            let node = OscNode({
                audioContext,
                type,
                detune,
                frequency,
                connection: mainGain,
            });
            return node;
        };

        const removeNodes = (
            tmpNodes: Record<string, OscNodeType>,
            activeNotesKeys: string[]
        ) => {
            Object.keys(tmpNodes)
                .filter(key => !activeNotesKeys.includes(key))
                .forEach(key => {
                    tmpNodes[key]?.stop();
                    delete tmpNodes[key];
                });
        };

        const addNodes = (
            tmpNodes: Record<string, OscNodeType>,
            activeNotesKeys: string[]
        ) => {
            activeNotesKeys
                .filter(key => !tmpNodes[key])
                .forEach(key => {
                    tmpNodes[key] = createNode(activeNotes[key]);
                    tmpNodes[key]?.start();
                });
        };

        setNodes(prevNodes => {
            let activeNotesKeys = active ? Object.keys(activeNotes) : [];
            let tmpNodes = { ...prevNodes };
            removeNodes(tmpNodes, activeNotesKeys);
            if (active) addNodes(tmpNodes, activeNotesKeys);
            return tmpNodes;
        });
    }, [activeNotes, active]);

    useEffect(() => {
        setNodes(prevNodes => {
            let tmpNodes = { ...prevNodes };
            Object.values(tmpNodes).map(val =>
                val?.changeSettings(oscSettings)
            );
            return tmpNodes;
        });
    }, [oscSettings]);

    const change = (e: ChangeEvent) => {
        let { checked } = e.target as HTMLInputElement;
        setActive(checked);
    };

    const changeType = (e: MouseEvent) => {
        let { id } = e.target as HTMLInputElement;
        setOscSettings({
            ...oscSettings,
            type: id as OscillatorType,
        } as OscNodeSettings);
    };

    const changeDetune = (e: ChangeEvent) => {
        let { value } = e.target as HTMLInputElement;
        setOscSettings({
            ...oscSettings,
            detune: value as unknown as number,
        } as OscNodeSettings);
    };

    const renderWaveTypeButtons = () => {
        const waveTypes = ['sine', 'triangle', 'square', 'sawtooth'];

        return waveTypes.map(waveType => {
            let setActive = type === waveType && 'active';
            return (
                <button
                    id={waveType}
                    key={waveType}
                    onClick={changeType}
                    className={`${setActive}`}>
                    {waveType}
                </button>
            );
        });
    };

    return (
        <div>
            <h5>
                Osc: {type}
                <input
                    type='checkbox'
                    id='osc'
                    name='osc'
                    onChange={change}
                    defaultChecked={active}
                />
            </h5>
            <div>
                <h6>Type</h6>
                {renderWaveTypeButtons()}
            </div>
            <div>
                <h6>Detune</h6>
                <input
                    id='detune'
                    value={detune}
                    onChange={changeDetune}
                    type='range'
                />
            </div>
        </div>
    );
};

export default Osc;
