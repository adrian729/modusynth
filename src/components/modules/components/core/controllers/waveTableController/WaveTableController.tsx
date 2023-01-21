/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    ChangeEvent,
    MutableRefObject,
    useEffect,
    useRef,
    useState,
} from 'react';

import * as d3 from 'd3';
import { useAppDispatch } from 'src/app/hooks';
import Slider from 'src/components/common/core/slider/Slider';
import ModuleContext from 'src/components/modules/context/ModuleContext/ModuleContext';
import useSafeContext from 'src/hooks/useSafeContext';
import { Module, getModule, updateModule } from 'src/reducers/synthesisSlice';
import { useDebounce, useWindowSize } from 'usehooks-ts';

import SVGTable from './components/svgTable/SVGTable';

interface ModuleWithPeriodicWaveOptions extends Module {
    // eslint-disable-next-line no-undef
    periodicWaveOptions: PeriodicWaveOptions;
}

const WaveTableController = () => {
    const dispatch = useAppDispatch();

    const { moduleId } = useSafeContext(ModuleContext);
    const module = getModule(moduleId) as ModuleWithPeriodicWaveOptions;
    const { periodicWaveOptions } = module;

    const [periodicWaveOptionsCopy, setPeriodicWaveOptionsCopy] =
        useState(periodicWaveOptions);
    const { real, imag } = {
        ...{ real: [], imag: [] },
        ...periodicWaveOptionsCopy,
    };
    const debouncePerodicWaveOptions = useDebounce(
        periodicWaveOptionsCopy,
        200,
    );

    const realSVGRef = useRef<SVGSVGElement>(null);
    const imagSVGRef = useRef<SVGSVGElement>(null);
    const { current: realCurrent } = realSVGRef;
    const { current: imagCurrent } = imagSVGRef;

    const [numValues, setNumValues] = useState(40);

    const { width } = useWindowSize();
    const getTableWidth = () => width * 0.5;
    const waveTableHeight = 400;

    const [realClicked, setRealClicked] = useState<boolean>(false);
    const [imagClicked, setImagClicked] = useState<boolean>(false);
    const [count, setCount] = useState(0);
    const [isSetup, setIsSetup] = useState(false);

    function initChart(
        svgElement: SVGSVGElement | null,
        array: number[] | Float32Array,
    ) {
        if (svgElement) {
            const arrayValues = getArrayValues(array);
            const svg = d3.select(svgElement);

            svg.attr('width', getTableWidth())
                .attr('height', waveTableHeight)
                .style('border', '1px dotted black');

            const barWidth = getTableWidth() / numValues;
            const yScale: (val: number) => number = d3
                .scaleLinear()
                .domain([-1, 1])
                .range([0, waveTableHeight]);

            const getBarHeight = (data: number): number =>
                data > 0 ? yScale(data) - yScale(0) : yScale(0) - yScale(data);

            svg.selectAll('rect')
                .data(arrayValues)
                .enter()
                .append('rect')
                .attr('fill', 'lightseagreen')
                .attr('x', (d: number, i: number) => i * barWidth)
                .attr('y', (d: number) =>
                    d > 0 ? waveTableHeight - yScale(d) : waveTableHeight / 2,
                )
                .attr('height', (d: number) => getBarHeight(d))
                .attr('width', barWidth);

            const line = d3.line().context(null);
            svg.append('path')
                .attr(
                    'd',
                    line([
                        [0, waveTableHeight / 2],
                        [getTableWidth(), waveTableHeight / 2],
                    ]),
                )
                .attr('stroke', 'black');
        }
    }

    useEffect(() => {
        if (realCurrent && !isSetup) {
            initChart(realCurrent, real);
            initChart(imagCurrent, imag);
            setIsSetup(true);
        }
    }, [realCurrent]);

    useEffect(() => {
        d3.select(realCurrent).attr('width', getTableWidth());
    }, [width]);

    // TODO: check and refactor ALL svg and d3 related methods

    const getArrayValues = (array: number[] | Float32Array) =>
        fillArrayValues(array.slice(1), numValues);

    const changeChart = () => {
        if (realCurrent) {
            const realValues = getArrayValues(real);

            const svg = d3.select(realCurrent);

            const barWidth = getTableWidth() / realValues.length;
            const yScale = d3
                .scaleLinear()
                .domain([-1, 1])
                .range([0, waveTableHeight]);

            const getBarHeight = (data: number): number =>
                data > 0 ? yScale(data) - yScale(0) : yScale(0) - yScale(data);

            svg.selectAll('rect').remove();

            svg.selectAll('rect')
                .data(realValues)
                .enter()
                .append('rect')
                .attr('fill', 'lightseagreen')
                .attr('x', (d: number, i: number) => i * barWidth)
                .attr('y', (d: number) =>
                    d > 0 ? waveTableHeight - yScale(d) : waveTableHeight / 2,
                )
                .attr('height', (d: number) => getBarHeight(d))
                .attr('width', barWidth);
        }
    };

    const paint = (event: MouseEvent) => {
        if (realCurrent) {
            const svg = d3.select(realCurrent);
            const pos = d3.pointer(event, realCurrent);

            svg.append('circle')
                .attr('fill', 'lightblue')
                .attr('r', 1.5)
                .attr('cx', pos[0])
                .attr('cy', pos[1]);

            setCount((prevCount) => prevCount + 1);
        }
    };

    const divisionWidth = () => getTableWidth() / numValues;

    const getPosBarIndex = (posX: number) => Math.floor(posX / divisionWidth());
    const getPosScaledValue = (posY: number) =>
        1 - 2 * (posY / waveTableHeight); // range [-1, 1], max - min: 2, min: -1

    const fillArrayValues = (array: number[] | Float32Array, size: number) => [
        ...Array.from(array || []),
        ...Array(Math.max(0, size - (array?.length || 0))).fill(0),
    ];

    const deleteDots = () => {
        d3.select(realCurrent).selectAll('circle').remove();
    };

    useEffect(() => {
        dispatch(
            updateModule({
                ...module,
                periodicWaveOptions: debouncePerodicWaveOptions,
            } as ModuleWithPeriodicWaveOptions),
        );
        changeChart();
        deleteDots();
    }, [debouncePerodicWaveOptions]);

    useEffect(() => {
        changeChart();
        deleteDots();
    }, [numValues]);

    // ! TODO: real and imag need to have the same length when dispatching them!!!!!!!!!!!!!

    // TODO: when numValues < arrays length, shorten arrays

    // TODO: keep track of last index added, if it's at distance > 1 try to do a linear aprox of the middle points. Put last index to null on update/when setClicked to false
    const updateReal = (event: MouseEvent) => {
        if (realCurrent) {
            const pos = d3.pointer(event, realCurrent);
            const index = getPosBarIndex(pos[0]) + 1;
            const value = getPosScaledValue(pos[1]);
            let newReal = [...real];
            if (index > newReal.length) {
                newReal = fillArrayValues(newReal, index + 1);
            }
            newReal[index] = value;
            setPeriodicWaveOptionsCopy((prevPeriodicWaveOptions) => {
                const { real } = prevPeriodicWaveOptions;
                let newReal = [...(real || [])];
                if (index > newReal.length) {
                    newReal = fillArrayValues(newReal, index + 1);
                }
                newReal[index] = value;
                return { ...prevPeriodicWaveOptions, real: newReal };
            });
        }
    };
    const onChangeNumValues = (e: ChangeEvent): void => {
        setNumValues(parseInt((e.target as HTMLInputElement).value));
    };

    const updateNumValues = (value: number): void => setNumValues(value);

    // TODO: separate all the SVG logic into another component and use one for "real", the other for "imag"
    return (
        <div>
            <h2>Graphs with React</h2>
            <SVGTable optionsKey="real" numValues={numValues} />
            <SVGTable optionsKey="imag" numValues={numValues} />
            {/* <svg
                ref={realSVGRef}
                onMouseDown={({ nativeEvent }) => {
                    setRealClicked(true);
                    paint(nativeEvent);
                    updateReal(d3.pointer(nativeEvent, realCurrent));
                }}
                onMouseMove={({ nativeEvent }) => {
                    if (realClicked) {
                        paint(nativeEvent);
                        updateReal(nativeEvent);
                    }
                }}
                onMouseUp={() => setRealClicked(false)}
                onBlur={() => setRealClicked(false)}
                onMouseLeave={() => setRealClicked(false)}
            />
            <svg
                ref={imagSVGRef}
                // onMouseDown={({ nativeEvent }) => {
                //     setImagClicked(true);
                //     paint(nativeEvent);
                //     updateReal(d3.pointer(nativeEvent, realCurrent));
                // }}
                // onMouseMove={({ nativeEvent }) => {
                //     if (imagClicked) {
                //         paint(nativeEvent);
                //         // updateReal(nativeEvent);
                //     }
                // }}
                // onMouseUp={() => setImagClicked(false)}
                // onBlur={() => setImagClicked(false)}
                // onMouseLeave={() => setImagClicked(false)}
            /> */}
            <div style={{ display: 'inline-block' }}>
                <span>divisions:</span>
                <Slider
                    id={`${moduleId}_divisions`}
                    label="Num Divisions"
                    value={numValues}
                    onChange={onChangeNumValues}
                    onSliderReset={(id, value) => updateNumValues(value)}
                    resetValue={1}
                    min={4}
                    max={100}
                    step={1}
                />
                {count}
            </div>
        </div>
    );
};

export default WaveTableController;
