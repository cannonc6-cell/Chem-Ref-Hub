import React from 'react';

const BASE = import.meta.env.BASE_URL || '/';

export default function About() {
  return (
    <div className="app-container">
      <div className="page-header">
        <div className="header-content">
          <img src={`${BASE}assets/logo.svg`} alt="ChemRef Hub" className="app-logo" />
          <h1 className="section-title">About ChemRef Hub</h1>
        </div>
      </div>

      <section className="mb-4">
        <h2 className="h4 subheader-accent">Mission</h2>
        <p>
          ChemRef Hub helps students and labs keep a structured, searchable reference of chemicals,
          with safety context, quick properties, and a simple logbook. It’s optimized for fast lookup,
          lightweight data entry, and easy sharing as a static website.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="h4 subheader-accent">What you can do</h2>
        <ul>
          <li>Browse the built-in catalog and filter by name or tags.</li>
          <li>Open a chemical to view properties, hazards, and notes.</li>
          <li>Bookmark favorites for quick access.</li>
          <li>Import/export your dataset as JSON.</li>
          <li>Add new chemicals and record activity in the logbook.</li>
        </ul>
      </section>

      <section className="mb-4">
        <h2 className="h4 subheader-accent">Data sources & accuracy</h2>
        <p>
          Built-in data is provided for demonstration and may not be complete. Always verify against
          official Safety Data Sheets (SDS) and authoritative sources. Links to public resources are
          provided in Resources.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="h4 subheader-accent">Privacy</h2>
        <p>
          This app stores your additions and preferences locally in your browser (localStorage).
          No accounts or servers are required for core features.
        </p>
      </section>

      <section>
        <h2 className="h4 subheader-accent">Disclaimer</h2>
        <p className="mb-0">
          Educational use only. Always follow lab policies and consult your institution’s safety
          officer. In emergencies, call your local emergency number.
        </p>
      </section>
    </div>
  );
}
