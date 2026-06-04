import { ChangeEvent, ReactElement, useState } from 'react';

import { Meta, StoryFn } from '@storybook/react';

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
} as Meta<typeof Slider>;

const SliderStory: StoryFn<typeof Slider> = (args): ReactElement => {
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

export const TitleBottom = SliderStory.bind({});
TitleBottom.args = {
    ...args,
    titlePosition: 'bottom',
};

export const NoTitle = SliderStory.bind({});
NoTitle.args = {
    ...args,
    titlePosition: 'none',
};
