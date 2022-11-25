import './App.scss';
import Keyboard from './components/Keyboard/Keyboard';
import Osc from './components/Osc/Osc';
import DroneController from './components/DroneController/DroneController';

const App = () => {
    return (
        <div className='App'>
            <h1>ModuSynth</h1>
            <Keyboard />
            <div
                style={{
                    margin: '2rem auto',
                    width: '80%',
                    maxWidth: '800px',
                    display: 'grid',
                    gridTemplateColumns: '50% 50%',
                }}>
                <div style={{ margin: 'auto' }}>
                    <Osc />
                </div>
                <div style={{ margin: 'auto' }}>
                    <Osc defaultType='triangle' />
                </div>
                <div style={{ margin: 'auto' }}>
                    <Osc defaultType='square' />
                </div>
                <div style={{ margin: 'auto' }}>
                    <Osc defaultType='square' defaultMute={true} />
                </div>
            </div>
            <DroneController />
        </div>
    );
};

export default App;
