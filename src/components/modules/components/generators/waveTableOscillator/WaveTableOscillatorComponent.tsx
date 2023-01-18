import { FC, useEffect, useState } from 'react';

import * as d3 from 'd3';
import { useAppDispatch } from 'src/app/hooks';
import { ModuleContextProvider } from 'src/components/modules/context/ModuleContext/ModuleContext';
import {
    OscillatorModule,
    addModule,
    getDefaultEnvelopeId,
    getModule,
    removeModule,
} from 'src/reducers/synthesisSlice';

import GainController from '../../core/controllers/gainController/GainController';
import PitchController from '../../core/controllers/pitchController/PitchController';
import useOscillator from '../oscillator/hooks/useOscillator';
import './styles.scss';

interface WaveTableOscillatorProps {
    moduleId: string;
    envelopeId?: string;
    parentModuleId?: string;
}
const WaveTableOscillatorComponent: FC<WaveTableOscillatorProps> = ({
    moduleId,
    envelopeId,
    parentModuleId,
}) => {
    const dispatch = useAppDispatch();
    const module = getModule(moduleId);
    const defaultEnvelopeId = getDefaultEnvelopeId();
    const [isSetup, setIsSetup] = useState<boolean>(false);

    useOscillator({ moduleId });

    // TODO: move this into a WaveTableController
    // TODO: make divisions settable (via input) to say how many we want
    // TODO: extra, make a range input to set the divisions and if we go down "merge" existen divisions to create the new ones (ej: we had 9 divisions and now we have 3, calculate these 3 as the median or sth of each 3 of the older ones).
    // const [tableDivisions] = useState<number>(100);

    // const screenSection = (key: number) => (
    //     <div key={key} className="wavetableoscillator__division"></div>
    // );

    useEffect(() => {
        if (!module) {
            const initialModule: OscillatorModule = {
                id: moduleId,
                type: 'custom',
                freq: 0,
                // periodicWaveOptions: { real: [0, 0], imag: [0, 1] },
                periodicWaveOptions: {
                    real: [10, 30, 40, 20],
                    imag: [10, 30, 40, 20],
                },
                gain: 0.5,
                pitch: 0,
                envelopeId: envelopeId || defaultEnvelopeId,
                customType: WAVETABLE_TYPE,
                parentModuleId,
            };
            dispatch(addModule(initialModule));
            setIsSetup(true);
        }
        return () => {
            removeModule(moduleId);
        };
    }, []);

    useEffect(() => {
        if (isSetup) {
            initChart(400, 600);
            changeChart();
        }
    }, [isSetup]);

    const changeChart = () => {
        drawChart(400, dataset[i++]);
        if (i === dataset.length) i = 0;
    };

    return (
        <ModuleContextProvider
            moduleId={moduleId}
            moduleType="wavetable_oscillator"
        >
            {isSetup ? (
                <>
                    {/* <div className="wavetableoscillator__screen">
                {Array.from({ length: freqSections }, (val, i) =>
                    screenSection(i),
                )}
            </div> */}
                    <h2>Graphs with React</h2>
                    <div id="chart"></div>
                    <button onClick={changeChart}>Change Data</button>
                    <GainController />
                    <PitchController />
                </>
            ) : null}
        </ModuleContextProvider>
    );
};

export default WaveTableOscillatorComponent;

const WAVETABLE_TYPE = 'wavetable';

let i = 0;
const dataset = [
    [10, 30, 40, 20],
    [10, 40, 30, 20, 50, 10],
    [60, 30, 40, 20, 30],
];

function initChart(height: number, width: number) {
    d3.select('#chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('border', '1px solid black');
}

function drawChart(height: number, data: number[]) {
    const svg = d3.select('#chart svg');

    var selection = svg.selectAll('rect').data(data);
    var yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data)])
        .range([0, height - 100]);

    selection
        .transition()
        .duration(100)
        .attr('height', (d: any) => yScale(d))
        .attr('y', (d: any) => height - yScale(d));

    selection
        .enter()
        .append('rect')
        .attr('x', (d: any, i: number) => i * 45)
        .attr('y', () => height)
        .attr('width', 40)
        .attr('height', 0)
        .attr('fill', 'orange')
        .transition()
        .duration(300)
        .attr('height', (d: any) => yScale(d))
        .attr('y', (d: any) => height - yScale(d));

    selection
        .exit()
        .transition()
        .duration(300)
        .attr('y', () => height)
        .attr('height', 0)
        .remove();
}
