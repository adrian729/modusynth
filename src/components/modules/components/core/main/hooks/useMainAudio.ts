import { useEffect, useState } from 'react';

import MainContext from 'src/components/modules/context/MainContext/MainContext';
import useSafeContext from 'src/hooks/useSafeContext';
import { getSynthGain } from 'src/reducers/synthSlice';

const useMainAudio = () => {
    const {
        state: { audioContext, mainConnection },
    } = useSafeContext(MainContext);
    const [contextState] = useState<ContextState>({
        mainGainNode: new GainNode(audioContext, { gain: 0.2 }),
        compressor: new DynamicsCompressorNode(audioContext),
        out: audioContext.destination,
    });
    const { mainGainNode, compressor, out } = contextState;
    const mainGain = getSynthGain();

    useEffect(() => {
        mainConnection.connect(mainGainNode);
        mainGainNode.connect(compressor);
        compressor.connect(out);
    }, []);

    useEffect(() => {
        const { currentTime } = audioContext;
        mainGainNode.gain.setTargetAtTime(mainGain, currentTime, 0.005);
    }, [mainGain]);
};

export default useMainAudio;

interface ContextState {
    mainGainNode: GainNode;
    compressor: DynamicsCompressorNode;
    out: AudioDestinationNode;
}
