import './App.scss';
import Keyboard from './components/Keyboard/Keyboard';
import Osc from './components/Osc/Osc';

const App = () => {
    return (
        <div className='App'>
            <h1>ModuSynth</h1>
            <Keyboard />
            <Osc />
            <Osc defaultType='square' />
        </div>
    );
};

export default App;
