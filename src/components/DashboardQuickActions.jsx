import React from 'react';
import { Link } from 'react-router-dom';

const DashboardQuickActions = ({ recentlyAdded, lowStockItems }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
            {/* Recently Added Chemicals */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recently Added</h3>
                    <Link to="/add-chemical" style={{ fontSize: '0.875rem', fontWeight: 500 }}>+ Add New</Link>
                </div>
                <div style={{
                    backgroundColor: 'var(--surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-light)',
                    overflow: 'hidden'
                }}>
                    {recentlyAdded.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                            No recently added chemicals
                        </div>
                    ) : (
                        recentlyAdded.map((chem, index) => (
                            <Link
                                key={chem.id}
                                to={`/chemicals/${encodeURIComponent(chem.id)}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '1rem 1.5rem',
                                    borderBottom: index < recentlyAdded.length - 1 ? '1px solid var(--border-light)' : 'none',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    transition: 'background-color var(--transition-fast)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <div className="icon-bg-teal" style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '1rem'
                                }}>
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{chem.name || chem['Chemical Name']}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{chem.formula || chem.Formula}</div>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>New</div>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* Low Stock Alerts */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>⚠️ Low Stock Alerts</h3>
                    <Link to="/chemicals" style={{ fontSize: '0.875rem', fontWeight: 500 }}>View All</Link>
                </div>
                <div style={{
                    backgroundColor: 'var(--surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-light)',
                    overflow: 'hidden'
                }}>
                    {lowStockItems.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                            ✓ All stocks are adequate
                        </div>
                    ) : (
                        lowStockItems.map((chem, index) => (
                            <Link
                                key={chem.id}
                                to={`/chemicals/${encodeURIComponent(chem.id)}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '1rem 1.5rem',
                                    borderBottom: index < lowStockItems.length - 1 ? '1px solid var(--border-light)' : 'none',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    transition: 'background-color var(--transition-fast)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    color: '#EF4444',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '1rem'
                                }}>
                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                    </svg>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{chem.name || chem['Chemical Name']}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        {chem.inventory?.quantity} {chem.inventory?.unit} remaining
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#EF4444' }}>Low</div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardQuickActions;
