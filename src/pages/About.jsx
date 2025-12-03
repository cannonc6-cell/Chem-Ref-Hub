import React, { useEffect } from 'react';

const BASE = import.meta.env.BASE_URL || '/';

export default function About() {
  useEffect(() => {
    document.title = 'About – ChemRef Hub';
  }, []);

  return (
    <div className="about-page" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <img
          src={`${BASE}assets/logo.svg`}
          alt="ChemRef Hub Logo"
          style={{ width: '80px', height: '80px', marginBottom: '1.5rem' }}
        />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ChemRef Hub
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Your comprehensive chemical reference and laboratory management solution.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '2rem' }}>
        <div style={{
          backgroundColor: 'var(--surface)',
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Mission</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            ChemRef Hub aims to provide students, researchers, and lab managers with a structured, searchable, and easy-to-use platform for managing chemical inventories.
            We prioritize fast access to safety data, intuitive organization, and a lightweight, offline-capable experience.
          </p>
        </div>

        <div style={{
          backgroundColor: 'var(--surface)',
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Key Features</h2>
          <ul style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            padding: 0,
            margin: 0,
            listStyle: 'none'
          }}>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--success)' }}>✓</span>
              <span style={{ color: 'var(--text-secondary)' }}>Searchable Chemical Catalog</span>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--success)' }}>✓</span>
              <span style={{ color: 'var(--text-secondary)' }}>Inventory Tracking & Alerts</span>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--success)' }}>✓</span>
              <span style={{ color: 'var(--text-secondary)' }}>Safety Data & Hazard Tags</span>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--success)' }}>✓</span>
              <span style={{ color: 'var(--text-secondary)' }}>Usage Logbook</span>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--success)' }}>✓</span>
              <span style={{ color: 'var(--text-secondary)' }}>Lab Calculators</span>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--success)' }}>✓</span>
              <span style={{ color: 'var(--text-secondary)' }}>Local Data Storage (Private)</span>
            </li>
          </ul>
        </div>

        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--error-light)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--error)' }}>Disclaimer</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            This application is for educational and reference purposes only. While we strive for accuracy, the data provided should always be verified against official Safety Data Sheets (SDS) and manufacturer information.
            The developers assume no liability for the use or misuse of the information provided.
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
          <p>Version 1.3.0 • Built with React & Vite</p>
        </div>
      </div>
    </div>
  );
}
