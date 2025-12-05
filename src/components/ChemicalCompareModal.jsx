import React from 'react';
import TagBadge from './TagBadge';
import { generateComparisonPDF } from '../utils/generatePDF';

const ChemicalCompareModal = ({ show, onClose, chemicals = [] }) => {
    if (!show) return null;

    const handleExportPDF = () => {
        generateComparisonPDF(chemicals);
    };

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-xl modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Compare Chemicals ({chemicals.length})</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {chemicals.length === 0 ? (
                            <div className="text-center py-5">
                                <p className="lead text-muted">No chemicals selected.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped align-middle">
                                    <thead>
                                        <tr>
                                            <th style={{ minWidth: '150px', position: 'sticky', left: 0, background: 'white', zIndex: 1 }}>Property</th>
                                            {chemicals.map((chem) => (
                                                <th key={chem.id} style={{ minWidth: '220px' }}>
                                                    {chem.name}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Image Row */}
                                        <tr>
                                            <td className="fw-bold" style={{ position: 'sticky', left: 0, background: 'white' }}>Image</td>
                                            {chemicals.map((chem) => (
                                                <td key={chem.id} className="text-center">
                                                    <div style={{
                                                        width: '100px',
                                                        height: '100px',
                                                        margin: '0 auto',
                                                        backgroundColor: '#f8f9fa',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        overflow: 'hidden'
                                                    }}>
                                                        {chem.image ? (
                                                            <img
                                                                src={chem.image}
                                                                alt={chem.name}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                            />
                                                        ) : (
                                                            <span style={{ fontSize: '2rem', opacity: 0.3 }}>🧪</span>
                                                        )}
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>

                                        {/* Basic Info */}
                                        <tr>
                                            <td className="fw-bold" style={{ position: 'sticky', left: 0, background: 'white' }}>Formula</td>
                                            {chemicals.map((chem) => <td key={chem.id}>{chem.formula || '-'}</td>)}
                                        </tr>
                                        <tr>
                                            <td className="fw-bold" style={{ position: 'sticky', left: 0, background: 'white' }}>CAS</td>
                                            {chemicals.map((chem) => <td key={chem.id}>{chem.casNumber || chem.CAS || '-'}</td>)}
                                        </tr>
                                        <tr>
                                            <td className="fw-bold" style={{ position: 'sticky', left: 0, background: 'white' }}>Molecular Weight</td>
                                            {chemicals.map((chem) => <td key={chem.id}>{chem.molecularWeight ? `${chem.molecularWeight} g/mol` : '-'}</td>)}
                                        </tr>

                                        {/* Physical Properties */}
                                        <tr>
                                            <td className="fw-bold" style={{ position: 'sticky', left: 0, background: 'white' }}>Density</td>
                                            {chemicals.map((chem) => <td key={chem.id}>{chem.density || '-'}</td>)}
                                        </tr>
                                        <tr>
                                            <td className="fw-bold" style={{ position: 'sticky', left: 0, background: 'white' }}>Melting Point</td>
                                            {chemicals.map((chem) => <td key={chem.id}>{chem.meltingPoint || '-'}</td>)}
                                        </tr>
                                        <tr>
                                            <td className="fw-bold" style={{ position: 'sticky', left: 0, background: 'white' }}>Boiling Point</td>
                                            {chemicals.map((chem) => <td key={chem.id}>{chem.boilingPoint || '-'}</td>)}
                                        </tr>

                                        {/* Hazards */}
                                        <tr>
                                            <td className="fw-bold" style={{ position: 'sticky', left: 0, background: 'white' }}>Hazards</td>
                                            {chemicals.map((chem) => (
                                                <td key={chem.id}>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                                        {chem.hazards && chem.hazards.length > 0 ? (
                                                            chem.hazards.map((h, i) => (
                                                                <TagBadge key={i} label={h} type={h} size="sm" />
                                                            ))
                                                        ) : (
                                                            <span className="text-muted">-</span>
                                                        )}
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>

                                        {/* Inventory */}
                                        <tr>
                                            <td className="fw-bold" style={{ position: 'sticky', left: 0, background: 'white' }}>Inventory</td>
                                            {chemicals.map((chem) => (
                                                <td key={chem.id}>
                                                    {chem.inventory ? (
                                                        <div>
                                                            <div><strong>Qty:</strong> {chem.inventory.quantity} {chem.inventory.unit}</div>
                                                            <div className="text-muted small">{chem.inventory.location}</div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted">Not tracked</span>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={handleExportPDF}>
                            📄 Export as PDF
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChemicalCompareModal;
