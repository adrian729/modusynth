import { FC } from 'react';

import { Props } from 'src/types/core';

const Section: FC<Props> = ({ children }) => {
    return <section className="section">{children}</section>;
};

export default Section;
