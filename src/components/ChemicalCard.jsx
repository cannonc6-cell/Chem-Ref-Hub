import React from 'react';
import { Link } from 'react-router-dom';
import TagBadge from './TagBadge';

const ChemicalCard = ({ chemical, isFavorite, onToggleFavorite }) => {
    const {
        id,
        name,
        formula,
        casNumber,
        molecularWeight,
        hazards = [],
        category,
        description
    } = chemical;

    return (
        <div className="chemical-card" style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
            position: 'relative',
            height: '100%',
            cursor: 'pointer'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            {/* Favorite Button */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleFavorite(id);
                }}
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: isFavorite ? 'var(--accent)' : 'var(--text-tertiary)',
                    padding: '4px',
                    zIndex: 2
                }}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
                <svg
                    width="20"
                    height="20"
                    fill={isFavorite ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>

            {/* Chemical Structure Placeholder / Image */}
            <div style={{
                height: '140px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.5rem',
                overflow: 'hidden'
            }}>
                {/* In a real app, this would be an image or structure rendering */}
                <div style={{ opacity: 0.3 }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
                <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    marginBottom: '0.25rem',
                    color: 'var(--text-primary)'
                }}>
                    {name}
                </h3>
                <div style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.75rem',
                    fontFamily: 'monospace'
                }}>
                    {formula}
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-tertiary)',
                    marginBottom: '1rem'
                }}>
                    <div>
                        <span style={{ display: 'block', fontWeight: 500 }}>CAS</span>
                        {casNumber}
                    </div>
                    <div>
                        <span style={{ display: 'block', fontWeight: 500 }}>MW</span>
                        {molecularWeight} g/mol
                    </div>
                </div>

                {/* Hazards Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {hazards.slice(0, 3).map((hazard, index) => (
                        <TagBadge
                            key={index}
                            label={hazard}
                            type={hazard}
                            outline={true}
                            size="sm"
                        />
                    ))}
                    {hazards.length > 3 && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', alignSelf: 'center' }}>
                            +{hazards.length - 3}
                        </span>
                    )}
                </div>
            </div>

            {/* Action Button */}
            <Link
                to={`/chemicals/${id}`}
                style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '0.625rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    marginTop: '0.5rem',
                    transition: 'all var(--transition-fast)',
                    textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.color = 'var(--primary)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                }}
            >
                View Details
            </Link>
        </div>
    );
};

export default ChemicalCard;
