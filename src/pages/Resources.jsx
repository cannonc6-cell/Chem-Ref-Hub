import React, { useEffect } from 'react';
import '../styles/modern.css';

export default function Resources() {
  useEffect(() => {
    document.title = 'Resources – ChemRef Hub';
  }, []);

  const resources = [
    {
      title: 'PubChem (NIH)',
      description: 'Comprehensive chemical database with structures, properties, and biological activities',
      url: 'https://pubchem.ncbi.nlm.nih.gov/',
      category: 'Database'
    },
    {
      title: 'OSHA Hazard Communication',
      description: 'Official OSHA guidelines for chemical hazard communication and safety',
      url: 'https://www.osha.gov/hazcom',
      category: 'Safety'
    },
    {
      title: 'NIOSH Pocket Guide',
      description: 'Quick reference guide for chemical hazards and exposure limits',
      url: 'https://www.cdc.gov/niosh/npg/',
      category: 'Safety'
    },
    {
      title: 'ECHA Chemicals Database',
      description: 'European Chemicals Agency database with regulatory information',
      url: 'https://echa.europa.eu/information-on-chemicals',
      category: 'Database'
    }
  ];

  return (
    <div className="app-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="section-title">Resources</h1>
        </div>
        <p className="lead mb-0" style={{ position: 'relative', zIndex: 1, marginTop: 'var(--space-2)' }}>
          External databases and safety information
        </p>
      </div>

      <div className="grid-container">
        {resources.map((resource, index) => (
          <a
            key={index}
            href={resource.url}
            target="_blank"
            rel="noreferrer noopener"
            className="resource-card"
          >
            <div style={{
              display: 'inline-block',
              padding: 'var(--space-1) var(--space-2)',
              background: 'var(--accent)',
              color: '#fff',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-semibold)',
              marginBottom: 'var(--space-2)'
            }}>
              {resource.category}
            </div>
            <h3>{resource.title}</h3>
            <p>{resource.description}</p>
          </a>
        ))}
      </div>

      <div className="info-card" style={{ marginTop: 'var(--space-4)' }}>
        <h3>GHS Pictograms (Legend)</h3>
        <p style={{ marginBottom: 'var(--space-2)' }}>Common hazard pictograms you may see in Safety Data Sheets:</p>
        <ul style={{ margin: 0, paddingLeft: 'var(--space-4)', color: 'var(--text-secondary)' }}>
          <li>Health hazard (e.g., carcinogen) — <span aria-hidden>☣ ☠ ⚠</span></li>
          <li>Flame (flammable) — <span aria-hidden>🔥</span></li>
          <li>Gas cylinder (gas under pressure)</li>
          <li>Corrosion (skin corrosion/burns) — <span aria-hidden>🧪</span></li>
          <li>Exploding bomb (explosive) — <span aria-hidden>💥</span></li>
          <li>Skull and crossbones (acute toxicity) — <span aria-hidden>☠</span></li>
          <li>Environment (aquatic toxicity)</li>
        </ul>
      </div>

      <div className="info-card" style={{
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
        borderColor: 'var(--danger)'
      }}>
        <h3 style={{ color: 'var(--danger)' }}>Emergency Contacts</h3>
        <p style={{ margin: 0 }}>
          Call your local emergency number. Follow institutional procedures and contact your safety officer immediately.
        </p>
      </div>
    </div>
  );
}
