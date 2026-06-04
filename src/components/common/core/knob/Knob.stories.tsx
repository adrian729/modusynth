import { ReactElement, useState } from 'react';

import { Meta, StoryFn } from '@storybook/react';

import Knob, { KnobProps } from './Knob';

const args: Partial<KnobProps> = {
    id: 'knob_id',
    label: 'Knob',
    updateValue: () => {},
};

export default {
    args,
    component: Knob,
    title: 'components/common/core/Knob',
} as Meta<typeof Knob>;

const KnobStory: StoryFn<typeof Knob> = (args): ReactElement => {
    const [value, setValue] = useState(0);

    const updateValue = (value: number): void => {
        setValue(value);
    };

    return (
        <div className={'testborder'} style={{ width: 'fit-content' }}>
            <Knob {...{ ...args, value, updateValue }} />
        </div>
    );
};

export const Default = KnobStory.bind({});
export const Small = KnobStory.bind({});
Small.args = {
    knobSize: 'small',
};
export const Big = KnobStory.bind({});
Big.args = {
    knobSize: 'big',
};
