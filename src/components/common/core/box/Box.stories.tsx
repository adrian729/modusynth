import { ReactElement } from 'react';

import { Meta, StoryFn } from '@storybook/react';
import TestingBox from 'src/components/testUtils/testingBox';

import Box, { BoxProps } from './Box';

const args: BoxProps = {};
export default {
    args,
    component: Box,
    title: 'components/01_core/Box',
} as Meta<typeof Box>;

const BoxStory: StoryFn<typeof Box> = (args): ReactElement => (
    <Box {...args}>
        <TestingBox />
        <TestingBox />
        <TestingBox />
        <TestingBox />
    </Box>
);

export const Default = BoxStory.bind({});

export const CenterContent = BoxStory.bind({});
CenterContent.args = {
    ...args,
    alignContent: 'center-content',
};
