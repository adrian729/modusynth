import { FC } from 'react';

import classNames from 'classnames';
import Container, {
    ContainerProps,
} from 'src/components/common/layouts/container/Container';

import './styles.scss';

export interface BoxProps extends ContainerProps {}
const Box: FC<BoxProps> = ({ className, ...props }) => {
    return <Container className={classNames('box', className)} {...props} />;
};

export default Box;
