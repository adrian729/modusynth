import { ReactElement } from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';
import TestingBox from 'src/components/99_testUtils/testingBox';

import Box, { BoxProps } from './Box';

const args: BoxProps = {};
export default {
    args,
    component: Box,
    title: 'components/01_core/Box',
} as ComponentMeta<typeof Box>;

const BoxStory: ComponentStory<typeof Box> = (args): ReactElement => (
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
