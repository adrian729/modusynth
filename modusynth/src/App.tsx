import './App.scss';
import Keyboard from './components/Keyboard/Keyboard';
import { useContext, useEffect } from 'react';
import { ActionKind, CTX } from './context/Store';

const App = () => {
    const { dispatch } = useContext(CTX);
    const initApp = () => {
        let actx = new AudioContext();
    };

    useEffect(initApp, []);

    return (
        <div className='App'>
            <h1>ModuSynth</h1>
            <Keyboard />
        </div>
    );
};

export default App;
