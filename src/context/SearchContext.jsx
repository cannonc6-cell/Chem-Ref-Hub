import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Fuse from 'fuse.js';

const SearchContext = createContext();

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within SearchProvider');
    }
    return context;
};

export function SearchProvider({ children }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchIndex, setSearchIndex] = useState(null);

    // Load recent searches from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('recentSearches');
            if (saved) {
                setRecentSearches(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Error loading recent searches:', error);
        }
    }, []);

    // Save recent searches to localStorage
    const saveRecentSearch = useCallback((query) => {
        if (!query.trim()) return;

        setRecentSearches(prev => {
            // Remove duplicates and add to front
            const updated = [query, ...prev.filter(q => q !== query)].slice(0, 10);
            localStorage.setItem('recentSearches', JSON.stringify(updated));
            return updated;
        });
    }, []);

    // Clear recent searches
    const clearRecentSearches = useCallback(() => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    }, []);

    // Build search index from all data
    const buildSearchIndex = useCallback((chemicals, logbook) => {
        const searchData = [];

        // Add chemicals to search index
        if (Array.isArray(chemicals)) {
            chemicals.forEach(chem => {
                searchData.push({
                    type: 'chemical',
                    id: chem.id,
                    name: chem.name || '',
                    formula: chem.formula || '',
                    casNumber: chem.casNumber || '',
                    description: chem.description || '',
                    tags: Array.isArray(chem.tags) ? chem.tags.join(' ') : '',
                    hazards: Array.isArray(chem.hazards) ? chem.hazards.join(' ') : '',
                    data: chem
                });
            });
        }

        // Add logbook entries to search index
        if (Array.isArray(logbook)) {
            logbook.forEach(entry => {
                searchData.push({
                    type: 'logbook',
                    id: entry.id,
                    name: entry.chemicalName || entry.chemical || '',
                    action: entry.action || '',
                    notes: entry.notes || '',
                    date: entry.date || '',
                    data: entry
                });
            });
        }

        // Create Fuse instance with search options
        const fuse = new Fuse(searchData, {
            keys: [
                { name: 'name', weight: 2 },
                { name: 'formula', weight: 1.5 },
                { name: 'casNumber', weight: 1.5 },
                { name: 'description', weight: 1 },
                { name: 'tags', weight: 1.2 },
                { name: 'hazards', weight: 1 },
                { name: 'action', weight: 1 },
                { name: 'notes', weight: 0.8 }
            ],
            threshold: 0.4,
            includeScore: true,
            includeMatches: true,
            minMatchCharLength: 2
        });

        setSearchIndex(fuse);
    }, []);

    // Perform search
    const search = useCallback((query) => {
        setSearchQuery(query);

        if (!query.trim() || !searchIndex) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);

        try {
            const results = searchIndex.search(query);
            setSearchResults(results);
            saveRecentSearch(query);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, [searchIndex, saveRecentSearch]);

    // Clear search
    const clearSearch = useCallback(() => {
        setSearchQuery('');
        setSearchResults([]);
    }, []);

    const value = {
        searchQuery,
        searchResults,
        recentSearches,
        isSearching,
        search,
        clearSearch,
        buildSearchIndex,
        clearRecentSearches
    };

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
}
