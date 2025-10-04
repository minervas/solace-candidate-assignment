import React from 'react';

interface StringListProps {
  items: string[];
  maxVisible?: number;
  emptyMessage?: string;
  className?: string;
}

// NOTE
// I'm taking Claude's className suggestions
// here as I am not proficient in TailwindCSS

export function StringList({
  items,
  maxVisible,
  emptyMessage = 'None',
  className = '',
}: StringListProps) {
  if (!items || items.length === 0) {
    return <span className="text-gray-400 italic">{emptyMessage}</span>;
  }

  const visibleItems = maxVisible !== undefined ? items.slice(0, maxVisible) : items;
  const remainingCount = maxVisible !== undefined && items.length > maxVisible ? items.length - maxVisible : 0;

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {visibleItems.map((item, index) => (
        <span
          key={index}
          className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
        >
          {item}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
          +{remainingCount}
        </span>
      )}
    </div>
  );
}
