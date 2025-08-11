import { render, screen } from '@testing-library/react';
import App from './App';

test('renders AI Chat heading', () => {
  render(<App />);
  expect(screen.getByText(/AI Chat/i)).toBeInTheDocument();
});
