import React from 'react';

function QRCodeModal({ show, onClose, chemical, url }) {
    if (!show || !chemical) return null;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-sm modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">QR Code</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body text-center">
                        <img
                            src={qrUrl}
                            alt={`QR Code for ${chemical.name}`}
                            className="img-fluid mb-3"
                            style={{ border: '1px solid var(--border-light)', padding: '10px', borderRadius: '8px' }}
                        />
                        <h6 className="mb-1">{chemical.name}</h6>
                        <p className="text-muted small mb-0">{chemical.CAS}</p>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button className="btn btn-primary btn-sm" onClick={() => window.print()}>Print Label</button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QRCodeModal;
