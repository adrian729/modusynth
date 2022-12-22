import { FC } from 'react';

import classNames from 'classnames';
import { Props } from 'src/types/core';

type ListAlignment = 'horizontal' | undefined;

interface ListProps extends Props {
    alignment?: ListAlignment;
}
const List: FC<ListProps> = ({ children, alignment }) => {
    return <ul className={classNames('list', alignment)}>{children}</ul>;
};

export default List;
