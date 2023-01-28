import { RefObject, useEffect, useState } from 'react';

import * as d3 from 'd3';
import MainContext from 'src/context/MainContext/MainContext';
import useSafeContext from 'src/hooks/useSafeContext';
import { useWindowSize } from 'usehooks-ts';

interface UseDrawOscilloscopeParams {
    svgRef: RefObject<SVGSVGElement>;
}
const useDrawOscilloscope = ({ svgRef }: UseDrawOscilloscopeParams) => {
    const { current } = svgRef;
    const { width } = useWindowSize();
    const oscilloscopeWidth = width * 0.9;
    const oscilloscopeHeight = 600;

    const [isSetup, setIsSetup] = useState(false);

    const {
        state: { audioContext, mainConnection },
    } = useSafeContext(MainContext);

    const resolution = 14; // fftSize [32, 32768] => [2^5, 2^15]
    const [analyser] = useState<AnalyserNode>(
        new AnalyserNode(audioContext, { fftSize: Math.pow(2, resolution) }),
    );
    const [dataArray] = useState<Uint8Array>(
        new Uint8Array(analyser.frequencyBinCount),
    );
    const [rafId, setRafId] = useState(requestAnimationFrame(tick));

    // TODO: check how to use selections and updates from D3 to make this better, performance this way is horrible

    function tick(): void {
        analyser.getByteTimeDomainData(dataArray);
        setRafId(requestAnimationFrame(tick));
        deleteLines(current);
        drawTableGuides({
            svgElement: current,
            width: oscilloscopeWidth,
            height: oscilloscopeHeight,
        });
        drawWave({
            svgElement: current,
            width: oscilloscopeWidth,
            height: oscilloscopeHeight,
            dataArray,
        });
    }

    useEffect(() => {
        mainConnection.connect(analyser);
        return () => {
            cancelAnimationFrame(rafId);
            analyser.disconnect();
        };
    }, []);

    useEffect(() => {
        if (current && !isSetup) {
            initChart({
                svgElement: current,
                width: oscilloscopeWidth,
                height: oscilloscopeHeight,
                dataArray,
            });
            setIsSetup(true);
        }
    }, [current]);
};

export default useDrawOscilloscope;

interface DrawWaveParams {
    svgElement: SVGSVGElement | null;
    width: number;
    height: number;
    dataArray: Uint8Array;
}
function drawWave({ svgElement, width, height, dataArray }: DrawWaveParams) {
    if (svgElement) {
        const svg = d3.select(svgElement);
        const line = d3.line().context(null);
        let x = 0;
        const sliceWidth = width / (dataArray.length - 1);
        const data = Array.from(dataArray).map((data) => {
            const y = (data / 255.0) * height;
            const newData = [x, y];
            x += sliceWidth;
            return newData;
        });
        svg.append('path')
            .attr('d', line(data))
            .attr('stroke', 'rgb(127,255,0)');
    }
}

interface DrawTableGuidesParams {
    svgElement: SVGSVGElement | null;
    width: number;
    height: number;
}
function drawTableGuides({ svgElement, width, height }: DrawTableGuidesParams) {
    if (svgElement) {
        const svg = d3.select(svgElement);
        const line = d3.line().context(null);
        svg.append('path')
            .attr(
                'd',
                line([
                    [0, height / 2],
                    [width, height / 2],
                ]),
            )
            .attr('stroke', 'rgba(240,255,255, 0.4)');
    }
}

interface InitChartParams {
    svgElement: SVGSVGElement | null;
    width: number;
    height: number;
    dataArray: Uint8Array;
}
function initChart({ svgElement, width, height, dataArray }: InitChartParams) {
    if (svgElement) {
        const svg = d3.select(svgElement);

        svg.attr('width', width).attr('height', height);

        svg.append('rect')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('fill', 'black');

        drawTableGuides({ svgElement, width, height });
        drawWave({ svgElement, width, height, dataArray });
    }
}

function deleteLines(svgElement: SVGSVGElement | null) {
    if (SVGElement) {
        d3.select(svgElement).selectAll('path').remove();
    }
}
