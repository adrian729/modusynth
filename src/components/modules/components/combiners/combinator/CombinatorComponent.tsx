import { Children, FC, ReactNode, isValidElement, useEffect } from 'react';

import _ from 'lodash';
import { useAppDispatch } from 'src/app/hooks';
import {
    CombinatorModule,
    addModule,
    removeModule,
    useModule,
} from 'src/reducers/synthesisSlice';
import { Props } from 'src/types/core';

import useCombinator from './hooks/useCombinator';

interface CombinatorProps extends Props {
    moduleId: string;
}
const CombinatorComponent: FC<CombinatorProps> = ({ moduleId, children }) => {
    const dispatch = useAppDispatch();
    const module = useModule(moduleId) as CombinatorModule;
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
        <>
            {module ? (
                <div className="flex flex-row flex-wrap gap-4">{children}</div>
            ) : null}
        </>
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
