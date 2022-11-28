import './App.scss';
import Keyboard from './components/Keyboard';
import Osc from './components/Osc';
import DroneController from './components/DroneController';

const App = () => {
    return (
        <div className='App'>
            <h1>ModuSynth</h1>
            <Keyboard />
            <DroneController />
            <div
                style={{
                    margin: '2rem auto',
                    border: '1px solid black',
                    borderRadius: '1rem',
                    width: '80%',
                    maxWidth: '800px',
                    display: 'grid',
                    gridTemplateColumns: '50% 50%',
                }}>
                <div style={{ margin: 'auto' }}>
                    <Osc />
                </div>
                <div style={{ margin: 'auto' }}>
                    <Osc type='triangle' />
                </div>
                <div style={{ margin: 'auto' }}>
                    <Osc type='square' />
                </div>
                <div style={{ margin: 'auto' }}>
                    <Osc type='square' mute={true} />
                </div>
            </div>
        </div>
    );
};

export default App;
