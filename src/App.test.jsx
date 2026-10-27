import { render, screen } from '@testing-library/react';
import HomePage from './components/pages/HomePage';

test('renders Spiele Zone heading', () => {
  render(<HomePage />);
  const headingElement = screen.getByRole('heading', { name: /Spiele Zone/i });
  expect(headingElement).toBeInTheDocument();
});
