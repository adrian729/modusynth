import { FC } from 'react';

import { Props } from 'src/types/core';

const ListItem: FC<Props> = ({ children }) => {
    return <li>{children}</li>;
};

export default ListItem;
