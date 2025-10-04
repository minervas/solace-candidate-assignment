import { ChangeEvent, useState } from "react";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  onReset: () => void;
}

export function SearchBar({ onSearch, onReset }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleReset = () => {
    setSearchTerm("");
    onSearch("");
    onReset();
  };

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
        Search
      </label>
      <div className="flex gap-2 mb-3">
        <input
          id="search-input"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search advocates..."
          value={searchTerm}
          onChange={handleChange}
        />
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          Reset
        </button>
      </div>
      {searchTerm && (
        <p className="text-sm text-gray-600">
          Searching for: <span className="font-semibold text-gray-900">{searchTerm}</span>
        </p>
      )}
    </div>
  );
}
