import { useState } from 'react';

import { CTX } from 'src/context/MainAudioContext';
import useSafeContext from 'src/hooks/useSafeContext';

import DroneController from '../../components/DroneController';
import Keyboard from '../../components/keyboard/Keyboard';
import Osc from '../../components/oscillator/Osc';
import './App.scss';

const App = () => {
    const { addOscillator } = useSafeContext(CTX);
    const [oscList, setOscList] = useState<any[]>([<Osc key={0} />]);

    const addOsc = () => {
        setOscList(oscList.concat(<Osc key={oscList.length} />));
        addOscillator(oscList.length + 1);
    };

    return (
        <div className="App">
            <h1>ModuSynth</h1>
            <Keyboard />
            <DroneController />
            <button id="addOsc" onClick={addOsc}>
                Add oscillator
            </button>
            <div
                style={{
                    margin: '2rem auto',
                    border: '1px solid black',
                    borderRadius: '1rem',
                    width: '80%',
                    maxWidth: '800px',
                    display: 'grid',
                    gridTemplateColumns: '50% 50%',
                }}
            >
                {oscList}
            </div>
        </div>
    );
};

export default App;
