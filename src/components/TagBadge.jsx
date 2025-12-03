import React from 'react';

const TagBadge = ({ type, label, outline = false, size = 'md' }) => {
    // Map types to CSS variables
    const getColorVar = (type) => {
        const lowerType = type.toLowerCase();
        if (lowerType.includes('flam')) return 'var(--hazard-flammable)';
        if (lowerType.includes('tox')) return 'var(--hazard-toxic)';
        if (lowerType.includes('corr')) return 'var(--hazard-corrosive)';
        if (lowerType.includes('irrit')) return 'var(--hazard-irritant)';
        if (lowerType.includes('carcin')) return 'var(--hazard-carcinogenic)';
        if (lowerType.includes('oxid')) return 'var(--hazard-oxidizer)';
        if (lowerType.includes('explo')) return 'var(--hazard-explosive)';
        if (lowerType.includes('bio')) return 'var(--info)';
        return 'var(--text-secondary)';
    };

    const color = getColorVar(type || label);

    const styles = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: size === 'sm' ? '2px 8px' : '4px 12px',
        borderRadius: 'var(--radius-full)',
        fontSize: size === 'sm' ? '0.75rem' : '0.8125rem',
        fontWeight: 600,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
        transition: 'all var(--transition-fast)',
        ...(outline ? {
            backgroundColor: 'transparent',
            border: `1px solid ${color}`,
            color: color,
        } : {
            backgroundColor: color,
            color: '#fff',
            border: `1px solid ${color}`,
        })
    };

    // Add slight opacity to background for filled variant if needed
    // For now using solid colors as per design

    return (
        <span className="tag-badge" style={styles}>
            {label || type}
        </span>
    );
};

export default TagBadge;
