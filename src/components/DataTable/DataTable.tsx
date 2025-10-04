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
    <div className={`overflow-x-auto rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {/* let the user know when no data is available */}
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length}
                className="px-6 py-8 text-center text-sm text-gray-500 italic"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={getRowKey(row)} className="hover:bg-gray-50 transition-colors">
                {columns.map((column, colIndex) => {
                  return (
                    // colIndex should be fine for a key here since columns are static and won't change
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
