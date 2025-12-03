import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { useChemicals } from "../hooks/useChemicals";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import QRCodeModal from "../components/QRCodeModal";
import ChemicalUsageHistory from "../components/ChemicalUsageHistory";
import TagBadge from "../components/TagBadge";

const BASE = import.meta.env.BASE_URL || '/';

function ChemicalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { chemicals, loading, updateChemical, deleteChemical } = useChemicals();
  const { addToRecent } = useRecentlyViewed();

  const [chemical, setChemical] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (loading) return;
    const decodedId = decodeURIComponent(id);
    const match = chemicals.find(c =>
      String(c.CAS || c.id || c['Chemical Name'] || c.name || '').toLowerCase() === String(decodedId).toLowerCase()
    );
    setChemical(match || null);
    if (match) addToRecent(match);
  }, [id, chemicals, loading]);

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
          <button className="btn btn-outline-secondary" onClick={() => setShowQR(true)}>
            📷 QR Code
          </button>
          <button className="btn btn-outline-secondary" onClick={() => window.print()}>
            🖨️ Print
          </button>
          <button className="btn btn-outline-danger" onClick={handleDelete}>
            Delete
          </button>
          {/* Edit functionality would go here - for now just a placeholder or could link to edit page */}
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
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {chemical.description || chemical.Properties || "No description available."}
                    </p>

                    <div style={{ marginTop: '1.5rem' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Categories</h4>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {chemical.tags && chemical.tags.map(tag => (
                          <TagBadge key={tag} label={tag} type={tag} outline />
                        ))}
                        {(!chemical.tags || chemical.tags.length === 0) && <span style={{ color: 'var(--text-tertiary)' }}>No categories assigned</span>}
                      </div>
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
                    <div style={{ fontWeight: 500 }}>{chemical["Molecular Weight"] || chemical.molecularWeight || "N/A"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Density</div>
                    <div style={{ fontWeight: 500 }}>{chemical["Density"] || chemical.density || "N/A"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Appearance</div>
                    <div style={{ fontWeight: 500 }}>{chemical["Appearance"] || chemical.appearance || "N/A"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Melting Point</div>
                    <div style={{ fontWeight: 500 }}>{chemical.meltingPoint || "N/A"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Boiling Point</div>
                    <div style={{ fontWeight: 500 }}>{chemical.boilingPoint || "N/A"}</div>
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
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {chemical.hazards && chemical.hazards.map(h => (
                      <TagBadge key={h} label={h} type={h} />
                    ))}
                    {chemical["Hazard Information"] && (
                      <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>{chemical["Hazard Information"]}</p>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Handling & Storage</h4>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {chemical["Handling & Storage"] || "No specific instructions."}
                    </p>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Safety Notes</h4>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {chemical["Safety Notes"] || "No specific safety notes."}
                    </p>
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
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                      {chemical.inventory?.quantity || 0} <span style={{ fontSize: '1rem', fontWeight: 400 }}>{chemical.inventory?.unit || 'g'}</span>
                    </div>
                  </div>

                  <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Location</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                      {chemical.inventory?.location || 'Unassigned'}
                    </div>
                  </div>

                  <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Expiration Date</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                      {chemical.inventory?.expirationDate ? new Date(chemical.inventory.expirationDate).toLocaleDateString() : 'N/A'}
                    </div>
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
