import { ReactElement } from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Provider } from 'react-redux';
import store from 'src/App/store';

import Freezer from './Freezer';

export default {
    component: Freezer,
    title: 'components/Freezer',
} as ComponentMeta<typeof Freezer>;

const FreezerStory: ComponentStory<typeof Freezer> = (): ReactElement => (
    <Provider store={store}>
        <Freezer />
    </Provider>
);

export const Default = FreezerStory.bind({});
