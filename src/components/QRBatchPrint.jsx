import React, { useState } from 'react';
import QRCode from 'qrcode.react';

/**
 * QR Batch Print Component
 * Print multiple QR codes in a grid layout
 */
function QRBatchPrint({ chemicals, onClose }) {
    const [gridSize, setGridSize] = useState('4x6'); // 4 columns, 6 rows = 24 per page

    const handlePrint = () => {
        window.print();
    };

    const gridConfig = {
        '3x4': { cols: 3, rows: 4 },
        '4x6': { cols: 4, rows: 6 },
        '2x3': { cols: 2, rows: 3 }
    };

    const config = gridConfig[gridSize];

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                maxWidth: '1200px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                padding: '2rem'
            }}>
                {/* Header */}
                <div className="no-print" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    borderBottom: '2px solid var(--border-light)',
                    paddingBottom: '1rem'
                }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>QR Code Batch Print</h2>
                        <p style={{ margin: '0.5rem 0 0', color: 'var(--text-secondary)' }}>
                            {chemicals.length} chemical{chemicals.length !== 1 ? 's' : ''} selected
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <select
                            value={gridSize}
                            onChange={(e) => setGridSize(e.target.value)}
                            className="form-select"
                            style={{ width: 'auto' }}
                        >
                            <option value="2x3">2×3 Grid (6 per page)</option>
                            <option value="3x4">3×4 Grid (12 per page)</option>
                            <option value="4x6">4×6 Grid (24 per page)</option>
                        </select>
                        <button className="btn btn-primary" onClick={handlePrint}>
                            🖨️ Print
                        </button>
                        <button className="btn btn-outline-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>

                {/* QR Code Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
                    gap: '1.5rem',
                    padding: '1rem'
                }}>
                    {chemicals.map((chemical, index) => (
                        <div key={chemical.id || index} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '1rem',
                            border: '1px solid var(--border-light)',
                            borderRadius: '8px',
                            breakInside: 'avoid',
                            pageBreakInside: 'avoid'
                        }}>
                            <QRCode
                                value={`${window.location.origin}/chemical/${encodeURIComponent(chemical.id)}`}
                                size={150}
                                level="H"
                                includeMargin={true}
                            />
                            <div style={{
                                marginTop: '0.75rem',
                                textAlign: 'center',
                                fontSize: '0.875rem',
                                fontWeight: 600
                            }}>
                                {chemical.name}
                            </div>
                            <div style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-secondary)',
                                marginTop: '0.25rem'
                            }}>
                                CAS: {chemical.casNumber || chemical.CAS || 'N/A'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default QRBatchPrint;
