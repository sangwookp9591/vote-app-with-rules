import { render, screen } from '@testing-library/react';

describe('Sample Test', () => {
  it('renders hello world', () => {
    render(<div>Hello World</div>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
