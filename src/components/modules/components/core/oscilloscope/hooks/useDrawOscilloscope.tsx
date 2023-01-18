import { RefObject, useEffect, useState } from 'react';

import MainContext from 'src/context/MainContext/MainContext';
import useSafeContext from 'src/hooks/useSafeContext';

interface UseDrawOscilloscopeParams {
    canvasRef: RefObject<HTMLCanvasElement>;
}
const useDrawOscilloscope = ({ canvasRef }: UseDrawOscilloscopeParams) => {
    const {
        state: { audioContext, mainConnection },
    } = useSafeContext(MainContext);
    // fftSize [32, 32768] => [2^5, 2^15]
    const resolution = 15;
    const [analyser] = useState<AnalyserNode>(
        new AnalyserNode(audioContext, { fftSize: Math.pow(2, resolution) }),
    );
    const [dataArray] = useState<Uint8Array>(
        new Uint8Array(analyser.frequencyBinCount),
    );
    const [rafId, setRafId] = useState(requestAnimationFrame(tick));

    function tick(): void {
        analyser.getByteTimeDomainData(dataArray);
        setRafId(requestAnimationFrame(tick));
        draw();
    }

    function draw(): void {
        const { current } = canvasRef;
        if (!current) {
            return;
        }
        const { width, height } = current;
        const context = current.getContext('2d');
        if (!context) {
            return;
        }
        let x = 0;
        const sliceWidth = (width * 1.0) / dataArray.length;

        context.clearRect(0, 0, width, height);
        context.fillStyle = 'black';
        context.fillRect(0, 0, width, height);

        context.lineWidth = 1;

        context.strokeStyle = 'rgba(240,255,255, 0.4)';
        context.beginPath();
        context.moveTo(0, height / 2);
        context.lineTo(width, height / 2);
        context.stroke();

        // Audio Line
        context.lineWidth = 2;
        context.strokeStyle = 'rgb(127,255,0)';
        context.beginPath();
        context.moveTo(0, height / 2);
        for (const item of dataArray) {
            const y = (item / 255.0) * height;
            context.lineTo(x, y);
            x += sliceWidth;
        }
        context.lineTo(x, height / 2);
        context.stroke();
    }

    useEffect(() => {
        mainConnection.connect(analyser);
        return () => {
            cancelAnimationFrame(rafId);
            analyser.disconnect();
        };
    }, []);
};

export default useDrawOscilloscope;
