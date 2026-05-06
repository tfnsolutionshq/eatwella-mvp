import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export const useSearch = (initialSearchTerm = '') => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    async (term) => {
      if (!term.trim()) {
        setSearchResults([]);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const response = await api.get(`/menus?search=${encodeURIComponent(term.trim())}`);
        const data = response.data?.data || response.data || [];
        setSearchResults(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search items');
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Debounce timer
  useEffect(() => {
    const timerId = setTimeout(() => {
      debouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchTerm, debouncedSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
    setError(null);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  return {
    searchTerm,
    searchResults,
    isLoading,
    error,
    handleSearchChange,
    clearSearch,
    setSearchTerm
  };
};
