import React, { useEffect } from 'react';

export default function FAQ() {
  useEffect(() => {
    document.title = 'FAQ – ChemRef Hub';
  }, []);
  return (
    <div className="app-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="section-title">FAQ</h1>
        </div>
      </div>

      <div className="data-table-container">
        <div className="mb-3">
          <h2 className="h5 subheader-accent">How do I add a new chemical?</h2>
          <p>Go to Add Chemical, fill in at least Name and CAS (recommended), then save. It appears in the database immediately.</p>
        </div>
        <div className="mb-3">
          <h2 className="h5 subheader-accent">Where is my data stored?</h2>
          <p>Your additions and preferences are saved in your browser’s localStorage under keys like <code>userChemicals</code> and <code>favoriteChemicals</code>.</p>
        </div>
        <div className="mb-3">
          <h2 className="h5 subheader-accent">Can I import/export?</h2>
          <p>Yes. On the Chemicals page, use Export to download JSON. Use Import to merge or replace with another JSON file.</p>
        </div>
        <div className="mb-3">
          <h2 className="h5 subheader-accent">Why don’t some images load?</h2>
          <p>We try JPG then PNG in <code>public/chemical-images</code>. If both fail, a placeholder logo is shown. Ensure filenames match chemical names.</p>
        </div>
        <div className="mb-3">
          <h2 className="h5 subheader-accent">Does it work when hosted in a subfolder (e.g., GitHub Pages)?</h2>
          <p>Yes. The app respects the configured base URL for assets and data, and the deploy workflow sets it automatically.</p>
        </div>
        <div className="mb-0">
          <h2 className="h5 subheader-accent">Is this a replacement for SDS?</h2>
          <p>No. Always consult official Safety Data Sheets and institutional policies before handling chemicals.</p>
        </div>
      </div>
    </div>
  );
}
