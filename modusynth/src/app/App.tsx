import OscillatorsPanel from 'src/components/oscillatorsPanel';

import Freezer from '../components/freezer';
import Keyboard from '../components/keyboard';
import './App.scss';

const App = () => {
    return (
        <div className="App">
            <h1>ModuSynth</h1>
            <Keyboard />
            <Freezer />
            <OscillatorsPanel />
        </div>
    );
};

export default App;
