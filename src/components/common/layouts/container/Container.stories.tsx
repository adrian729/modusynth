import { ReactElement } from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';
import TestingBox from 'src/components/testUtils/testingBox';

import Container, { ContainerProps } from './Container';

const args: ContainerProps = {};
export default {
    args,
    component: Container,
    title: 'components/00_layouts/Container',
} as ComponentMeta<typeof Container>;

const ContainerStory: ComponentStory<typeof Container> = (
    args,
): ReactElement => (
    <Container {...args} className="testborder">
        <TestingBox />
        <TestingBox />
        <TestingBox />
        <TestingBox />
    </Container>
);

export const Default = ContainerStory.bind({});

export const CenterContent = ContainerStory.bind({});
CenterContent.args = {
    ...args,
    alignContent: 'center-content',
};
