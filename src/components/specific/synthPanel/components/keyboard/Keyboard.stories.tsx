import { ReactElement } from 'react';

import { Meta, StoryFn } from '@storybook/react';
import { Provider } from 'react-redux';
import store from 'src/app/store';

import Keyboard from './Keyboard';

export default {
    component: Keyboard,
    title: 'components/keyboard/Keyboard',
} as Meta<typeof Keyboard>;

const KeyboardStory: StoryFn<typeof Keyboard> = (): ReactElement => (
    <Provider store={store}>
        <Keyboard />
    </Provider>
);

export const Default = KeyboardStory.bind({});
