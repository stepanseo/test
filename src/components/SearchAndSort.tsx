'use client';

import { useState } from 'react';

type Props = {
  onSearch: (query: string) => void;
  onSort: (order: 'desc' | 'asc') => void;
};

export default function SearchAndSort({ onSearch, onSort }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <input
        type="search"
        placeholder="Search posts..."
        value={searchQuery}
        onChange={handleSearch}
        className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        onChange={(e) => onSort(e.target.value as 'desc' | 'asc')}
        className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="desc">Newest First</option>
        <option value="asc">Oldest First</option>
      </select>
    </div>
  );
}