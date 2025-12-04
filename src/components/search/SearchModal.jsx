import React, { useEffect, useState } from 'react';
import GlobalSearchBar from './GlobalSearchBar';
import { useSearch } from '../../context/SearchContext';

/**
 * SearchModal Component
 * Full-screen search modal with keyboard shortcut (Cmd/Ctrl + K)
 */
function SearchModal({ isOpen, onClose }) {
    const { clearRecentSearches, recentSearches } = useSearch();
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    // Handle escape key to close
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingTop: '10vh',
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(4px)'
            }}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: '90%',
                    maxWidth: '650px',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    overflow: 'hidden',
                    animation: 'slideIn 0.2s ease-out'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            Search Everything
                        </h2>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Find chemicals, logbook entries, and more
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-tertiary)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                            e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--text-tertiary)';
                        }}
                    >
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Search Bar */}
                <div style={{ padding: '1.5rem' }}>
                    <GlobalSearchBar onResultClick={onClose} />
                </div>

                {/* Footer with keyboard shortcuts */}
                <div style={{
                    padding: '1rem 1.5rem',
                    backgroundColor: 'var(--bg-secondary)',
                    borderTop: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            <kbd style={{
                                padding: '2px 6px',
                                backgroundColor: 'white',
                                border: '1px solid var(--border-medium)',
                                borderRadius: '4px',
                                fontFamily: 'monospace',
                                fontSize: '0.75rem'
                            }}>↑↓</kbd>
                            Navigate
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            <kbd style={{
                                padding: '2px 6px',
                                backgroundColor: 'white',
                                border: '1px solid var(--border-medium)',
                                borderRadius: '4px',
                                fontFamily: 'monospace',
                                fontSize: '0.75rem'
                            }}>Enter</kbd>
                            Select
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            <kbd style={{
                                padding: '2px 6px',
                                backgroundColor: 'white',
                                border: '1px solid var(--border-medium)',
                                borderRadius: '4px',
                                fontFamily: 'monospace',
                                fontSize: '0.75rem'
                            }}>Esc</kbd>
                            Close
                        </div>
                    </div>

                    {recentSearches.length > 0 && (
                        <button
                            onClick={() => {
                                if (showClearConfirm) {
                                    clearRecentSearches();
                                    setShowClearConfirm(false);
                                } else {
                                    setShowClearConfirm(true);
                                    setTimeout(() => setShowClearConfirm(false), 3000);
                                }
                            }}
                            style={{
                                padding: '4px 8px',
                                fontSize: '0.75rem',
                                backgroundColor: showClearConfirm ? 'var(--danger)' : 'transparent',
                                color: showClearConfirm ? 'white' : 'var(--text-tertiary)',
                                border: showClearConfirm ? 'none' : '1px solid var(--border-medium)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {showClearConfirm ? 'Click again to confirm' : 'Clear history'}
                        </button>
                    )}
                </div>
            </div>

            <style>
                {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
            </style>
        </div>
    );
}

export default SearchModal;
