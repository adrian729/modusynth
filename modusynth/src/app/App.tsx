import { useState } from 'react';

import Button from 'src/components/core/Button';

import DroneController from '../components/DroneController';
import Keyboard from '../components/Keyboard/Keyboard';
import Oscillator from '../components/Oscillator';
import './App.scss';

const App = () => {
    const [oscList, setOscList] = useState<any[]>([
        <Oscillator key={0} mute={false} />,
    ]);

    const addOsc = () => {
        setOscList(oscList.concat(<Oscillator key={oscList.length} />));
    };

    return (
        <div className="App">
            <h1>ModuSynth</h1>
            <Keyboard />
            <DroneController />
            <div
                style={{
                    margin: '2rem auto',
                    backgroundColor: 'var(--slate-color-200)',
                    borderRadius: '1rem',
                    boxShadow:
                        '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
                    width: '80%',
                    maxWidth: '1200px',
                    position: 'relative',
                }}
            >
                <Button id="addOsc" title="Add Oscillator" onClick={addOsc} />
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '30% 30% 30%',
                        justifyContent: 'space-evenly',
                    }}
                >
                    {oscList}
                </div>
            </div>
        </div>
    );
};

export default App;
