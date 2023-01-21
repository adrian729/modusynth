/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';

import * as d3 from 'd3';
import ModuleContext from 'src/components/modules/context/ModuleContext/ModuleContext';
import useSafeContext from 'src/hooks/useSafeContext';
import { Module, getModule } from 'src/reducers/synthesisSlice';
import { useDebounce, useWindowSize } from 'usehooks-ts';

interface ModuleWithPeriodicWaveOptions extends Module {
    // eslint-disable-next-line no-undef
    periodicWaveOptions: PeriodicWaveOptions;
}

interface SVGTableProps {
    // eslint-disable-next-line no-undef
    optionsKey: 'real' | 'imag';
    numValues: number;
}
const SVGTable = ({ optionsKey, numValues }: SVGTableProps) => {
    const { moduleId } = useSafeContext(ModuleContext);
    const module = getModule(moduleId) as ModuleWithPeriodicWaveOptions;
    const { periodicWaveOptions } = module;

    // First value of periodicWaveOptions options is always 0
    const [array, setArray] = useState(
        fillArrayValues(
            periodicWaveOptions[optionsKey]?.slice(1) || [],
            numValues,
        ),
    );
    const debounceArray = useDebounce(array, 200);

    const svgRef = useRef<SVGSVGElement>(null);
    const { current } = svgRef;
    const [clicked, setClicked] = useState(false);

    const { width } = useWindowSize();
    const tableWidth = width * 0.5;
    const tableHeight = 400;

    const [isSetup, setIsSetup] = useState(false);

    useEffect(() => {
        if (current && !isSetup) {
            initChart({
                array,
                numValues,
                svgElement: current,
                width: tableWidth,
                height: tableHeight,
            });
            setIsSetup(true);
        }
    }, [current]);

    useEffect(() => {
        const svg = d3.select(current);
        svg.attr('width', tableWidth);

        const line = d3.line().context(null);
        svg.selectAll('path').attr(
            'd',
            line([
                [0, tableHeight / 2],
                [tableWidth, tableHeight / 2],
            ]),
        );

        const barWidth = tableWidth / numValues;
        svg.selectAll('rect')
            .attr('x', (d: number, i: number) => i * barWidth)
            .attr('width', barWidth);
    }, [width]);

    useEffect(() => {
        const svg = d3.select(current);
        svg.selectAll('rect')
            .filter((d: number, i: number) => i >= numValues)
            .remove();

        const barWidth = tableWidth / numValues;
        svg.selectAll('rect')
            .attr('x', (d: number, i: number) => i * barWidth)
            .attr('width', barWidth);

        setArray((prevArray) => prevArray.slice(0, numValues));
    }, [numValues]);

    const getPosBarIndex = (posX: number) =>
        Math.floor(posX / (tableWidth / numValues));
    const getPosScaledValue = (posY: number) => 1 - 2 * (posY / tableHeight); // range [-1, 1], max - min: 2, min: -1

    const updateArray = (event: MouseEvent) => {
        if (current) {
            const pos = d3.pointer(event, current);
            const index = getPosBarIndex(pos[0]);
            const value = getPosScaledValue(pos[1]);

            const svg = d3.select(current);
            const rects = svg.selectAll('rect');

            const yScale: (val: number) => number = d3
                .scaleLinear()
                .domain([-1, 1])
                .range([0, tableHeight]);

            const getBarHeight = (data: number): number =>
                data > 0 ? yScale(data) - yScale(0) : yScale(0) - yScale(data);

            d3.select(rects.nodes()[index])
                .attr('y', (d: number) =>
                    d > 0 ? tableHeight - yScale(d) : tableHeight / 2,
                )
                .attr('height', (d: number) => getBarHeight(d));
            setArray((prevArray) => {
                let newArray = [...prevArray];
                if (index > newArray.length) {
                    newArray = fillArrayValues(newArray, index + 1);
                }
                newArray[index] = value;

                return newArray;
            });
        }
    };

    return (
        <svg
            ref={svgRef}
            onMouseDown={({ nativeEvent }) => {
                setClicked(true);
                // paint(nativeEvent);
                // updateReal(d3.pointer(nativeEvent, current));
                updateArray(nativeEvent);
            }}
            onMouseMove={({ nativeEvent }) => {
                if (clicked) {
                    // paint(nativeEvent);
                    // updateReal(nativeEvent);
                }
            }}
            onMouseUp={() => setClicked(false)}
            onBlur={() => setClicked(false)}
            onMouseLeave={() => setClicked(false)}
        />
    );
};

export default SVGTable;

const fillArrayValues = (array: number[] | Float32Array, size: number) => [
    ...Array.from(array || []),
    ...Array(Math.max(0, size - (array?.length || 0))).fill(0),
];

// TODO: check more about D3 and how to update the chart data (ej: https://observablehq.com/@d3/bar-chart-transitions)
interface InitChartParams {
    array: number[] | Float32Array;
    numValues: number;
    svgElement: SVGSVGElement | null;
    width: number;
    height: number;
}
function initChart({
    array,
    numValues,
    svgElement,
    width,
    height,
}: InitChartParams) {
    if (svgElement) {
        const svg = d3.select(svgElement);

        svg.attr('width', width)
            .attr('height', height)
            .style('border', '1px dotted black');

        const barWidth = width / numValues;
        const yScale: (val: number) => number = d3
            .scaleLinear()
            .domain([-1, 1])
            .range([0, height]);

        const getBarHeight = (data: number): number =>
            data > 0 ? yScale(data) - yScale(0) : yScale(0) - yScale(data);

        svg.selectAll('rect')
            .data(array)
            .enter()
            .append('rect')
            .attr('fill', 'lightseagreen')
            .attr('x', (d: number, i: number) => i * barWidth)
            .attr('y', (d: number) => (d > 0 ? height - yScale(d) : height / 2))
            .attr('height', (d: number) => getBarHeight(d))
            .attr('width', barWidth);

        const line = d3.line().context(null);
        svg.append('path')
            .attr(
                'd',
                line([
                    [0, height / 2],
                    [width, height / 2],
                ]),
            )
            .attr('stroke', 'black');
    }
}
