import {
    Children,
    FC,
    ReactNode,
    isValidElement,
    useEffect,
    useState,
} from 'react';

import _ from 'lodash';
import { useAppDispatch } from 'src/app/hooks';
import {
    CombinatorModule,
    addModule,
    getModule,
    removeModule,
    updateModule,
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
    const [isSetup, setIsSetup] = useState<boolean>(false);

    useCombinator({ moduleId });

    const getChildModuleIds = (children: ReactNode): string[] => {
        const childModuleIds: string[] = [];
        Children.forEach(children, (elem) => {
            if (isValidElement(elem) && elem.props.moduleId !== undefined) {
                childModuleIds.push(elem.props.moduleId);
            }
        });
        return childModuleIds;
    };

    useEffect(() => {
        if (!module) {
            dispatch(
                addModule({
                    id: moduleId,
                    childModuleIds: getChildModuleIds(children),
                } as CombinatorModule),
            );
            setIsSetup(true);
        }
        return () => {
            removeModule(moduleId);
        };
    }, []);

    useEffect(() => {
        if (module) {
            dispatch(
                updateModule({
                    ...module,
                    childModuleIds: getChildModuleIds(children),
                } as CombinatorModule),
            );
        }
        return () => {
            removeModule(moduleId);
        };
    }, [children]);

    return (
        <div>
            <h1>CombinatorComponent: {moduleId}</h1>
            {isSetup ? <div>{children}</div> : null}
        </div>
    );
};

export default CombinatorComponent;
