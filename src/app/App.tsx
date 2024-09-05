import { FC } from 'react';

import { Provider } from 'react-redux';
import MainAudioComponent from 'src/components/modules/components/core/main/MainAudioComponent';
import SynthPadPanel from 'src/components/specific/synthPadPanel/SynthPadPanel';
import SynthPanel from 'src/components/specific/synthPanel/SynthPanel';
import { Props } from 'src/types/core';

import store from './store';

const App: FC<Props> = () => {
    return (
        <Provider store={store}>
            <SynthPanel />
            <SynthPadPanel />
            <MainAudioComponent />
            {/* <div>
                <canvas
                    className="oscilloscope1"
                    width="2000px"
                    height="300px"
                ></canvas>
                <canvas
                    className="oscilloscope2"
                    width="2000px"
                    height="300px"
                ></canvas>
                <canvas
                    className="oscilloscope3"
                    width="2000px"
                    height="500px"
                ></canvas>
            </div> */}
        </Provider>
    );
};

export default App;
