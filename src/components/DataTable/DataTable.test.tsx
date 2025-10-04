import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { DataTable, Column } from './DataTable';
import { Advocate } from '@/db/schema';

describe('DataTable', () => {
  describe('Basic Rendering', () => {
    it('renders table with headers', () => {
      const columns: Column<Advocate>[] = [
        { header: 'First Name', cell: (row) => row.firstName },
        { header: 'City', cell: (row) => row.city },
      ];
      const data: Advocate[] = [];

      render(<DataTable data={data} columns={columns} getRowKey={(row) => row.id} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('City')).toBeInTheDocument();
    });

    it('renders correct number of column headers', () => {
      const columns: Column<Advocate>[] = [
        { header: 'First Name', cell: (row) => row.firstName },
        { header: 'City', cell: (row) => row.city },
        { header: 'Degree', cell: (row) => row.degree },
      ];
      const data: Advocate[] = [];

      render(<DataTable data={data} columns={columns} getRowKey={(row) => row.id} />);

      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(3);
    });

    it('applies custom className to wrapper div', () => {
      const columns: Column<Advocate>[] = [
        { header: 'First Name', cell: (row) => row.firstName },
      ];
      const data: Advocate[] = [];

      const { container } = render(
        <DataTable
          data={data}
          columns={columns}
          getRowKey={(row) => row.id}
          className="custom-table-wrapper"
        />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('custom-table-wrapper');
    });
  });

  describe('Empty State', () => {
    it('displays "No data available" when data array is empty', () => {
      const columns: Column<Advocate>[] = [
        { header: 'First Name', cell: (row) => row.firstName },
        { header: 'City', cell: (row) => row.city },
      ];
      const data: Advocate[] = [];

      render(<DataTable data={data} columns={columns} getRowKey={(row) => row.id} />);

      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('empty state spans all columns', () => {
      const columns: Column<Advocate>[] = [
        { header: 'First Name', cell: (row) => row.firstName },
        { header: 'City', cell: (row) => row.city },
        { header: 'Degree', cell: (row) => row.degree },
      ];
      const data: Advocate[] = [];

      render(<DataTable data={data} columns={columns} getRowKey={(row) => row.id} />);

      const emptyCell = screen.getByText('No data available').closest('td');
      expect(emptyCell).toHaveAttribute('colSpan', '3');
    });
  });

  describe('Data Rendering', () => {
    it('renders all rows of data', () => {
      const columns: Column<Advocate>[] = [
        { header: 'First Name', cell: (row) => row.firstName },
        { header: 'City', cell: (row) => row.city },
      ];
      const data: Advocate[] = [
        { id: 1, firstName: 'John', lastName: 'Doe', city: 'Boston', degree: 'JD', specialties: ['Family Law'], yearsOfExperience: 10, phoneNumber: 1234567890, createdAt: null },
        { id: 2, firstName: 'Jane', lastName: 'Smith', city: 'New York', degree: 'JD', specialties: ['Corporate'], yearsOfExperience: 5, phoneNumber: 1234567891, createdAt: null },
        { id: 3, firstName: 'Bob', lastName: 'Johnson', city: 'Chicago', degree: 'JD', specialties: ['Criminal'], yearsOfExperience: 15, phoneNumber: 1234567892, createdAt: null },
      ];

      render(<DataTable data={data} columns={columns} getRowKey={(row) => row.id} />);

      const rows = screen.getAllByRole('row');
      // +1 for header row
      expect(rows).toHaveLength(data.length + 1);
    });

    it('renders cell data correctly', () => {
      const columns: Column<Advocate>[] = [
        { header: 'First Name', cell: (row) => row.firstName },
        { header: 'City', cell: (row) => row.city },
      ];
      const data: Advocate[] = [
        { id: 1, firstName: 'John', lastName: 'Doe', city: 'Boston', degree: 'JD', specialties: ['Family Law'], yearsOfExperience: 10, phoneNumber: 1234567890, createdAt: null },
      ];

      render(<DataTable data={data} columns={columns} getRowKey={(row) => row.id} />);

      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Boston')).toBeInTheDocument();
    });

    it('uses getRowKey for row keys', () => {
      const columns: Column<Advocate>[] = [
        { header: 'First Name', cell: (row) => row.firstName },
      ];
      const data: Advocate[] = [
        { id: 1, firstName: 'John', lastName: 'Doe', city: 'Boston', degree: 'JD', specialties: ['Family Law'], yearsOfExperience: 10, phoneNumber: 1234567890, createdAt: null },
        { id: 2, firstName: 'Jane', lastName: 'Smith', city: 'New York', degree: 'JD', specialties: ['Corporate'], yearsOfExperience: 5, phoneNumber: 1234567891, createdAt: null },
      ];

      const { container } = render(
        <DataTable data={data} columns={columns} getRowKey={(row) => row.id} />
      );

      const rows = container.querySelectorAll('tbody tr');
      expect(rows).toHaveLength(2);
      expect(rows[0]).toBeInTheDocument();
      expect(rows[1]).toBeInTheDocument();
    });
  });

  describe('Custom Cell Rendering', () => {
    it('supports custom cell rendering functions', () => {
      const columns: Column<Advocate>[] = [
        {
          header: 'First Name',
          cell: (row) => <strong>{row.firstName.toUpperCase()}</strong>,
        },
      ];
      const data: Advocate[] = [
        { id: 1, firstName: 'John', lastName: 'Doe', city: 'Boston', degree: 'JD', specialties: ['Family Law'], yearsOfExperience: 10, phoneNumber: 1234567890, createdAt: null },
      ];

      render(<DataTable data={data} columns={columns} getRowKey={(row) => row.id} />);

      const strongElement = screen.getByText('JOHN');
      expect(strongElement.tagName).toBe('STRONG');
    });

    it('supports complex cell rendering with multiple elements', () => {
      const columns: Column<Advocate>[] = [
        {
          header: 'Advocate Details',
          cell: (row) => (
            <div>
              <span>{row.firstName} {row.lastName}</span>
              <span> - {row.degree}</span>
            </div>
          ),
        },
      ];
      const data: Advocate[] = [
        { id: 1, firstName: 'John', lastName: 'Doe', city: 'Boston', degree: 'JD', specialties: ['Family Law'], yearsOfExperience: 10, phoneNumber: 1234567890, createdAt: null },
      ];

      render(<DataTable data={data} columns={columns} getRowKey={(row) => row.id} />);

      expect(screen.getByText('John Doe', { exact: false })).toBeInTheDocument();
      expect(screen.getByText('- JD', { exact: false })).toBeInTheDocument();
    });

    it('renders numeric values correctly', () => {
      const columns: Column<Advocate>[] = [
        { header: 'Years of Experience', cell: (row) => row.yearsOfExperience },
      ];
      const data: Advocate[] = [
        { id: 1, firstName: 'John', lastName: 'Doe', city: 'Boston', degree: 'JD', specialties: ['Family Law'], yearsOfExperience: 15, phoneNumber: 1234567890, createdAt: null },
      ];

      render(<DataTable data={data} columns={columns} getRowKey={(row) => row.id} />);

      expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('renders array values correctly', () => {
      const columns: Column<Advocate>[] = [
        {
          header: 'Specialties',
          cell: (row) => row.specialties.join(', '),
        },
      ];
      const data: Advocate[] = [
        { id: 1, firstName: 'John', lastName: 'Doe', city: 'Boston', degree: 'JD', specialties: ['Family Law', 'Estate Planning'], yearsOfExperience: 10, phoneNumber: 1234567890, createdAt: null },
        { id: 2, firstName: 'Jane', lastName: 'Smith', city: 'New York', degree: 'JD', specialties: ['Corporate'], yearsOfExperience: 5, phoneNumber: 1234567891, createdAt: null },
      ];

      render(<DataTable data={data} columns={columns} getRowKey={(row) => row.id} />);

      expect(screen.getByText('Family Law, Estate Planning')).toBeInTheDocument();
      expect(screen.getByText('Corporate')).toBeInTheDocument();
    });
  });

  describe('Multiple Columns', () => {
    it('renders multiple columns with correct data', () => {
      const columns: Column<Advocate>[] = [
        { header: 'ID', cell: (row) => row.id },
        { header: 'First Name', cell: (row) => row.firstName },
        { header: 'City', cell: (row) => row.city },
        { header: 'Years of Experience', cell: (row) => row.yearsOfExperience },
      ];
      const data: Advocate[] = [
        { id: 1, firstName: 'John', lastName: 'Doe', city: 'Boston', degree: 'JD', specialties: ['Family Law'], yearsOfExperience: 10, phoneNumber: 1234567890, createdAt: null },
      ];

      render(<DataTable data={data} columns={columns} getRowKey={(row) => row.id} />);

      // Check headers
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('City')).toBeInTheDocument();
      expect(screen.getByText('Years of Experience')).toBeInTheDocument();

      // Check data
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Boston')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('renders correct number of cells per row', () => {
      const columns: Column<Advocate>[] = [
        { header: 'First Name', cell: (row) => row.firstName },
        { header: 'City', cell: (row) => row.city },
        { header: 'Degree', cell: (row) => row.degree },
      ];
      const data: Advocate[] = [
        { id: 1, firstName: 'John', lastName: 'Doe', city: 'Boston', degree: 'JD', specialties: ['Family Law'], yearsOfExperience: 10, phoneNumber: 1234567890, createdAt: null },
      ];

      render(<DataTable data={data} columns={columns} getRowKey={(row) => row.id} />);

      const rows = screen.getAllByRole('row');
      const dataRow = rows[1]; // Skip header row
      const cells = within(dataRow).getAllByRole('cell');

      expect(cells).toHaveLength(3);
    });
  });

  describe('Large Datasets', () => {
    it('handles large datasets efficiently', () => {
      const columns: Column<Advocate>[] = [
        { header: 'First Name', cell: (row) => row.firstName },
        { header: 'City', cell: (row) => row.city },
      ];
      const data: Advocate[] = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        firstName: `Advocate${i + 1}`,
        lastName: `Lastname${i + 1}`,
        city: `City${i + 1}`,
        degree: 'JD',
        specialties: ['General Practice'],
        yearsOfExperience: 1 + (i % 30),
        phoneNumber: 1234567890 + i,
        createdAt: null,
      }));

      render(<DataTable data={data} columns={columns} getRowKey={(row) => row.id} />);

      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(101); // 100 data rows + 1 header row
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string values', () => {
      const columns: Column<Advocate>[] = [
        { header: 'City', cell: (row) => row.city || 'N/A' },
      ];
      const data: Advocate[] = [
        { id: 1, firstName: 'John', lastName: 'Doe', city: '', degree: 'JD', specialties: [], yearsOfExperience: 10, phoneNumber: 1234567890, createdAt: null },
      ];

      render(<DataTable data={data} columns={columns} getRowKey={(row) => row.id} />);

      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('handles null/undefined values gracefully', () => {
      interface NullableAdvocate extends Omit<Advocate, 'createdAt'> {
        createdAt: Date | null | undefined;
      }

      const columns: Column<NullableAdvocate>[] = [
        { header: 'Created At', cell: (row) => row.createdAt?.toISOString() ?? 'Unknown' },
      ];
      const data: NullableAdvocate[] = [
        { id: 1, firstName: 'John', lastName: 'Doe', city: 'Boston', degree: 'JD', specialties: [], yearsOfExperience: 10, phoneNumber: 1234567890, createdAt: null },
      ];

      render(<DataTable data={data} columns={columns} getRowKey={(row) => row.id} />);

      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });

    it('handles numeric IDs as keys', () => {
      const columns: Column<Advocate>[] = [
        { header: 'First Name', cell: (row) => row.firstName },
      ];
      const data: Advocate[] = [
        { id: 123, firstName: 'John', lastName: 'Doe', city: 'Boston', degree: 'JD', specialties: [], yearsOfExperience: 10, phoneNumber: 1234567890, createdAt: null },
      ];

      const { container } = render(
        <DataTable data={data} columns={columns} getRowKey={(row) => row.id} />
      );

      expect(container.querySelector('tbody tr')).toBeInTheDocument();
    });

    it('handles alternative key selectors', () => {
      const columns: Column<Advocate>[] = [
        { header: 'First Name', cell: (row) => row.firstName },
      ];
      const data: Advocate[] = [
        { id: 1, firstName: 'John', lastName: 'Doe', city: 'Boston', degree: 'JD', specialties: [], yearsOfExperience: 10, phoneNumber: 1234567890, createdAt: null },
      ];

      const { container } = render(
        <DataTable data={data} columns={columns} getRowKey={(row) => `advocate-${row.id}`} />
      );

      expect(container.querySelector('tbody tr')).toBeInTheDocument();
    });
  });

  describe('Type Safety', () => {
    it('works with complex nested properties', () => {
      const columns: Column<Advocate>[] = [
        {
          header: 'Full Name',
          cell: (row) => `${row.firstName} ${row.lastName}`,
        },
        {
          header: 'Location & Degree',
          cell: (row) => `${row.city} - ${row.degree}`,
        },
        {
          header: 'Specialties Count',
          cell: (row) => row.specialties.length,
        },
      ];
      const data: Advocate[] = [
        {
          id: 1,
          firstName: 'Sarah',
          lastName: 'Williams',
          city: 'Seattle',
          degree: 'JD',
          specialties: ['Immigration', 'International Law', 'Human Rights'],
          yearsOfExperience: 12,
          phoneNumber: 2065551234,
          createdAt: null,
        },
      ];

      render(<DataTable data={data} columns={columns} getRowKey={(row) => row.id} />);

      expect(screen.getByText('Sarah Williams')).toBeInTheDocument();
      expect(screen.getByText('Seattle - JD')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });
});
