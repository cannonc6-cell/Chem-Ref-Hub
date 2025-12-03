import React, { useEffect } from 'react';

export default function Resources() {
  useEffect(() => {
    document.title = 'Resources – ChemRef Hub';
  }, []);

  const resources = [
    {
      title: 'PubChem (NIH)',
      description: 'Comprehensive chemical database with structures, properties, and biological activities.',
      url: 'https://pubchem.ncbi.nlm.nih.gov/',
      category: 'Database',
      icon: '🔬'
    },
    {
      title: 'OSHA Hazard Communication',
      description: 'Official OSHA guidelines for chemical hazard communication and safety standards.',
      url: 'https://www.osha.gov/hazcom',
      category: 'Safety',
      icon: '🛡️'
    },
    {
      title: 'NIOSH Pocket Guide',
      description: 'Quick reference guide for chemical hazards and exposure limits from CDC.',
      url: 'https://www.cdc.gov/niosh/npg/',
      category: 'Safety',
      icon: '📖'
    },
    {
      title: 'ECHA Chemicals Database',
      description: 'European Chemicals Agency database with regulatory information and classification.',
      url: 'https://echa.europa.eu/information-on-chemicals',
      category: 'Database',
      icon: '🇪🇺'
    }
  ];

  return (
    <div className="resources-page" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Resources</h1>
        <p style={{ color: 'var(--text-secondary)' }}>External databases, safety guidelines, and reference materials.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {resources.map((resource, index) => (
          <a
            key={index}
            href={resource.url}
            target="_blank"
            rel="noreferrer noopener"
            style={{
              display: 'block',
              textDecoration: 'none',
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              padding: '1.5rem',
              transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
              color: 'inherit'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>{resource.icon}</div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: resource.category === 'Safety' ? 'var(--warning-light)' : 'var(--primary-light)',
                color: resource.category === 'Safety' ? 'var(--warning-dark)' : 'var(--primary-dark)'
              }}>
                {resource.category}
              </span>
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{resource.title}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{resource.description}</p>
          </a>
        ))}
      </div>

      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div style={{
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          padding: '2rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>GHS Pictograms Legend</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
              <span style={{ fontSize: '1.5rem', width: '32px', textAlign: 'center' }}>☣️</span> Health Hazard
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
              <span style={{ fontSize: '1.5rem', width: '32px', textAlign: 'center' }}>🔥</span> Flammable
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
              <span style={{ fontSize: '1.5rem', width: '32px', textAlign: 'center' }}>🧪</span> Corrosive
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
              <span style={{ fontSize: '1.5rem', width: '32px', textAlign: 'center' }}>💥</span> Explosive
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
              <span style={{ fontSize: '1.5rem', width: '32px', textAlign: 'center' }}>☠️</span> Acute Toxicity
            </li>
          </ul>
        </div>

        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--error-light)',
          padding: '2rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--error)' }}>Emergency Note</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            In case of a chemical emergency, always follow your institution's specific safety protocols.
            The resources provided here are for reference only and should not replace official safety training or emergency response procedures.
          </p>
          <div style={{ marginTop: '1.5rem', fontWeight: 600, color: 'var(--error)' }}>
            Emergency: 911
          </div>
        </div>
      </div>
    </div>
  );
}
