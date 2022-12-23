import { ButtonHTMLAttributes, FC } from 'react';

import classNames from 'classnames';

import './styles.scss';

type ButtonKind = 'active' | 'warning' | undefined;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    title: string;
    buttonKind?: ButtonKind;
}

const Button: FC<ButtonProps> = ({
    title,
    buttonKind,
    className,
    ...props
}: ButtonProps) => {
    return (
        <button
            className={classNames('button', buttonKind, className)}
            {...props}
        >
            {title}
        </button>
    );
};

export default Button;
