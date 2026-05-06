import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchInput = ({ 
  value, 
  onChange, 
  onClear, 
  placeholder = 'Search food items...',
  isLoading = false,
  className = ''
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative">
        <FiSearch 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
        />
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-colors"
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            type="button"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
