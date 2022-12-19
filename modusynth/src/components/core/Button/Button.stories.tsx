import { ComponentMeta, ComponentStory } from '@storybook/react';

import '../../../App/App.scss';
import '../../../index.scss';
import Button, { ButtonProps } from './Button';
import './Button.scss';

const args: ButtonProps = {
    title: 'Button',
};

export default {
    args,
    component: Button,
    title: 'core/Button',
} as ComponentMeta<typeof Button>;

const ButtonStory: ComponentStory<typeof Button> = (args) => (
    <Button {...args} />
);

// Button Kind
export const Default = ButtonStory.bind({});
export const Active = ButtonStory.bind({});
Active.args = {
    ...args,
    buttonKind: 'active',
};
export const Warning = ButtonStory.bind({});
Warning.args = {
    ...args,
    buttonKind: 'warning',
};

// Text length
export const ShortText = ButtonStory.bind({});
ShortText.args = {
    ...args,
    title: 'S',
};
export const LongText = ButtonStory.bind({});
LongText.args = {
    ...args,
    title: 'Lorem ipsum dolor sit amet',
};
