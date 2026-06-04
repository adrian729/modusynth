import { FC, HTMLAttributes } from 'react';

import classNames from 'classnames';
import { Props } from 'src/types/core';

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
            className={classNames(
                'px-8 py-4 [&>*]:mb-8 [&>*:last-child]:mb-0',
                alignContent === 'center-content' &&
                    'flex flex-col flex-nowrap items-center justify-center',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default Container;
