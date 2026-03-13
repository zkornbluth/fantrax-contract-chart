/**
 * @author Cursor
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor, within } from '@testing-library/react';
import DarkModeToggle from './DarkModeToggle';

describe('DarkModeToggle', () => {
  const matchMediaMock = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    window.matchMedia = vi.fn().mockImplementation(matchMediaMock) as unknown as typeof window.matchMedia;
  });

  it('renders a button with aria-label', () => {
    const { container } = render(<DarkModeToggle />);
    expect(within(container).getByRole('button', { name: 'Toggle dark mode' })).toBeInTheDocument();
  });

  it('becomes enabled after mount and toggles dark mode on click', async () => {
    localStorage.setItem('darkMode', 'false');
    const { container } = render(<DarkModeToggle />);

    await waitFor(() => {
      expect(within(container).getByRole('button', { name: 'Toggle dark mode' })).not.toBeDisabled();
    });

    const button = within(container).getByRole('button', { name: 'Toggle dark mode' });
    fireEvent.click(button);

    expect(localStorage.getItem('darkMode')).toBe('true');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    fireEvent.click(button);
    expect(localStorage.getItem('darkMode')).toBe('false');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
