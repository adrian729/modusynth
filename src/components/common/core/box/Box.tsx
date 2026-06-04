import { FC } from 'react';

import classNames from 'classnames';
import Container, {
    ContainerProps,
} from 'src/components/common/layouts/container/Container';

export type BoxProps = ContainerProps;
const Box: FC<BoxProps> = ({ className, ...props }) => {
    return (
        <Container
            className={classNames(
                'rounded-lg border border-border bg-panel shadow-panel',
                className,
            )}
            {...props}
        />
    );
};

export default Box;
