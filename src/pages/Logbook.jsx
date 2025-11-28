import React, { useState, useEffect } from 'react';
import '../styles/modern.css';

function Logbook() {
  const [entries, setEntries] = useState(() => {
    // Load existing entries from localStorage
    try {
      return JSON.parse(localStorage.getItem('chemicalLogbook') || '[]');
    } catch {
      return [];
    }
  });

  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    chemical: '',
    quantity: '',
    action: 'used', // or 'added', 'disposed'
    notes: ''
  });
  const [alertMsg, setAlertMsg] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');

  useEffect(() => {
    document.title = 'Logbook – ChemRef Hub';
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!newEntry.chemical.trim()) {
      setAlertVariant('danger');
      setAlertMsg('Chemical name is required.');
      return;
    }
    if (!newEntry.quantity.trim()) {
      setAlertVariant('danger');
      setAlertMsg('Quantity is required.');
      return;
    }
    // optional: simple numeric-like validation (allows numbers + units)
    const entry = {
      ...newEntry,
      id: Date.now(), // unique ID for each entry
      timestamp: new Date().toISOString()
    };
    
    const updatedEntries = [entry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('chemicalLogbook', JSON.stringify(updatedEntries));
    
    // Reset form
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      chemical: '',
      quantity: '',
      action: 'used',
      notes: ''
    });
    setAlertVariant('success');
    setAlertMsg('Logbook entry added.');
  };

  return (
    <div className="app-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="section-title">Chemical Logbook</h1>
        </div>
      </div>
      {alertMsg && (
        <div className={`alert alert-${alertVariant} d-flex justify-content-between align-items-center`} role="alert">
          <span>{alertMsg}</span>
          <button type="button" className="btn-close" aria-label="Close" onClick={() => setAlertMsg('')}></button>
        </div>
      )}
      
      {/* New Entry Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title subheader-accent">New Entry</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label" htmlFor="log-date">Date</label>
                <input
                  id="log-date"
                  type="date"
                  className="form-control"
                  value={newEntry.date}
                  onChange={e => setNewEntry({...newEntry, date: e.target.value})}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label" htmlFor="log-chemical">Chemical</label>
                <input
                  id="log-chemical"
                  type="text"
                  className="form-control"
                  value={newEntry.chemical}
                  onChange={e => setNewEntry({...newEntry, chemical: e.target.value})}
                  required
                  placeholder="Chemical name"
                />
              </div>
              <div className="col-md-2">
                <label className="form-label" htmlFor="log-quantity">Quantity</label>
                <input
                  id="log-quantity"
                  type="text"
                  className="form-control"
                  value={newEntry.quantity}
                  onChange={e => setNewEntry({...newEntry, quantity: e.target.value})}
                  required
                  placeholder="Amount"
                />
              </div>
              <div className="col-md-2">
                <label className="form-label" htmlFor="log-action">Action</label>
                <select
                  id="log-action"
                  className="form-select"
                  value={newEntry.action}
                  onChange={e => setNewEntry({...newEntry, action: e.target.value})}
                  required
                >
                  <option value="used">Used</option>
                  <option value="added">Added</option>
                  <option value="disposed">Disposed</option>
                </select>
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button type="submit" className="btn btn-primary w-100">Add Entry</button>
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="log-notes">Notes</label>
                <textarea
                  id="log-notes"
                  className="form-control"
                  value={newEntry.notes}
                  onChange={e => setNewEntry({...newEntry, notes: e.target.value})}
                  placeholder="Optional notes"
                  rows="2"
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Entries List */}
      <div className="table-responsive">
        <table className="table table-striped logbook-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Chemical</th>
              <th>Quantity</th>
              <th>Action</th>
              <th>Notes</th>
              <th></th> {/* Delete column */}
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No entries yet</td>
              </tr>
            ) : (
              entries.map(entry => (
                <tr key={entry.id}>
                  <td>{new Date(entry.date).toLocaleDateString()}</td>
                  <td>{entry.chemical}</td>
                  <td>{entry.quantity}</td>
                  <td>
                    <span className={`badge ${
                      entry.action === 'used' ? 'bg-warning' :
                      entry.action === 'added' ? 'bg-success' :
                      'bg-danger'
                    }`}>
                      {entry.action}
                    </span>
                  </td>
                  <td>{entry.notes}</td>
                  <td>
          <button
                      className="btn btn-outline-danger btn-sm"
                      title="Delete entry"
                      onClick={() => {
                        const updated = entries.filter(e => e.id !== entry.id);
                        setEntries(updated);
                        localStorage.setItem('chemicalLogbook', JSON.stringify(updated));
            setAlertVariant('warning');
            setAlertMsg('Entry deleted.');
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Logbook;
