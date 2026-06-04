import { ButtonHTMLAttributes, FC } from 'react';

import classNames from 'classnames';

type ButtonKind = 'active' | 'warning' | undefined;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    title: string;
    buttonKind?: ButtonKind;
}

const Button: FC<ButtonProps> = ({
    title,
    buttonKind,
    className,
    children,
    ...props
}: ButtonProps) => {
    return (
        <button
            className={classNames('button', buttonKind, className)}
            {...props}
        >
            {children ?? title}
        </button>
    );
};

export default Button;
