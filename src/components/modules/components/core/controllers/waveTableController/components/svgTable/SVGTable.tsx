import {
    ChangeEvent,
    MouseEvent,
    useCallback,
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

interface ModuleWithPeriodicWaveOptions extends Module {
    // eslint-disable-next-line no-undef
    periodicWaveOptions: PeriodicWaveOptions;
}

interface SVGTableProps {
    // eslint-disable-next-line no-undef
    optionsKey: 'real' | 'imag';
}
const SVGTable = ({ optionsKey }: SVGTableProps) => {
    const dispatch = useAppDispatch();

    const { moduleId } = useSafeContext(ModuleContext);
    const module = getModule(moduleId) as ModuleWithPeriodicWaveOptions;
    const { periodicWaveOptions = {} } = { ...module };

    // First value of periodicWaveOptions options is always 0
    const [array, setArray] = useState(
        periodicWaveOptions[optionsKey]?.slice(1) || [],
    );
    const debounceArray = useDebounce(array, 100);

    const svgRef = useRef<SVGSVGElement>(null);
    const { current } = svgRef;

    const { width } = useWindowSize();
    const tableWidth = width * 0.4;
    const tableHeight = 300;

    const [numValues, setNumValues] = useState(40);

    const [isSetup, setIsSetup] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [shiftPressed, setShiftPressed] = useState(false);
    const [, setPos] = useState<number[]>();
    const [, setTableBar] = useState<{ index: number; value: number }>();

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
        // TODO: update size of real/imag so that both match?¿? (get bigger size)
        // TODO: if value < deltaX (decide how much) ignore it for the resize (pe: we have [0.5, 0.7, 0, 000......., 0.001, 0000...], dont just take all the values with 0 just because of that 0.001...)
        const { real = [], imag = [] } = { ...periodicWaveOptions };
        const newOptionArray = debounceArray; // TODO: instead of just array, try to remove "tail" of 0s
        const length = Math.max(
            real.length,
            imag.length,
            newOptionArray.length,
        );

        dispatch(
            updateModule({
                ...module,
                periodicWaveOptions: {
                    real: getResizedArray(real, length),
                    imag: getResizedArray(imag, length),
                    [optionsKey]: getResizedArray(
                        [0, ...debounceArray],
                        length,
                    ),
                },
            } as ModuleWithPeriodicWaveOptions),
        );
        deleteHelpLine(current);
        drawTableGuides({
            svgElement: current,
            width: tableWidth,
            height: tableHeight,
        });
    }, [debounceArray]);

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
    }, [numValues]);

    const detectShiftDown = useCallback(
        (event: globalThis.KeyboardEvent) => {
            if (event.key === 'Shift' && !shiftPressed) {
                setShiftPressed(true);
            }
        },
        [shiftPressed, setShiftPressed],
    );
    const detectShiftUp = useCallback(
        (event: globalThis.KeyboardEvent) => {
            if (event.key === 'Shift' && shiftPressed) {
                setShiftPressed(false);
                if (!clicked) {
                    setTableBar(undefined);
                }
            }
        },
        [shiftPressed, setShiftPressed],
    );
    useEffect(() => {
        document.addEventListener('keydown', detectShiftDown);
        document.addEventListener('keyup', detectShiftUp);
        return () => document.removeEventListener('keydown', detectShiftDown);
    }, [detectShiftDown, detectShiftUp]);

    const yScale: (val: number) => number = d3
        .scaleLinear()
        .domain([-1, 1])
        .range([0, tableHeight]);

    const getBarHeight = (data: number): number =>
        data > 0 ? yScale(data) - yScale(0) : yScale(0) - yScale(data);

    const getPosBarIndex = (posX: number) =>
        Math.min(numValues - 1, Math.floor((posX * numValues) / tableWidth));

    const getPosScaledValue = (posY: number) => 1 - 2 * (posY / tableHeight); // range [-1, 1], max - min: 2, min: -1

    const interpolateValues = (
        nextIndex: number,
        nextValue: number,
        index: number,
        value: number,
        rectNodes: any,
    ) => {
        const numElementsUpdate = Math.abs(nextIndex - index) - 1;
        if (numElementsUpdate > 0) {
            const m = (nextValue - value) / (nextIndex - index);
            const c = nextValue - m * nextIndex;

            const indexesToUpdate = Array.from(
                { length: numElementsUpdate },
                (_, i) => i + Math.min(index, nextIndex) + 1,
            );
            indexesToUpdate.forEach((idx) => {
                const pointValue = m * idx + c;
                d3.select(rectNodes[idx])
                    .attr('y', () =>
                        pointValue > 0
                            ? tableHeight - yScale(pointValue)
                            : tableHeight / 2,
                    )
                    .attr('height', () => getBarHeight(pointValue));
            });
        }
    };

    const drawHelperLine = (
        nextIndex: number,
        nextValue: number,
        index: number,
        value: number,
    ) => {
        // const line = d3.line().context(null);
        const curve = d3.line().curve(d3.curveBasis);
        const svg = d3.select(current);
        svg.append('path')
            .attr(
                'd',
                curve([
                    [
                        (index * tableWidth) / numValues,
                        (tableHeight - value * tableHeight) / 2,
                    ],
                    [
                        (nextIndex * tableWidth) / numValues,
                        (tableHeight - nextValue * tableHeight) / 2,
                    ],
                ]),
            )
            .attr('stroke', 'red');
    };

    const updateArray = (event: MouseEvent) => {
        if (current) {
            const pos = d3.pointer(event, current);
            const nextIndex = getPosBarIndex(pos[0]);
            const nextValue = getPosScaledValue(pos[1]);

            const svg = d3.select(current);
            const rectsSize = svg.selectAll('rect').size();
            // Fill necessary rects into the svg
            if (rectsSize < nextIndex + 1) {
                const barWidth = tableWidth / numValues;
                svg.selectAll('rect')
                    .data(getResizedArray(array, nextIndex + 1))
                    .enter()
                    .append('rect')
                    .attr('fill', 'lightseagreen')
                    .attr('x', (d: number, i: number) => i * barWidth)
                    .attr('y', () => tableHeight / 2)
                    .attr('height', () => 0)
                    .attr('width', barWidth);
            }

            const rectNodes = svg.selectAll('rect').nodes();
            d3.select(rectNodes[nextIndex])
                .attr('y', () =>
                    nextValue > 0
                        ? tableHeight - yScale(nextValue)
                        : tableHeight / 2,
                )
                .attr('height', () => getBarHeight(nextValue));

            setTableBar((prevTableBar) => {
                if (!prevTableBar) {
                    return { index: nextIndex, value: nextValue };
                }
                const { index, value } = prevTableBar;
                if (!index || !value) {
                    return { index: nextIndex, value: nextValue };
                }
                drawHelperLine(nextIndex, nextValue, index, value);
                interpolateValues(
                    nextIndex,
                    nextValue,
                    index,
                    value,
                    rectNodes,
                );
                return { index: nextIndex, value: nextValue };
            });

            setArray((prevArray) => {
                let newArray = getResizedArray(
                    prevArray,
                    Math.max(prevArray.length, nextIndex),
                );
                newArray[nextIndex] = nextValue;

                return newArray;
            });
        }
    };

    const resetSemaphores = () => {
        setClicked(false);
        setPos(undefined);
        if (!shiftPressed) {
            setTableBar(undefined);
        }
    };

    const onChangeNumValues = (e: ChangeEvent): void => {
        setNumValues(parseInt((e.target as HTMLInputElement).value));
    };

    const updateNumValues = (value: number): void => setNumValues(value);

    // TODO: add reset button
    return (
        <div style={{ display: 'inline-block' }}>
            <svg
                ref={svgRef}
                onMouseDown={(event) => {
                    setClicked(true);
                    updateArray(event);
                }}
                onMouseMove={(event) => {
                    if (clicked) {
                        updateArray(event);
                    }
                }}
                onMouseUp={resetSemaphores}
                onBlur={resetSemaphores}
                onMouseLeave={resetSemaphores}
            />
            <Slider
                id={`${moduleId}_divisions`}
                label="Num Divisions"
                value={numValues}
                onChange={onChangeNumValues}
                onSliderReset={(id, value) => updateNumValues(value)}
                resetValue={40}
                min={4}
                max={200}
                step={1}
            />
        </div>
    );
};

export default SVGTable;

const getResizedArray = (array: number[] | Float32Array, size: number) =>
    size > array.length
        ? [
              ...Array.from(array),
              ...Array(Math.max(0, size - array.length)).fill(0),
          ]
        : array.slice(0, size);

// TODO: check more about D3 and how to update the chart data (ej: https://observablehq.com/@d3/bar-chart-transitions)

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
            .attr('stroke', 'black');
    }
}

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

        drawTableGuides({ svgElement, width, height });
    }
}

function deleteHelpLine(svgElement: SVGSVGElement | null) {
    if (SVGElement) {
        d3.select(svgElement).selectAll('path').remove();
    }
}
