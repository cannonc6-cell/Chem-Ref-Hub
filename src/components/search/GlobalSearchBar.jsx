import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';

/**
 * GlobalSearchBar Component
 * Search input with autocomplete dropdown
 */
function GlobalSearchBar({ onResultClick }) {
    const { search, searchQuery, searchResults, isSearching, clearSearch, recentSearches } = useSearch();
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    // Update search as user types
    useEffect(() => {
        if (inputValue.trim()) {
            search(inputValue);
            setIsOpen(true);
        } else {
            clearSearch();
            setIsOpen(false);
        }
    }, [inputValue, search, clearSearch]);

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        const results = searchResults.slice(0, 5);

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && results[selectedIndex]) {
                handleResultClick(results[selectedIndex]);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    };

    // Handle result click
    const handleResultClick = (result) => {
        const item = result.item;
        if (item.type === 'chemical') {
            navigate(`/chemicals/${encodeURIComponent(item.id)}`);
        } else if (item.type === 'logbook') {
            navigate('/logbook');
        }

        setInputValue('');
        setIsOpen(false);
        onResultClick?.();
    };

    // Handle recent search click
    const handleRecentClick = (query) => {
        setInputValue(query);
        inputRef.current?.focus();
    };

    // Highlight matching text
    const highlightText = (text, matches) => {
        if (!matches || !text) return text;

        // Simple highlighting - just bold the matched portions
        return <span dangerouslySetInnerHTML={{ __html: text }} />;
    };

    const resultsToShow = inputValue.trim() ? searchResults.slice(0, 5) : [];
    const showRecent = !inputValue.trim() && recentSearches.length > 0 && isOpen;

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
                <div style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(100, 116, 139, 0.5)',
                    pointerEvents: 'none'
                }}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search chemicals, logbook... (Ctrl+K)"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    style={{
                        width: '100%',
                        padding: '0.625rem 2.5rem 0.625rem 2.5rem',
                        borderRadius: '8px',
                        border: '2px solid var(--border-medium)',
                        fontSize: '0.9375rem',
                        outline: 'none',
                        transition: 'all 0.2s',
                        backgroundColor: 'white'
                    }}
                    onFocusCapture={(e) => {
                        e.target.style.borderColor = 'var(--purple)';
                        e.target.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.15)';
                    }}
                    onBlurCapture={(e) => {
                        e.target.style.borderColor = 'var(--border-medium)';
                        e.target.style.boxShadow = 'none';
                    }}
                />
                {inputValue && (
                    <button
                        onClick={() => {
                            setInputValue('');
                            clearSearch();
                        }}
                        style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-tertiary)',
                            padding: '4px'
                        }}
                    >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && (resultsToShow.length > 0 || showRecent) && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    border: '1px solid var(--border-light)',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    zIndex: 1000
                }}>
                    {/* Recent Searches */}
                    {showRecent && (
                        <div>
                            <div style={{
                                padding: '8px 16px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: 'var(--text-tertiary)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Recent Searches
                            </div>
                            {recentSearches.slice(0, 5).map((query, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => handleRecentClick(query)}
                                    style={{
                                        padding: '12px 16px',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid var(--border-light)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--text-tertiary)' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{query}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Search Results */}
                    {resultsToShow.length > 0 && (
                        <div>
                            {resultsToShow.map((result, idx) => {
                                const item = result.item;
                                const isSelected = idx === selectedIndex;

                                return (
                                    <div
                                        key={idx}
                                        onClick={() => handleResultClick(result)}
                                        style={{
                                            padding: '12px 16px',
                                            cursor: 'pointer',
                                            borderBottom: idx < resultsToShow.length - 1 ? '1px solid var(--border-light)' : 'none',
                                            backgroundColor: isSelected ? 'var(--bg-secondary)' : 'transparent',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                                        onMouseLeave={(e) => {
                                            if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '8px',
                                                backgroundColor: item.type === 'chemical' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(249, 115, 22, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: item.type === 'chemical' ? 'var(--purple)' : 'var(--coral)',
                                                fontSize: '1rem'
                                            }}>
                                                {item.type === 'chemical' ? '🧪' : '📋'}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                                    {item.name}
                                                </div>
                                                {item.formula && (
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                                                        {item.formula}
                                                    </div>
                                                )}
                                                {item.type === 'logbook' && item.action && (
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                        {item.action}
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                                {item.type === 'chemical' ? 'Chemical' : 'Logbook'}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Loading State */}
                    {isSearching && (
                        <div style={{
                            padding: '16px',
                            textAlign: 'center',
                            color: 'var(--text-secondary)',
                            fontSize: '0.875rem'
                        }}>
                            Searching...
                        </div>
                    )}

                    {/* No Results */}
                    {!isSearching && inputValue.trim() && resultsToShow.length === 0 && (
                        <div style={{
                            padding: '24px 16px',
                            textAlign: 'center',
                            color: 'var(--text-tertiary)',
                            fontSize: '0.875rem'
                        }}>
                            No results found for "{inputValue}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default GlobalSearchBar;
