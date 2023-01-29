import { FC } from 'react';

import JqxKnob, {
    IKnobProps,
} from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxknob';
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css';
import 'jqwidgets-scripts/jqwidgets/styles/jqx.material-purple.css';

interface KnobProps extends IKnobProps {
    id: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
}
const Knob: FC<KnobProps> = ({
    value,
    min = 0,
    max = 100,
    step = 1,
    ...restProps
}: KnobProps) => {
    console.log('render??');
    return (
        <JqxKnob
            value={value}
            min={min}
            max={max}
            step={step}
            startAngle={120}
            endAngle={480}
            snapToStep={true}
            rotation={'clockwise'}
            pointer={{
                offset: '50%',
                size: '10%',
                style: {
                    fill: {
                        color: '#a4a3a3',
                        gradientStops: [
                            [0, 0.5],
                            [50, 0.6],
                            [100, 1],
                        ],
                        gradientType: 'linear',
                    },
                    stroke: '#333',
                },
                type: 'circle',
            }}
            {...restProps}
        />
    );
};

export default Knob;
