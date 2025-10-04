import React from 'react';

// Advocate is { id: number; firstName: string; lastName: string; city: string; degree: string; specialties: string[]; yearsOfExperience: number; phoneNumber: number; createdAt: string; }
// T is Advocate[]
export interface Column<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowKey: (row: T) => string | number;
  className?: string;
}

export function DataTable<T>({ data, columns, getRowKey, className = '' }: DataTableProps<T>) {
  return (
    <div className={className}>
      <table>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* let the user know when no data is available */}
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                No data available
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={getRowKey(row)}>
                {columns.map((column, colIndex) => {
                  return (
                    // colIndex should be fine for a key here since columns are static and won't change
                    <td key={colIndex} >
                      {column.cell(row)}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
