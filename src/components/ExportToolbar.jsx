import React, { useState } from 'react';
import { exportChemicalsToCSV } from '../utils/exportCSV';

/**
 * Export Toolbar Component
 * Provides export options for chemicals and logbook data
 */
function ExportToolbar({ data, type = 'chemicals', onExport }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleCSVExport = () => {
        if (type === 'chemicals') {
            exportChemicalsToCSV(data);
        }
        setIsOpen(false);
        if (onExport) onExport('csv');
    };

    const handlePrintView = () => {
        window.print();
        setIsOpen(false);
        if (onExport) onExport('print');
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
                className="btn btn-outline-primary"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px'
                }}
            >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
                <svg
                    width="12"
                    height="12"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    style={{
                        transition: 'transform 0.2s',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        onClick={() => setIsOpen(false)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 999
                        }}
                    />

                    {/* Dropdown Menu */}
                    <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 0.5rem)',
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid var(--border-light)',
                        borderRadius: '8px',
                        boxShadow: 'var(--shadow-lg)',
                        minWidth: '200px',
                        zIndex: 1000,
                        overflow: 'hidden'
                    }}>
                        {/* CSV Export */}
                        <button
                            onClick={handleCSVExport}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: 'none',
                                background: 'transparent',
                                textAlign: 'left',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                transition: 'background-color 0.15s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-soft)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Export as CSV</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    Open in Excel or Google Sheets
                                </div>
                            </div>
                        </button>

                        {/* Divider */}
                        <div style={{ height: '1px', backgroundColor: 'var(--border-light)' }} />

                        {/* Print View */}
                        <button
                            onClick={handlePrintView}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: 'none',
                                background: 'transparent',
                                textAlign: 'left',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                transition: 'background-color 0.15s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-soft)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            <div>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Print View</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    Print current page
                                </div>
                            </div>
                        </button>

                        {/* Info footer */}
                        <div style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--bg-soft)',
                            borderTop: '1px solid var(--border-light)',
                            fontSize: '0.75rem',
                            color: 'var(--text-tertiary)'
                        }}>
                            Exporting {data?.length || 0} {type}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default ExportToolbar;
