import React from 'react';
import { useCompare } from '../hooks/useCompare';
import '../styles/modern.css';

function CompareModal({ show, onClose }) {
    const { compareList, removeFromCompare, clearCompare } = useCompare();

    if (!show) return null;

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-xl modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Compare Chemicals</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {compareList.length === 0 ? (
                            <div className="text-center py-5">
                                <p className="lead text-muted">No chemicals selected for comparison.</p>
                                <button className="btn btn-primary" onClick={onClose}>Browse Chemicals</button>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped align-middle">
                                    <thead>
                                        <tr>
                                            <th style={{ minWidth: '150px' }}>Property</th>
                                            {compareList.map((chem) => (
                                                <th key={chem.id} style={{ minWidth: '200px' }}>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span>{chem.name}</span>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger ms-2"
                                                            onClick={() => removeFromCompare(chem.id)}
                                                            aria-label="Remove"
                                                        >
                                                            &times;
                                                        </button>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="fw-bold">Image</td>
                                            {compareList.map((chem) => (
                                                <td key={chem.id} className="text-center">
                                                    <img
                                                        src={chem.image}
                                                        alt={chem.name}
                                                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                                                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/assets/logo.svg'; }}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">Formula</td>
                                            {compareList.map((chem) => (
                                                <td key={chem.id}>{chem.formula}</td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">CAS</td>
                                            {compareList.map((chem) => (
                                                <td key={chem.id}>{chem.CAS}</td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">Molar Mass</td>
                                            {compareList.map((chem) => (
                                                <td key={chem.id}>{chem.properties?.molarMass || '-'}</td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">Density</td>
                                            {compareList.map((chem) => (
                                                <td key={chem.id}>{chem.properties?.density || '-'}</td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">Melting Point</td>
                                            {compareList.map((chem) => (
                                                <td key={chem.id}>{chem.properties?.meltingPoint || '-'}</td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">Boiling Point</td>
                                            {compareList.map((chem) => (
                                                <td key={chem.id}>{chem.properties?.boilingPoint || '-'}</td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        {compareList.length > 0 && (
                            <button className="btn btn-outline-danger me-auto" onClick={clearCompare}>Clear All</button>
                        )}
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompareModal;
