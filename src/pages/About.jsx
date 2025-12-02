import React, { useEffect } from 'react';
import '../styles/modern.css';

const BASE = import.meta.env.BASE_URL || '/';

export default function About() {
  useEffect(() => {
    document.title = 'About – ChemRef Hub';
  }, []);

  return (
    <div className="app-container">
      <div className="page-header">
        <div className="header-content">
          <img src={`${BASE}assets/logo.svg`} alt="ChemRef Hub" className="app-logo" />
          <h1 className="section-title">About ChemRef Hub</h1>
        </div>
        <p className="lead mb-0" style={{ position: 'relative', zIndex: 1, marginTop: 'var(--space-2)' }}>
          Your comprehensive chemical reference and laboratory management solution
        </p>
      </div>

      <div className="grid-container" style={{ gridTemplateColumns: '1fr' }}>
        <div className="info-card">
          <h3>Mission</h3>
          <p>
            ChemRef Hub helps students and labs keep a structured, searchable reference of chemicals,
            with safety context, quick properties, and a simple logbook. It's optimized for fast lookup,
            lightweight data entry, and easy sharing as a static website.
          </p>
        </div>

        <div className="info-card">
          <h3>What you can do</h3>
          <ul style={{ margin: 0, paddingLeft: 'var(--space-4)' }}>
            <li>Browse the built-in catalog and filter by name or tags</li>
            <li>Open a chemical to view properties, hazards, and notes</li>
            <li>Bookmark favorites for quick access</li>
            <li>Import/export your dataset as JSON</li>
            <li>Add new chemicals and record activity in the logbook</li>
          </ul>
        </div>

        <div className="info-card">
          <h3>Data sources & accuracy</h3>
          <p>
            Built-in data is provided for demonstration and may not be complete. Always verify against
            official Safety Data Sheets (SDS) and authoritative sources. Links to public resources are
            provided in Resources.
          </p>
        </div>

        <div className="info-card">
          <h3>Privacy</h3>
          <p>
            This app stores your additions and preferences locally in your browser (localStorage).
            No accounts or servers are required for core features.
          </p>
        </div>

        <div className="info-card" style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
          borderColor: 'var(--danger)'
        }}>
          <h3 style={{ color: 'var(--danger)' }}>Disclaimer</h3>
          <p style={{ margin: 0 }}>
            Educational use only. Always follow lab policies and consult your institution's safety
            officer. In emergencies, call your local emergency number.
          </p>
        </div>
      </div>
    </div>
  );
}
