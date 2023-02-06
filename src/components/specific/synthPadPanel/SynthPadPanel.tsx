import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import { stopSynthPad, updateSynthPad } from 'src/reducers/oscillatorsSlice';
import { useDebounce, useWindowSize } from 'usehooks-ts';

import './styles.scss';

const MIN_FREQ_BOUND = 20;
const MAX_FREQ_BOUND = 20000;
const MIN_FREQ_BOUND_DISTANCE = 50;

const SVG_HEIGHT = 300;

const SynthPadPanel = () => {
    const dispatch = useAppDispatch();
    const { width } = useWindowSize();

    const svgRef = useRef<SVGSVGElement>(null);
    const { current } = svgRef;

    const svgWidth = width * 0.9;
    const svgHeight = SVG_HEIGHT;
    const gridWidth = svgWidth / 20;
    const gridHeight = svgHeight / 5;
    const smallGridWidth = svgWidth / 200;
    const smallGridHeight = svgHeight / 50;

    const [freq, setFreq] = useState<number | undefined>(undefined);
    const [intensity, setIntensity] = useState<number>(0);
    const [clicked, setClicked] = useState<boolean>(false);

    const debouncedFreq = useDebounce<number | undefined>(freq, 1);
    const debouncedIntensity = useDebounce<number>(intensity, 1);

    // TODO: add debounces and fix usability
    const [minFreq, setMinFreq] = useState<number>(40);
    const [maxFreq, setMaxFreq] = useState<number>(8000);

    const onChangeMinFreq = (e: ChangeEvent) => {
        // TODO: refactor and make this better
        const { value } = e.target as HTMLInputElement;
        let numValue = value ? parseFloat(value) : 0;
        if (numValue < MIN_FREQ_BOUND) {
            numValue = MIN_FREQ_BOUND;
        }
        if (numValue + MIN_FREQ_BOUND_DISTANCE > maxFreq) {
            numValue = maxFreq - MIN_FREQ_BOUND_DISTANCE;
        }
        setMinFreq(numValue);
    };
    const onChangeMaxFreq = (e: ChangeEvent) => {
        // TODO: refactor and make this better
        const { value } = e.target as HTMLInputElement;
        let numValue = value ? parseFloat(value) : 0;
        if (numValue > MAX_FREQ_BOUND) {
            numValue = MAX_FREQ_BOUND;
        }
        if (numValue - MIN_FREQ_BOUND_DISTANCE < minFreq) {
            numValue = minFreq + MIN_FREQ_BOUND_DISTANCE;
        }
        setMaxFreq(numValue);
    };

    const calculateIntensity = (posY: number): number => {
        if (!current) {
            return 0;
        }

        const boxHeight = current.height.baseVal.value;
        if (boxHeight <= 0) {
            return 0;
        }

        return Math.min(1, 1 - posY / boxHeight);
    };

    const calculateFreq = (posX: number): number => {
        if (current) {
            const bbox = current.getBBox();
            const minPos = 0;
            const maxPos = minPos + bbox.width;
            const minVal = Math.log(minFreq);
            const maxVal = Math.log(maxFreq);

            const scale = (maxVal - minVal) / (maxPos - minPos);

            return Math.exp(minVal + scale * (posX - minPos));
        }
        return 0;
    };

    const calculateNote = (x: number, y: number): void => {
        const newFreq = calculateFreq(x);
        const newIntensity = calculateIntensity(y);
        setFreq(newFreq);
        setIntensity(newIntensity);
        // dispatch(
        //     updateSynthPad({
        //         frequency: newFreq,
        //         velocity: newIntensity * 127,
        //     }),
        // );
    };

    useEffect(() => {
        if (Number.isFinite(debouncedFreq)) {
            dispatch(
                updateSynthPad({
                    frequency: debouncedFreq!,
                    velocity: debouncedIntensity * 127,
                }),
            );
        }
    }, [debouncedFreq, debouncedIntensity]);

    const getCursorPoint = (event: MouseEvent) => {
        if (current) {
            const svgPoint = current.createSVGPoint();
            svgPoint.x = event.clientX;
            svgPoint.y = event.clientY;
            return svgPoint.matrixTransform(current.getScreenCTM()?.inverse());
        }
    };

    const updateFrequency = (event: MouseEvent) => {
        const { type } = event;
        if (type == 'mousedown' || type == 'mousemove') {
            const cursorPoint = getCursorPoint(event);
            if (cursorPoint) {
                calculateNote(cursorPoint.x, cursorPoint.y);
            }
        }
    };

    const playSound = (event: MouseEvent) => {
        updateFrequency(event);
    };

    const stopSound = () => {
        dispatch(stopSynthPad());
    };

    const mouseOff = () => {
        if (clicked) {
            stopSound();
            setFreq(0);
            setIntensity(0);
            setClicked(false);
        }
    };

    // TODO: move to d3
    // TODO: convert to a Bode Diagram panel
    return (
        <div>
            <h4>
                Frequency:{freq ? ` ${freq} Hz` : ' n/a'} Intensity:{' '}
                {` ${intensity}`}{' '}
            </h4>
            <div id="synthpad"></div>
            <div
                className="synthpad__grid"
                style={{ width: svgWidth, background: 'DarkSlateGrey' }}
            >
                <svg
                    ref={svgRef}
                    width={svgWidth}
                    height={svgHeight}
                    onMouseDown={(event) => {
                        playSound(event);
                        setClicked(true);
                        return true;
                    }}
                    onMouseMove={(event) => {
                        if (clicked) {
                            updateFrequency(event);
                        }
                    }}
                    onMouseUp={mouseOff}
                    onBlur={mouseOff}
                    onMouseOut={mouseOff}
                    onMouseLeave={mouseOff}
                >
                    <defs>
                        <pattern
                            id="smallGrid"
                            width={smallGridWidth}
                            height={smallGridHeight}
                            patternUnits="userSpaceOnUse"
                        >
                            <path
                                d={`M ${smallGridWidth} 0 L 0 0 0 ${smallGridHeight}`}
                                fill="none"
                                stroke="gray"
                                strokeWidth="0.8"
                            />
                        </pattern>
                        <pattern
                            id="grid"
                            width={gridWidth}
                            height={gridHeight}
                            patternUnits="userSpaceOnUse"
                        >
                            <rect
                                width={gridWidth}
                                height={gridHeight}
                                fill="url(#smallGrid)"
                            />
                            <path
                                d={`M ${gridWidth} 0 L 0 0 0 ${gridHeight}`}
                                fill="none"
                                stroke="gray"
                                strokeWidth="1.5"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>
            <div>
                <span>Min:</span>
                <input
                    type="number"
                    id={'synthpad_min_freq'}
                    value={minFreq}
                    onChange={onChangeMinFreq}
                    min={MIN_FREQ_BOUND}
                    max={MAX_FREQ_BOUND - MIN_FREQ_BOUND_DISTANCE}
                />
                <span>Max:</span>
                <input
                    type="number"
                    id={'synthpad_max_freq'}
                    value={maxFreq}
                    onChange={onChangeMaxFreq}
                    min={MIN_FREQ_BOUND + MIN_FREQ_BOUND_DISTANCE}
                    max={MAX_FREQ_BOUND}
                />
            </div>
        </div>
    );
};

export default SynthPadPanel;
