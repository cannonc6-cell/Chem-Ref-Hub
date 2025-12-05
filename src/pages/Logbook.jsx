import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { LOG_TYPES, getAllLogTypes } from '../config/logTypes';
import SEO from '../components/SEO';

function Logbook() {
  // State
  const [entries, setEntries] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('chemicalLogbook') || '[]');
    } catch {
      return [];
    }
  });

  const [logType, setLogType] = useState('experiment');
  const [formData, setFormData] = useState({});
  const [chemicals, setChemicals] = useState([]);

  // Filters
  const [filterType, setFilterType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Load chemicals for autocomplete
  useEffect(() => {
    try {
      const storedChemicals = JSON.parse(localStorage.getItem('chemicals') || '[]');
      setChemicals(storedChemicals);
    } catch {
      setChemicals([]);
    }
  }, []);

  useEffect(() => {
    document.title = 'Logbook – ChemRef Hub';
  }, []);

  // Initialize form with default values when log type changes
  useEffect(() => {
    const config = LOG_TYPES[logType];
    const initialData = {};
    config.fields.forEach(field => {
      if (field.type === 'date' && field.name === 'date') {
        initialData[field.name] = new Date().toISOString().split('T')[0];
      } else if (field.type === 'multiselect') {
        initialData[field.name] = [];
      } else if (field.type === 'checkbox') {
        initialData[field.name] = false;
      } else {
        initialData[field.name] = '';
      }
    });
    setFormData(initialData);
  }, [logType]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const config = LOG_TYPES[logType];

    // Validate required fields
    for (const field of config.fields) {
      if (field.required && !formData[field.name]) {
        toast.error(`${field.label} is required.`);
        return;
      }
    }

    const entry = {
      ...formData,
      id: Date.now(),
      logType: logType,
      timestamp: new Date().toISOString()
    };

    const updatedEntries = [entry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('chemicalLogbook', JSON.stringify(updatedEntries));

    // Reset form
    const initialData = {};
    config.fields.forEach(field => {
      if (field.type === 'date' && field.name === 'date') {
        initialData[field.name] = new Date().toISOString().split('T')[0];
      } else if (field.type === 'multiselect') {
        initialData[field.name] = [];
      } else if (field.type === 'checkbox') {
        initialData[field.name] = false;
      } else {
        initialData[field.name] = '';
      }
    });
    setFormData(initialData);

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

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  // Export functions
  const exportToCSV = () => {
    if (filteredEntries.length === 0) {
      toast.error('No entries to export');
      return;
    }

    const headers = ['Type', 'Date', 'Details'];
    const rows = filteredEntries.map(entry => {
      const config = LOG_TYPES[entry.logType] || LOG_TYPES.usage;
      const details = Object.entries(entry)
        .filter(([key]) => !['id', 'logType', 'timestamp'].includes(key))
        .map(([key, value]) => `${key}: ${value}`)
        .join(' | ');
      return [config.label, entry.date || new Date(entry.timestamp).toLocaleDateString(), details];
    });

    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `logbook_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
    toast.success('CSV exported successfully');
  };

  const exportToJSON = () => {
    if (filteredEntries.length === 0) {
      toast.error('No entries to export');
      return;
    }

    const blob = new Blob([JSON.stringify(filteredEntries, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `logbook_backup_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
    toast.success('JSON backup created');
  };

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesType = !filterType || entry.logType === filterType;
      const matchesSearch = !searchTerm || JSON.stringify(entry).toLowerCase().includes(searchTerm.toLowerCase());
      const entryDate = entry.date || new Date(entry.timestamp).toISOString().split('T')[0];
      const matchesDateFrom = !dateFrom || entryDate >= dateFrom;
      const matchesDateTo = !dateTo || entryDate <= dateTo;
      return matchesType && matchesSearch && matchesDateFrom && matchesDateTo;
    });
  }, [entries, filterType, searchTerm, dateFrom, dateTo]);

  // Render form field based on type
  const renderField = (field) => {
    const value = formData[field.name] || (field.type === 'multiselect' ? [] : field.type === 'checkbox' ? false : '');

    switch (field.type) {
      case 'text':
      case 'date':
        return (
          <input
            type={field.type}
            className="form-control"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
          />
        );

      case 'textarea':
        return (
          <textarea
            className="form-control"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
            rows={field.rows || 3}
          />
        );

      case 'select':
        return (
          <select
            className="form-select"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.required}
          >
            <option value="">Select...</option>
            {field.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'autocomplete':
        return (
          <input
            type="text"
            className="form-control"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
            list={`${field.name}-datalist`}
            autoComplete="off"
          />
        );

      case 'multiselect':
        return (
          <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '0.5rem', minHeight: '38px' }}>
            {chemicals.slice(0, 10).map(chem => (
              <label key={chem.id} style={{ display: 'inline-flex', alignItems: 'center', marginRight: '1rem', fontSize: '0.875rem' }}>
                <input
                  type="checkbox"
                  checked={value.includes(chem.name)}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...value, chem.name]
                      : value.filter(v => v !== chem.name);
                    handleFieldChange(field.name, newValue);
                  }}
                  style={{ marginRight: '0.25rem' }}
                />
                {chem.name}
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0' }}>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
              style={{ width: '1.125rem', height: '1.125rem' }}
            />
            <span style={{ fontSize: '0.9375rem' }}>{field.label}</span>
          </div>
        );

      default:
        return null;
    }
  };

  const currentConfig = LOG_TYPES[logType];

  return (
    <div className="logbook-page" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <SEO
            title="Lab Logbook"
            description="Track experiments, chemical usage, maintenance, and incidents in your digital lab logbook."
          />
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Chemical Logbook</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track experiments, usage, disposal, and maintenance with specialized log types.</p>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-outline-primary" onClick={exportToCSV}>
            📊 Export CSV
          </button>
          <button className="btn btn-outline-secondary" onClick={exportToJSON}>
            💾 Backup JSON
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{
        backgroundColor: 'var(--surface)',
        padding: '1rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'flex-end'
      }}>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', color: 'var(--text-secondary)' }}>
            Search
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ flex: '1 1 150px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', color: 'var(--text-secondary)' }}>
            Filter by Type
          </label>
          <select className="form-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            {getAllLogTypes().map(type => (
              <option key={type.id} value={type.id}>{type.icon} {type.label}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1 1 140px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', color: 'var(--text-secondary)' }}>
            From Date
          </label>
          <input type="date" className="form-control" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>

        <div style={{ flex: '1 1 140px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', color: 'var(--text-secondary)' }}>
            To Date
          </label>
          <input type="date" className="form-control" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>

        {(filterType || searchTerm || dateFrom || dateTo) && (
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              setFilterType('');
              setSearchTerm('');
              setDateFrom('');
              setDateTo('');
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* New Entry Form */}
      <div style={{
        backgroundColor: 'var(--surface)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>New Entry</h2>

          {/* Log Type Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Log Type:</label>
            <select
              className="form-select"
              value={logType}
              onChange={(e) => setLogType(e.target.value)}
              style={{ width: 'auto', minWidth: '200px', fontWeight: 600 }}
            >
              {getAllLogTypes().map(type => (
                <option key={type.id} value={type.id}>{type.icon} {type.label}</option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {currentConfig.fields.map(field => {
              if (field.type === 'checkbox') {
                return (
                  <div key={field.name} className="col-12">
                    {renderField(field)}
                  </div>
                );
              }

              return (
                <div key={field.name} className={field.type === 'textarea' ? 'col-12' : 'col-md-6'}>
                  <label className="form-label fw-medium" style={{ fontSize: '0.875rem' }}>
                    {field.label} {field.required && <span style={{ color: 'var(--error)' }}>*</span>}
                  </label>
                  {renderField(field)}

                  {/* Datalist for autocomplete */}
                  {field.type === 'autocomplete' && (
                    <datalist id={`${field.name}-datalist`}>
                      {chemicals.map(chem => (
                        <option key={chem.id} value={chem.name}>{chem.formula}</option>
                      ))}
                    </datalist>
                  )}
                </div>
              );
            })}

            <div className="col-12 d-flex justify-content-end">
              <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{currentConfig.icon}</span>
                Add {currentConfig.label}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Entries Table */}
      <div style={{
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>
            Entries ({filteredEntries.length})
          </h3>
        </div>

        <div className="table-responsive">
          <table className="table mb-0">
            <thead style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <tr>
                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)', width: '60px' }}>Type</th>
                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Date</th>
                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Details</th>
                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)', width: '100px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
                    No entries found. {filterType || searchTerm || dateFrom || dateTo ? 'Try adjusting your filters.' : 'Start by adding one above.'}
                  </td>
                </tr>
              ) : (
                filteredEntries.map(entry => {
                  const config = LOG_TYPES[entry.logType] || LOG_TYPES.usage;
                  const displayDate = entry.date || new Date(entry.timestamp).toLocaleDateString();

                  return (
                    <tr key={entry.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                        <span style={{ fontSize: '1.5rem' }}>{config.icon}</span>
                      </td>
                      <td style={{ padding: '1rem', verticalAlign: 'top', fontSize: '0.875rem' }}>
                        {displayDate}
                      </td>
                      <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                        <div style={{ fontSize: '0.875rem' }}>
                          <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: config.color }}>
                            {config.label}
                          </div>
                          {Object.entries(entry).filter(([key]) => !['id', 'logType', 'timestamp'].includes(key)).map(([key, value]) => {
                            if (!value || (Array.isArray(value) && value.length === 0)) return null;
                            return (
                              <div key={key} style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '0.125rem' }}>
                                <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', verticalAlign: 'top', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="btn btn-sm btn-outline-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Logbook;
