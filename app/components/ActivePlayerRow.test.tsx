/**
 * @author Cursor
 */

import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import ActivePlayerRow from './ActivePlayerRow';

const defaultPlayer = {
  name: 'Test Player',
  team: 'BOS',
  pos: 'SP',
  age: 25,
  yearlyContract: [1000000, 2000000, 3000000],
};

describe('ActivePlayerRow', () => {
  it('renders player name, team, position, and age', () => {
    render(
      <table>
        <tbody>
          <ActivePlayerRow activePlayer={defaultPlayer} />
        </tbody>
      </table>
    );
    expect(screen.getByText('Test Player')).toBeInTheDocument();
    expect(screen.getByText('BOS')).toBeInTheDocument();
    expect(screen.getByText('SP')).toBeInTheDocument();
    expect(screen.getByText(25)).toBeInTheDocument();
  });

  it('renders numeric salaries as formatted currency', () => {
    const { container } = render(
      <table>
        <tbody>
          <ActivePlayerRow activePlayer={defaultPlayer} />
        </tbody>
      </table>
    );
    const row = within(container).getByRole('row');
    expect(within(row).getByText('$1,000,000')).toBeInTheDocument();
    expect(within(row).getByText('$2,000,000')).toBeInTheDocument();
    expect(within(row).getByText('$3,000,000')).toBeInTheDocument();
  });

  it('renders non-numeric salary values as-is', () => {
    const player = {
      ...defaultPlayer,
      yearlyContract: [1000000, 'N/A', 3000000],
    };
    render(
      <table>
        <tbody>
          <ActivePlayerRow activePlayer={player} />
        </tbody>
      </table>
    );
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('shows injured icon when player is injured', () => {
    const injuredPlayer = { ...defaultPlayer, injured: true };
    render(
      <table>
        <tbody>
          <ActivePlayerRow activePlayer={injuredPlayer} />
        </tbody>
      </table>
    );
    const img = document.querySelector('img[alt="Injured"]');
    expect(img).toBeInTheDocument();
  });

  it('does not show injured icon when player is not injured', () => {
    const { container } = render(
      <table>
        <tbody>
          <ActivePlayerRow activePlayer={defaultPlayer} />
        </tbody>
      </table>
    );
    const img = container.querySelector('img[alt="Injured"]');
    expect(img).not.toBeInTheDocument();
  });
});
