import { ReactElement } from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Provider } from 'react-redux';
import store from 'src/app/store';

import Keyboard from './Keyboard';

export default {
    component: Keyboard,
    title: 'components/keyboard/Keyboard',
} as ComponentMeta<typeof Keyboard>;

const KeyboardStory: ComponentStory<typeof Keyboard> = (): ReactElement => (
    <Provider store={store}>
        <Keyboard />
    </Provider>
);

export const Default = KeyboardStory.bind({});
