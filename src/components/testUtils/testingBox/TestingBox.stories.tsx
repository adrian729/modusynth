import { ReactElement } from 'react';

import { Meta, StoryFn } from '@storybook/react';

import TestingBox from './TestingBox';

export default {
    component: TestingBox,
    title: 'testUtils/TestingBox',
} as Meta<typeof TestingBox>;

const TestingBoxStory: StoryFn<typeof TestingBox> = (): ReactElement => (
    <TestingBox />
);

// Button Kind
export const Default = TestingBoxStory.bind({});
