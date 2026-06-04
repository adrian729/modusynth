import { ReactElement } from 'react';

import { Meta, StoryFn } from '@storybook/react';
import Box from 'src/components/testUtils/testingBox';

import List, { ListProps } from './List';

const args: ListProps = {};
export default {
    args,
    component: List,
    title: 'components/00_layouts/List',
} as Meta<typeof List>;

const ListStory: StoryFn<typeof List> = (args): ReactElement => (
    <List {...args}>
        <Box />
        <Box />
        <Box />
        <Box />
    </List>
);

export const Default = ListStory.bind({});

export const Column = ListStory.bind({});
Column.args = {
    ...args,
    direction: 'column',
};

export const Row = ListStory.bind({});
Row.args = {
    ...args,
    direction: 'row',
};

export const Center = ListStory.bind({});
Center.args = {
    ...args,
    alignment: 'center',
};

export const RowCenter = ListStory.bind({});
RowCenter.args = {
    ...args,
    direction: 'row',
    alignment: 'center',
};
