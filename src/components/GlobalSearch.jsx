import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChemicals } from '../hooks/useChemicals';

const GlobalSearch = ({ show, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const { chemicals } = useChemicals();

    useEffect(() => {
        if (show && inputRef.current) {
            inputRef.current.focus();
        }
    }, [show]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const searchTerm = query.toLowerCase();
        const filtered = chemicals.filter(chem => {
            const name = (chem.name || chem['Chemical Name'] || '').toLowerCase();
            const cas = (chem.CAS || chem.casNumber || '').toLowerCase();
            const formula = (chem.formula || chem.Formula || '').toLowerCase();
            const category = (chem.category || '').toLowerCase();

            return name.includes(searchTerm) ||
                cas.includes(searchTerm) ||
                formula.includes(searchTerm) ||
                category.includes(searchTerm);
        }).slice(0, 8);

        setResults(filtered);
        setSelectedIndex(0);
    }, [query, chemicals]);

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        } else if (e.key === 'Enter' && results.length > 0) {
            e.preventDefault();
            handleSelect(results[selectedIndex]);
        }
    };

    const handleSelect = (chemical) => {
        const id = chemical.CAS || chemical.id || chemical['Chemical Name'] || chemical.name;
        navigate(`/chemicals/${encodeURIComponent(id)}`);
        onClose();
        setQuery('');
    };

    if (!show) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 9998,
                    backdropFilter: 'blur(4px)'
                }}
            />

            {/* Search Modal */}
            <div style={{
                position: 'fixed',
                top: '20%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '90%',
                maxWidth: '600px',
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                zIndex: 9999,
                overflow: 'hidden'
            }}>
                {/* Search Input */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--text-secondary)">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search chemicals by name, CAS, formula..."
                            style={{
                                flex: 1,
                                border: 'none',
                                outline: 'none',
                                fontSize: '1.125rem',
                                backgroundColor: 'transparent',
                                color: 'var(--text-primary)'
                            }}
                        />
                        <kbd style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            color: 'var(--text-tertiary)'
                        }}>
                            ESC
                        </kbd>
                    </div>
                </div>

                {/* Results */}
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {results.length === 0 && query ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            No results found for "{query}"
                        </div>
                    ) : results.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                            Start typing to search...
                        </div>
                    ) : (
                        results.map((chem, index) => (
                            <div
                                key={chem.id || index}
                                onClick={() => handleSelect(chem)}
                                style={{
                                    padding: '1rem 1.5rem',
                                    cursor: 'pointer',
                                    backgroundColor: index === selectedIndex ? 'var(--primary-light)' : 'transparent',
                                    borderLeft: index === selectedIndex ? '3px solid var(--primary)' : '3px solid transparent',
                                    transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                    {chem.name || chem['Chemical Name']}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    {chem.CAS || chem.casNumber} • {chem.formula || chem.Formula}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Hints */}
                {results.length > 0 && (
                    <div style={{
                        padding: '0.75rem 1.5rem',
                        borderTop: '1px solid var(--border-light)',
                        display: 'flex',
                        gap: '1rem',
                        fontSize: '0.75rem',
                        color: 'var(--text-tertiary)'
                    }}>
                        <span><kbd>↑↓</kbd> Navigate</span>
                        <span><kbd>Enter</kbd> Select</span>
                        <span><kbd>ESC</kbd> Close</span>
                    </div>
                )}
            </div>
        </>
    );
};

export default GlobalSearch;
