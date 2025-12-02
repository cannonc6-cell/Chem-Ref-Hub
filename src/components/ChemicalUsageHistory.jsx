import React, { useState, useEffect } from 'react';

function ChemicalUsageHistory({ chemicalId }) {
    const [logs, setLogs] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newLog, setNewLog] = useState({
        action: 'Used', // Used, Restocked, Disposed
        quantity: '',
        unit: 'g',
        notes: '',
        user: 'Current User' // Placeholder for user system
    });

    useEffect(() => {
        loadLogs();
    }, [chemicalId]);

    const loadLogs = () => {
        const allLogs = JSON.parse(localStorage.getItem('chemical_usage_logs') || '[]');
        const chemLogs = allLogs.filter(log => log.chemicalId === chemicalId);
        // Sort by date desc
        chemLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLogs(chemLogs);
    };

    const handleAddLog = (e) => {
        e.preventDefault();
        if (!newLog.quantity) return;

        const logEntry = {
            id: Date.now().toString(),
            chemicalId,
            date: new Date().toISOString(),
            ...newLog,
            quantity: parseFloat(newLog.quantity)
        };

        const allLogs = JSON.parse(localStorage.getItem('chemical_usage_logs') || '[]');
        const updatedLogs = [...allLogs, logEntry];
        localStorage.setItem('chemical_usage_logs', JSON.stringify(updatedLogs));

        // Update chemical inventory quantity
        // This requires updating the main chemical list which is separate. 
        // For now, we'll just log it. In a real app, this would be a transaction.
        updateChemicalInventory(chemicalId, newLog.action, parseFloat(newLog.quantity));

        setLogs([logEntry, ...logs]);
        setShowAddModal(false);
        setNewLog({ ...newLog, quantity: '', notes: '' });
    };

    const updateChemicalInventory = (id, action, qty) => {
        const chemicals = JSON.parse(localStorage.getItem('chemicals') || '[]');
        const index = chemicals.findIndex(c => c.id === id);
        if (index !== -1) {
            const chem = chemicals[index];
            if (!chem.inventory) chem.inventory = { quantity: 0, unit: 'g' };

            if (action === 'Used' || action === 'Disposed') {
                chem.inventory.quantity = Math.max(0, (chem.inventory.quantity || 0) - qty);
            } else if (action === 'Restocked') {
                chem.inventory.quantity = (chem.inventory.quantity || 0) + qty;
            }

            chemicals[index] = chem;
            localStorage.setItem('chemicals', JSON.stringify(chemicals));
            // Dispatch event to notify other components
            window.dispatchEvent(new Event('storage'));
        }
    };

    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h5 mb-0">Usage History</h3>
                <button className="btn btn-sm btn-outline-primary" onClick={() => setShowAddModal(true)}>
                    + Log Usage
                </button>
            </div>

            {logs.length === 0 ? (
                <p className="text-muted small">No usage history recorded.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-sm table-hover">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Action</th>
                                <th>Quantity</th>
                                <th>User</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id}>
                                    <td>{new Date(log.date).toLocaleDateString()} {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                    <td>
                                        <span className={`badge ${log.action === 'Restocked' ? 'bg-success' : log.action === 'Disposed' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td>{log.quantity} {log.unit}</td>
                                    <td>{log.user}</td>
                                    <td className="text-muted small">{log.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showAddModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Log Chemical Usage</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                            </div>
                            <form onSubmit={handleAddLog}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Action</label>
                                        <select
                                            className="form-select"
                                            value={newLog.action}
                                            onChange={(e) => setNewLog({ ...newLog, action: e.target.value })}
                                        >
                                            <option value="Used">Used</option>
                                            <option value="Restocked">Restocked</option>
                                            <option value="Disposed">Disposed</option>
                                        </select>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-8">
                                            <label className="form-label">Quantity</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={newLog.quantity}
                                                onChange={(e) => setNewLog({ ...newLog, quantity: e.target.value })}
                                                required
                                                step="any"
                                            />
                                        </div>
                                        <div className="col-4">
                                            <label className="form-label">Unit</label>
                                            <select
                                                className="form-select"
                                                value={newLog.unit}
                                                onChange={(e) => setNewLog({ ...newLog, unit: e.target.value })}
                                            >
                                                <option value="g">g</option>
                                                <option value="kg">kg</option>
                                                <option value="mL">mL</option>
                                                <option value="L">L</option>
                                                <option value="mg">mg</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Notes</label>
                                        <textarea
                                            className="form-control"
                                            rows="2"
                                            value={newLog.notes}
                                            onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Save Log</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChemicalUsageHistory;
