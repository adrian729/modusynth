import { FC, HTMLAttributes } from 'react';

import classNames from 'classnames';
import { Props } from 'src/types/core';

import './styles.scss';

export type AlignContent = 'center-content' | undefined;
export interface ContainerProps extends Props, HTMLAttributes<HTMLDivElement> {
    alignContent?: AlignContent;
}
const Container: FC<ContainerProps> = ({
    children,
    alignContent,
    className,
    ...props
}) => {
    return (
        <div
            className={classNames('container', alignContent, className)}
            {...props}
        >
            {children}
        </div>
    );
};

export default Container;
