import { FC, useEffect, useState } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import { ModuleContextProvider } from 'src/components/modules/context/ModuleContext/ModuleContext';
import {
    EnvelopeModule,
    addModule,
    removeModule,
    useModule,
} from 'src/reducers/synthesisSlice';

import EnvelopeController from '../../core/controllers/envelopeController/EnvelopeController';

interface EnvelopeProps {
    moduleId: string;
    parentModuleId?: string;
}
const EnvelopeComponent: FC<EnvelopeProps> = ({ moduleId, parentModuleId }) => {
    const dispatch = useAppDispatch();
    const module = useModule(moduleId);

    const [isSetup, setIsSetup] = useState<boolean>(false);

    useEffect(() => {
        if (!module) {
            const initialModule: EnvelopeModule = {
                id: moduleId,
                parentModuleId,
                envelope: { attack: 0, decay: 0, sustain: 1, release: 0 },
            };
            dispatch(addModule(initialModule));
            setIsSetup(true);
        }
        return () => {
            removeModule(moduleId);
        };
    }, []);

    return (
        <ModuleContextProvider moduleId={moduleId} moduleType="envelope">
            {isSetup ? (
                <div>
                    <h5 className="mb-2 font-mono text-[0.65rem] text-text-dim">
                        {moduleId}
                    </h5>
                    <EnvelopeController />
                </div>
            ) : null}
        </ModuleContextProvider>
    );
};

export default EnvelopeComponent;
