import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

function Logbook() {
  const [entries, setEntries] = useState(() => {
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
    action: 'used',
    notes: ''
  });

  useEffect(() => {
    document.title = 'Logbook – ChemRef Hub';
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newEntry.chemical.trim()) {
      toast.error('Chemical name is required.');
      return;
    }
    if (!newEntry.quantity.trim()) {
      toast.error('Quantity is required.');
      return;
    }

    const entry = {
      ...newEntry,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };

    const updatedEntries = [entry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('chemicalLogbook', JSON.stringify(updatedEntries));

    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      chemical: '',
      quantity: '',
      action: 'used',
      notes: ''
    });
    toast.success('Logbook entry added.');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      const updated = entries.filter(e => e.id !== id);
      setEntries(updated);
      localStorage.setItem('chemicalLogbook', JSON.stringify(updated));
      toast.success('Entry deleted.');
    }
  };

  return (
    <div className="logbook-page" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Chemical Logbook</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track chemical usage, additions, and disposal events.</p>
      </div>

      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr' }}>
        {/* New Entry Form */}
        <div style={{
          backgroundColor: 'var(--surface)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Add New Entry</h2>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label fw-medium" style={{ fontSize: '0.875rem' }}>Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={newEntry.date}
                  onChange={e => setNewEntry({ ...newEntry, date: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-medium" style={{ fontSize: '0.875rem' }}>Chemical Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newEntry.chemical}
                  onChange={e => setNewEntry({ ...newEntry, chemical: e.target.value })}
                  required
                  placeholder="e.g. Acetone"
                />
              </div>
              <div className="col-md-2">
                <label className="form-label fw-medium" style={{ fontSize: '0.875rem' }}>Quantity</label>
                <input
                  type="text"
                  className="form-control"
                  value={newEntry.quantity}
                  onChange={e => setNewEntry({ ...newEntry, quantity: e.target.value })}
                  required
                  placeholder="e.g. 50g"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-medium" style={{ fontSize: '0.875rem' }}>Action</label>
                <select
                  className="form-select"
                  value={newEntry.action}
                  onChange={e => setNewEntry({ ...newEntry, action: e.target.value })}
                  required
                >
                  <option value="used">Used</option>
                  <option value="added">Added</option>
                  <option value="disposed">Disposed</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label fw-medium" style={{ fontSize: '0.875rem' }}>Notes</label>
                <textarea
                  className="form-control"
                  value={newEntry.notes}
                  onChange={e => setNewEntry({ ...newEntry, notes: e.target.value })}
                  placeholder="Optional notes about the usage or experiment..."
                  rows="2"
                />
              </div>
              <div className="col-12 d-flex justify-content-end">
                <button type="submit" className="btn btn-primary">Add Entry</button>
              </div>
            </div>
          </form>
        </div>

        {/* Entries List */}
        <div style={{
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          overflow: 'hidden'
        }}>
          <div className="table-responsive">
            <table className="table mb-0" style={{ width: '100%' }}>
              <thead style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <tr>
                  <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Date</th>
                  <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Chemical</th>
                  <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Action</th>
                  <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Quantity</th>
                  <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Notes</th>
                  <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}></th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                      No entries found. Start by adding one above.
                    </td>
                  </tr>
                ) : (
                  entries.map(entry => (
                    <tr key={entry.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '1rem', verticalAlign: 'middle' }}>{new Date(entry.date).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem', verticalAlign: 'middle', fontWeight: 500 }}>{entry.chemical}</td>
                      <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: entry.action === 'added' ? 'var(--success-light)' :
                            entry.action === 'disposed' ? 'var(--error-light)' : 'var(--warning-light)',
                          color: entry.action === 'added' ? 'var(--success-dark)' :
                            entry.action === 'disposed' ? 'var(--error-dark)' : 'var(--warning-dark)',
                          textTransform: 'capitalize'
                        }}>
                          {entry.action}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', verticalAlign: 'middle' }}>{entry.quantity}</td>
                      <td style={{ padding: '1rem', verticalAlign: 'middle', color: 'var(--text-secondary)', maxWidth: '300px' }}>{entry.notes}</td>
                      <td style={{ padding: '1rem', verticalAlign: 'middle', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--error)',
                            cursor: 'pointer',
                            opacity: 0.7,
                            transition: 'opacity var(--transition-fast)'
                          }}
                          onMouseEnter={(e) => e.target.style.opacity = 1}
                          onMouseLeave={(e) => e.target.style.opacity = 0.7}
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
      </div>
    </div>
  );
}

export default Logbook;
