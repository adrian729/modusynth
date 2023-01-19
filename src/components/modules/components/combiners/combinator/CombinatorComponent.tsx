import { Children, FC, ReactNode, isValidElement, useEffect } from 'react';

import _ from 'lodash';
import { useAppDispatch } from 'src/app/hooks';
import {
    CombinatorModule,
    addModule,
    getModule,
    removeModule,
} from 'src/reducers/synthesisSlice';
import { Props } from 'src/types/core';

import useCombinator from './hooks/useCombinator';

interface CombinatorProps extends Props {
    moduleId: string;
}
const CombinatorComponent: FC<CombinatorProps> = ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    moduleId,
    children,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
}) => {
    const dispatch = useAppDispatch();
    const module = getModule(moduleId) as CombinatorModule;
    const childModuleIds = getChildModuleIds(children);

    useCombinator({ moduleId });

    useEffect(() => {
        if (!module) {
            dispatch(
                addModule({
                    id: moduleId,
                    childModuleIds,
                } as CombinatorModule),
            );
        }
        return () => {
            removeModule(moduleId);
        };
    }, []);

    return (
        <div>
            <h1>CombinatorComponent: {moduleId}</h1>
            {module ? <div>{children}</div> : null}
        </div>
    );
};

export default CombinatorComponent;

const getChildModuleIds = (children: ReactNode): string[] => {
    const childModuleIds: string[] = [];
    Children.forEach(children, (elem) => {
        if (isValidElement(elem) && elem.props.moduleId !== undefined) {
            childModuleIds.push(elem.props.moduleId);
        }
    });
    return childModuleIds;
};
