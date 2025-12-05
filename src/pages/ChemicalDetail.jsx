import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { useChemicals } from "../hooks/useChemicals";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import QRCodeModal from "../components/QRCodeModal";
import ChemicalUsageHistory from "../components/ChemicalUsageHistory";
import TagBadge from "../components/TagBadge";
import { generateChemicalPDF } from "../utils/generatePDF";

const BASE = import.meta.env.BASE_URL || '/';

function ChemicalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { chemicals, loading, updateChemical, deleteChemical } = useChemicals();
  const { addToRecent } = useRecentlyViewed();

  const [chemical, setChemical] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedChemical, setEditedChemical] = useState(null);

  useEffect(() => {
    if (loading) return;
    const decodedId = decodeURIComponent(id);
    const match = chemicals.find(c =>
      String(c.CAS || c.id || c['Chemical Name'] || c.name || '').toLowerCase() === String(decodedId).toLowerCase()
    );
    setChemical(match || null);
    setEditedChemical(match || null);
    if (match) addToRecent(match);
  }, [id, chemicals, loading]);

  const handleEdit = () => {
    setIsEditMode(true);
    setEditedChemical({ ...chemical });
  };

  const handleSave = () => {
    updateChemical(editedChemical);
    setChemical(editedChemical);
    setIsEditMode(false);
    toast.success('Chemical updated successfully!');
  };

  const handleCancel = () => {
    setEditedChemical({ ...chemical });
    setIsEditMode(false);
  };

  const handleFieldChange = (field, value) => {
    setEditedChemical({ ...editedChemical, [field]: value });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this chemical? This cannot be undone.")) {
      if (chemical) {
        deleteChemical(chemical.id);
        toast.success('Chemical deleted.');
        navigate("/chemicals");
      }
    }
  };

  if (loading) return <div className="p-5 text-center">Loading...</div>;

  if (!chemical) {
    return (
      <div className="p-5 text-center">
        <h3>Chemical not found</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/chemicals")}>Back to List</button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'properties', label: 'Properties' },
    { id: 'safety', label: 'Safety & Hazards' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'history', label: 'History' }
  ];

  const displayChemical = isEditMode ? editedChemical : chemical;

  return (
    <div className="chemical-detail-page" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <button
              onClick={() => navigate('/chemicals')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>
              {chemical.name || chemical["Chemical Name"]}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            <span><strong>CAS:</strong> {chemical.CAS || chemical.casNumber}</span>
            <span><strong>Formula:</strong> {chemical.formula || chemical.Formula}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {isEditMode ? (
            <>
              <button className="btn btn-primary" onClick={handleSave}>
                💾 Save
              </button>
              <button className="btn btn-outline-secondary" onClick={handleCancel}>
                ✖️ Cancel
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-primary" onClick={handleEdit}>
                ✏️ Edit
              </button>
              <button className="btn btn-outline-secondary" onClick={() => generateChemicalPDF(chemical)}>
                � PDF
              </button>
              <button className="btn btn-outline-secondary" onClick={() => setShowQR(true)}>
                📷 QR Code
              </button>
              <button className="btn btn-outline-danger" onClick={handleDelete}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Sidebar Navigation */}
        <div style={{
          position: 'sticky',
          top: '90px',
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          overflow: 'hidden'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '1rem 1.5rem',
                background: activeTab === tab.id ? 'var(--primary-light)' : 'transparent',
                border: 'none',
                borderLeft: activeTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === tab.id ? 600 : 400,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              <div style={{
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                padding: '2rem',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: '0 0 200px' }}>
                    <div style={{
                      width: '100%',
                      height: '200px',
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--border-light)'
                    }}>
                      {/* Placeholder for structure */}
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Description</h3>
                    {isEditMode ? (
                      <textarea
                        className="form-control"
                        value={editedChemical.description || editedChemical.Properties || ''}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        style={{ minHeight: '150px' }}
                      />
                    ) : (
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {displayChemical.description || displayChemical.Properties || "No description available."}
                      </p>
                    )}

                    <div style={{ marginTop: '1.5rem' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Categories</h4>
                      {isEditMode ? (
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Comma separated tags"
                          value={Array.isArray(editedChemical.tags) ? editedChemical.tags.join(', ') : (editedChemical.tags || '')}
                          onChange={(e) => handleFieldChange('tags', e.target.value.split(',').map(t => t.trim()))}
                        />
                      ) : (
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {displayChemical.tags && displayChemical.tags.map(tag => (
                            <TagBadge key={tag} label={tag} type={tag} outline />
                          ))}
                          {(!displayChemical.tags || displayChemical.tags.length === 0) && <span style={{ color: 'var(--text-tertiary)' }}>No categories assigned</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Properties Tab */}
          {activeTab === 'properties' && (
            <div className="animate-fade-in">
              <div style={{
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                padding: '2rem'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Physical & Chemical Properties</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Molecular Weight</div>
                    {isEditMode ? (
                      <input type="text" className="form-control" value={editedChemical.molecularWeight || editedChemical["Molecular Weight"] || ''} onChange={(e) => handleFieldChange('molecularWeight', e.target.value)} />
                    ) : (
                      <div style={{ fontWeight: 500 }}>{displayChemical["Molecular Weight"] || displayChemical.molecularWeight || "N/A"}</div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Density</div>
                    {isEditMode ? (
                      <input type="text" className="form-control" value={editedChemical.density || editedChemical["Density"] || ''} onChange={(e) => handleFieldChange('density', e.target.value)} />
                    ) : (
                      <div style={{ fontWeight: 500 }}>{displayChemical["Density"] || displayChemical.density || "N/A"}</div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Appearance</div>
                    {isEditMode ? (
                      <input type="text" className="form-control" value={editedChemical.appearance || editedChemical["Appearance"] || ''} onChange={(e) => handleFieldChange('appearance', e.target.value)} />
                    ) : (
                      <div style={{ fontWeight: 500 }}>{displayChemical["Appearance"] || displayChemical.appearance || "N/A"}</div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Melting Point</div>
                    {isEditMode ? (
                      <input type="text" className="form-control" value={editedChemical.meltingPoint || ''} onChange={(e) => handleFieldChange('meltingPoint', e.target.value)} />
                    ) : (
                      <div style={{ fontWeight: 500 }}>{displayChemical.meltingPoint || "N/A"}</div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Boiling Point</div>
                    {isEditMode ? (
                      <input type="text" className="form-control" value={editedChemical.boilingPoint || ''} onChange={(e) => handleFieldChange('boilingPoint', e.target.value)} />
                    ) : (
                      <div style={{ fontWeight: 500 }}>{displayChemical.boilingPoint || "N/A"}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Safety Tab */}
          {activeTab === 'safety' && (
            <div className="animate-fade-in">
              <div style={{
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                padding: '2rem'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Safety Information</h3>

                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Hazards</h4>
                  {isEditMode ? (
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Comma separated hazards (e.g., Flammable, Toxic)"
                      value={Array.isArray(editedChemical.hazards) ? editedChemical.hazards.join(', ') : (editedChemical.hazards || '')}
                      onChange={(e) => handleFieldChange('hazards', e.target.value.split(',').map(h => h.trim()))}
                    />
                  ) : (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {displayChemical.hazards && displayChemical.hazards.map(h => (
                        <TagBadge key={h} label={h} type={h} />
                      ))}
                      {displayChemical["Hazard Information"] && (
                        <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>{displayChemical["Hazard Information"]}</p>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Handling & Storage</h4>
                    {isEditMode ? (
                      <textarea
                        className="form-control"
                        value={editedChemical["Handling & Storage"] || ''}
                        onChange={(e) => handleFieldChange('Handling & Storage', e.target.value)}
                        style={{ minHeight: '100px' }}
                      />
                    ) : (
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {displayChemical["Handling & Storage"] || "No specific instructions."}
                      </p>
                    )}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Safety Notes</h4>
                    {isEditMode ? (
                      <textarea
                        className="form-control"
                        value={editedChemical["Safety Notes"] || ''}
                        onChange={(e) => handleFieldChange('Safety Notes', e.target.value)}
                        style={{ minHeight: '100px' }}
                      />
                    ) : (
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {displayChemical["Safety Notes"] || "No specific safety notes."}
                      </p>
                    )}
                  </div>
                  {chemical["SDS Link"] && (
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Safety Data Sheet (SDS)</h4>
                      <a
                        href={chemical["SDS Link"]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm"
                      >
                        View SDS Document
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <div className="animate-fade-in">
              <div style={{
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                padding: '2rem'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Inventory Status</h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Current Quantity</div>
                    {isEditMode ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input type="number" className="form-control" value={editedChemical.inventory?.quantity || 0} onChange={(e) => handleFieldChange('inventory', { ...editedChemical.inventory, quantity: parseFloat(e.target.value) })} />
                        <input type="text" className="form-control" style={{ width: '60px' }} value={editedChemical.inventory?.unit || 'g'} onChange={(e) => handleFieldChange('inventory', { ...editedChemical.inventory, unit: e.target.value })} />
                      </div>
                    ) : (
                      <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                        {displayChemical.inventory?.quantity || 0} <span style={{ fontSize: '1rem', fontWeight: 400 }}>{displayChemical.inventory?.unit || 'g'}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Location</div>
                    {isEditMode ? (
                      <input type="text" className="form-control" value={editedChemical.inventory?.location || ''} onChange={(e) => handleFieldChange('inventory', { ...editedChemical.inventory, location: e.target.value })} />
                    ) : (
                      <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                        {displayChemical.inventory?.location || 'Unassigned'}
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Expiration Date</div>
                    {isEditMode ? (
                      <input type="date" className="form-control" value={editedChemical.inventory?.expirationDate || ''} onChange={(e) => handleFieldChange('inventory', { ...editedChemical.inventory, expirationDate: e.target.value })} />
                    ) : (
                      <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                        {displayChemical.inventory?.expirationDate ? new Date(displayChemical.inventory.expirationDate).toLocaleDateString() : 'N/A'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="animate-fade-in">
              <div style={{
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                padding: '2rem'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Usage History</h3>
                <ChemicalUsageHistory chemicalId={chemical.id} />
              </div>
            </div>
          )}

        </div>
      </div>

      <QRCodeModal
        show={showQR}
        onClose={() => setShowQR(false)}
        chemical={chemical}
        url={window.location.href}
      />
    </div>
  );
}

export default ChemicalDetail;
