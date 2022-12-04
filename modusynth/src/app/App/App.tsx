import { useState } from 'react';

import DroneController from '../../components/DroneController';
import Keyboard from '../../components/keyboard/Keyboard';
import Osc from '../../components/oscillator/Osc';
import './App.scss';

const App = () => {
    const [oscList, setOscList] = useState<any[]>([]);

    const addOsc = () => {
        setOscList(oscList.concat(<Osc />));
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
                <Osc />
                {oscList}
            </div>
        </div>
    );
};

export default App;
