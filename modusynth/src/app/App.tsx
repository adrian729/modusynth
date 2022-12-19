import OscillatorsPanel from 'src/components/OscillatorsPanel';

import DroneController from '../components/DroneController';
import Keyboard from '../components/Keyboard/Keyboard';
import './App.scss';

const App = () => {
    return (
        <div className="App">
            <h1>ModuSynth</h1>
            <Keyboard />
            <DroneController />
            <OscillatorsPanel />
        </div>
    );
};

export default App;
