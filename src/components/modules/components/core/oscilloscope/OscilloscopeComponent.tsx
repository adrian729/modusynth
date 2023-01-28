import { useRef } from 'react';

import useDrawOscilloscope from './hooks/useDrawOscilloscope';

const OscilloscopeComponent = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    useDrawOscilloscope({ svgRef });

    return (
        <div>
            <h1>ANALYSER</h1>
            <svg ref={svgRef} />
        </div>
    );
};

export default OscilloscopeComponent;
