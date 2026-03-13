/**
 * @author Cursor
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PositionGroupHeader from './PositionGroupHeader';

describe('PositionGroupHeader', () => {
  it('renders position group name with "s" appended when not Summary', () => {
    render(<PositionGroupHeader posGroup="Major League" />);
    expect(screen.getByText('Major Leagues')).toBeInTheDocument();
  });

  it('renders "Dead Cap Hit" as "Dead Cap Hits"', () => {
    render(<PositionGroupHeader posGroup="Dead Cap Hit" />);
    expect(screen.getByText('Dead Cap Hits')).toBeInTheDocument();
  });

  it('does not append "s" for Summary', () => {
    render(<PositionGroupHeader posGroup="Summary" />);
    expect(screen.getByText('Summary')).toBeInTheDocument();
  });

  it('does not append "s" for Positional Summary', () => {
    render(<PositionGroupHeader posGroup="Positional Summary" />);
    expect(screen.getByText('Positional Summary')).toBeInTheDocument();
  });

  it('renders as h2 with expected classes', () => {
    const { container } = render(<PositionGroupHeader posGroup="Minor League" />);
    const h2 = container.querySelector('h2');
    expect(h2).toBeInTheDocument();
    expect(h2?.className).toContain('text-xl');
    expect(screen.getByText('Minor Leagues')).toBeInTheDocument();
  });
});
