import { useRef } from 'react';

import useDrawOscilloscope from './hooks/useDrawOscilloscope';

const OscilloscopeComponent = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useDrawOscilloscope({ canvasRef });

    return (
        <div>
            <h1>ANALYSER</h1>
            <canvas width={1500} height={600} ref={canvasRef} />
        </div>
    );
};

export default OscilloscopeComponent;

// function uint8arrayToStringMethod(myUint8Arr: any) {
//     return String.fromCharCode.apply(null, myUint8Arr);
// }
