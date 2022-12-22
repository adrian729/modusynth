import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App/App';
import store from './App/store';
import { MainAudioContextProvider } from './context/MainAudioContext';
import reportWebVitals from './reportWebVitals';
import './styles/index.scss';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);

root.render(
    // <React.StrictMode>
    <Provider store={store}>
        <MainAudioContextProvider>
            <App />
        </MainAudioContextProvider>
    </Provider>,
    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

// eslint-disable-next-line no-console
reportWebVitals(console.log);
