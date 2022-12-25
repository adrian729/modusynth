import { ReactElement } from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import Button, { ButtonProps } from './Button';

const args: ButtonProps = {
    title: 'Button',
};

export default {
    args,
    component: Button,
    title: 'components/01_core/Button',
} as ComponentMeta<typeof Button>;

const ButtonStory: ComponentStory<typeof Button> = (args): ReactElement => (
    <Button {...args} />
);

// Button Kind
export const Default = ButtonStory.bind({});
export const Active = ButtonStory.bind({});
Active.args = {
    buttonKind: 'active',
};
export const Warning = ButtonStory.bind({});
Warning.args = {
    buttonKind: 'warning',
};

// Text length
export const ShortText = ButtonStory.bind({});
ShortText.args = {
    title: 'S',
};
export const LongText = ButtonStory.bind({});
LongText.args = {
    title: 'Lorem ipsum dolor sit amet',
};
