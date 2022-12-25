import { ChangeEvent, ReactElement, useState } from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import Slider, { SliderProps } from './Slider';

const args: SliderProps = {
    id: 'defaultId',
    value: 0,
    onChange: () => {},
    onSliderReset: () => {},
};

export default {
    args,
    component: Slider,
    title: 'components/01_core/Slider',
} as ComponentMeta<typeof Slider>;

const SliderStory: ComponentStory<typeof Slider> = (args): ReactElement => {
    const [value, setValue] = useState(0);

    const onChange = (e: ChangeEvent): void => {
        const { value } = e.target as HTMLInputElement;
        setValue(parseFloat(value));
    };

    const onSliderReset = (id: string, val: number): void => {
        setValue(val);
    };

    return <Slider {...{ ...args, value, onChange, onSliderReset }} />;
};

export const Default = SliderStory.bind({});
