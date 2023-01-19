/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';

import * as d3 from 'd3';
import { useAppDispatch } from 'src/app/hooks';
import ModuleContext from 'src/components/modules/context/ModuleContext/ModuleContext';
import useSafeContext from 'src/hooks/useSafeContext';
import { Module, getModule } from 'src/reducers/synthesisSlice';

interface ModuleWithPeriodicWaveOptions extends Module {
    // eslint-disable-next-line no-undef
    periodicWaveOptions: PeriodicWaveOptions;
}

const WaveTableController = () => {
    const dispatch = useAppDispatch();

    const svgRef = useRef(null);

    const { moduleId } = useSafeContext(ModuleContext);
    const module = getModule(moduleId) as ModuleWithPeriodicWaveOptions;
    const { periodicWaveOptions } = module;
    const [count, setCount] = useState(0);

    const waveTableWidth = 800;
    const waveTableHeight = 300;

    useEffect(() => {
        initChart();
    }, []);

    // const changeChart = () => {
    //     drawChart(400, dataset[i++]);
    //     if (i === dataset.length) i = 0;
    // };
    const changeChart = (nativeEvent: MouseEvent, event: any) => {
        const pos = d3.pointer(nativeEvent, svgRef.current);
        d3.select(svgRef.current)
            .append('circle')
            .attr('fill', 'red')
            .attr('r', 1.5)
            .attr('cx', pos[0])
            .attr('cy', pos[1]);
        console.log('POINTING AT', pos);
        setCount((prevCount) => prevCount + 1);
    };

    function initChart() {
        d3.select(`wavetable_${moduleId}`)
            .append('svg')
            .attr('width', waveTableWidth)
            .attr('height', waveTableHeight)
            .style('border', '1px solid black');
    }

    return (
        <div>
            <h2>Graphs with React</h2>
            {count}
            <div id={`wavetable_${moduleId}`}></div>
            <svg
                ref={svgRef}
                id="demoMouseMove"
                width="800px"
                height="300px"
                onMouseMove={(event) => {
                    const { nativeEvent } = event;
                    changeChart(nativeEvent, event);
                }}
            >
                <path
                    d="M0,0 L800,0 L800,300 L0,300 Z"
                    stroke="black"
                    strokeWidth="5px"
                    fill="none"
                ></path>
            </svg>
            {/* <button onClick={changeChart}>Change Data</button> */}
        </div>
    );
};

export default WaveTableController;

// let i = 0;
// const dataset = [
//     [10, 30, 40, 20],
//     [10, 40, 30, 20, 50, 10],
//     [60, 30, 40, 20, 30],
// ];

// function initChart(height: number, width: number) {
//     d3.select('#chart')
//         .append('svg')
//         .attr('width', width)
//         .attr('height', height)
//         .style('border', '1px solid black');
// }

// function drawChart(height: number, data: number[]) {
//     const svg = d3.select('#chart svg');

//     var selection = svg.selectAll('rect').data(data);
//     var yScale = d3
//         .scaleLinear()
//         .domain([0, d3.max(data)])
//         .range([0, height - 100]);

//     selection
//         .transition()
//         .duration(100)
//         .attr('height', (d: any) => yScale(d))
//         .attr('y', (d: any) => height - yScale(d));

//     selection
//         .enter()
//         .append('rect')
//         .attr('x', (d: any, i: number) => i * 45)
//         .attr('y', () => height)
//         .attr('width', 40)
//         .attr('height', 0)
//         .attr('fill', 'orange')
//         .transition()
//         .duration(300)
//         .attr('height', (d: any) => yScale(d))
//         .attr('y', (d: any) => height - yScale(d));

//     selection
//         .exit()
//         .transition()
//         .duration(300)
//         .attr('y', () => height)
//         .attr('height', 0)
//         .remove();
// }
