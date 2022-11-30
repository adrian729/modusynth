import { Context, useContext } from 'react';

const useSafeContext = <T>(context: Context<T>) => {
    const value = useContext(context);
    if (value === undefined) {
        const contextName = context.displayName || 'Context';
        throw new Error(
            `${contextName} must be used inside of ${contextName}.Provider`,
        );
    }

    return value!;
};

export default useSafeContext;
