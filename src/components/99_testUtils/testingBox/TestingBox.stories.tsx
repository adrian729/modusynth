import { ReactElement } from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import TestingBox from './TestingBox';

export default {
    component: TestingBox,
    title: 'testUtils/TestingBox',
} as ComponentMeta<typeof TestingBox>;

const TestingBoxStory: ComponentStory<typeof TestingBox> = (): ReactElement => (
    <TestingBox />
);

// Button Kind
export const Default = TestingBoxStory.bind({});
