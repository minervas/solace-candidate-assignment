import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StringList } from './StringList';

describe('StringList', () => {
  describe('Empty State', () => {
    it('displays empty message when items array is empty', () => {
      render(<StringList items={[]} />);
      expect(screen.getByText('None')).toBeInTheDocument();
    });

    it('displays custom empty message', () => {
      render(<StringList items={[]} emptyMessage="No items available" />);
      expect(screen.getByText('No items available')).toBeInTheDocument();
    });

    it('displays empty message for null/undefined items', () => {
      render(<StringList items={null as any} />);
      expect(screen.getByText('None')).toBeInTheDocument();
    });
  });

  describe('Rendering', () => {
    it('renders items as tags', () => {
      const items = ['React', 'TypeScript', 'Node.js'];
      render(<StringList items={items} />);

      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
    });

    it('applies tag styling classes', () => {
      const items = ['Tag1'];
      const { container } = render(<StringList items={items} />);
      
      const tag = screen.getByText('Tag1');
      expect(tag).toHaveClass('px-2', 'py-1', 'text-xs', 'bg-blue-100');
    });

    it('limits visible items when maxVisible is set', () => {
      const items = ['Item1', 'Item2', 'Item3', 'Item4', 'Item5'];
      render(<StringList items={items} maxVisible={3} />);

      expect(screen.getByText('Item1')).toBeInTheDocument();
      expect(screen.getByText('Item2')).toBeInTheDocument();
      expect(screen.getByText('Item3')).toBeInTheDocument();
      expect(screen.queryByText('Item4')).not.toBeInTheDocument();
      expect(screen.queryByText('Item5')).not.toBeInTheDocument();
    });

    it('shows remaining count when items exceed maxVisible', () => {
      const items = ['Item1', 'Item2', 'Item3', 'Item4', 'Item5'];
      render(<StringList items={items} maxVisible={3} />);

      expect(screen.getByText('+2')).toBeInTheDocument();
    });

    it('does not show remaining count when all items are visible', () => {
      const items = ['Item1', 'Item2', 'Item3'];
      render(<StringList items={items} maxVisible={3} />);

      expect(screen.queryByText('+0')).not.toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      const items = ['Test'];
      const { container } = render(
        <StringList items={items} className="custom-class" />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('custom-class');
    });
  });

  describe('Edge Cases', () => {
    it('handles items with special characters', () => {
      const items = ['C++', 'C#', 'F#', '.NET'];
      render(<StringList items={items} />);

      expect(screen.getByText('C++')).toBeInTheDocument();
      expect(screen.getByText('C#')).toBeInTheDocument();
      expect(screen.getByText('.NET')).toBeInTheDocument();
    });

    it('handles very long item names', () => {
      const items = ['This is a very long specialty name that might wrap'];
      render(<StringList items={items} />);

      expect(screen.getByText('This is a very long specialty name that might wrap')).toBeInTheDocument();
    });

    it('handles maxVisible = 0', () => {
      const items = ['Item1', 'Item2'];
      render(<StringList items={items} maxVisible={0} />);

      expect(screen.queryByText('Item1')).not.toBeInTheDocument();
      expect(screen.getByText('+2')).toBeInTheDocument();
    });

    it('handles maxVisible greater than items length', () => {
      const items = ['Item1', 'Item2'];
      render(<StringList items={items} maxVisible={10} />);

      expect(screen.getByText('Item1')).toBeInTheDocument();
      expect(screen.getByText('Item2')).toBeInTheDocument();
      expect(screen.queryByText(/\+\d+/)).not.toBeInTheDocument();
    });

    it('handles array with empty strings', () => {
      const items = ['Valid', '', 'Another'];
      render(<StringList items={items} />);

      expect(screen.getByText('Valid')).toBeInTheDocument();
      expect(screen.getByText('Another')).toBeInTheDocument();
    });
  });

  describe('Realistic Use Cases', () => {
    it('renders legal specialties', () => {
      const specialties = ['Family Law', 'Estate Planning', 'Real Estate'];
      render(<StringList items={specialties} />);

      specialties.forEach(specialty => {
        expect(screen.getByText(specialty)).toBeInTheDocument();
      });
    });

    it('renders programming skills with limit', () => {
      const skills = ['JavaScript', 'Python', 'Java', 'C++', 'Go', 'Rust'];
      render(<StringList items={skills} maxVisible={4} />);

      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('Python')).toBeInTheDocument();
      expect(screen.getByText('Java')).toBeInTheDocument();
      expect(screen.getByText('C++')).toBeInTheDocument();
      expect(screen.getByText('+2')).toBeInTheDocument();
    });
  });
});
