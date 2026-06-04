import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import ReactDOM from 'react-dom/client';

import App from './app/App';
import './styles/tailwind.css';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);

root.render(
    // <React.StrictMode>
    <App />,
    // </React.StrictMode>
);
