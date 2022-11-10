import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};
test('Check search input data', () => {
  render(<App />);
  const searchInput = screen.getByTestId('user-search');
  fireEvent.change(searchInput, {target: {value: 'test'}})
  expect(searchInput.value).toBe('test');
});

test("Show more button test", async () => {
  const { container } = render(<App/>);
  const data = container
      .querySelector('.ant-empty-description');
  expect(data).toHaveTextContent('No data');
});
