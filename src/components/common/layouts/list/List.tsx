import { Children, FC, HTMLAttributes } from 'react';

import classNames from 'classnames';
import { Props } from 'src/types/core';

import ListItem from './listItem';
import './styles.scss';

export type ListDirection = 'column' | 'row';
export type ListAlignment = 'center' | undefined;

export interface ListProps extends Props, HTMLAttributes<HTMLUListElement> {
    direction?: ListDirection;
    alignment?: ListAlignment;
}
const List: FC<ListProps> = ({
    children,
    direction,
    alignment,
    className,
    ...props
}) => {
    const arrayChildren = Children.toArray(children);

    return (
        <ul
            className={classNames('list', direction, alignment, className)}
            {...props}
        >
            {arrayChildren.map((child, index) => (
                <ListItem key={index}>{child}</ListItem>
            ))}
        </ul>
    );
};

export default List;
