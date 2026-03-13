/**
 * @author Cursor
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HeaderCard from './HeaderCard';

const mockIcon = { src: '/test-icon.png', height: 30, width: 30 };

describe('HeaderCard', () => {
  it('renders text and formatted number', () => {
    render(
      <HeaderCard text="2026 Cap Space" num={50_000_000} icon={mockIcon as any} />
    );
    expect(screen.getByText('2026 Cap Space')).toBeInTheDocument();
    expect(screen.getByText('$50,000,000.00')).toBeInTheDocument();
  });

  it('renders an image with the icon src', () => {
    render(
      <HeaderCard text="Test" num={0} icon={mockIcon as any} />
    );
    const img = document.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img?.getAttribute('alt')).toBe('Money Icon');
  });

  it('applies border by default', () => {
    const { container } = render(
      <HeaderCard text="Test" num={0} icon={mockIcon as any} />
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('border');
  });

  it('omits border when bordered is false', () => {
    const { container } = render(
      <HeaderCard text="Test" num={0} icon={mockIcon as any} bordered={false} />
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).not.toContain('border');
  });
});
