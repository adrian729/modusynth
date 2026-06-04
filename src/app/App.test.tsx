import { render } from '@testing-library/react';

import App from './App';

test('renders the synth panel without crashing', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.synthPanel')).toBeInTheDocument();
});
