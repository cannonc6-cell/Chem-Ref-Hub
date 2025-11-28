import React from 'react';

export default function Resources() {
  return (
    <div className="app-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="section-title">Resources</h1>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <div className="data-table-container">
            <h2 className="h5 subheader-accent">SDS and Safety Databases</h2>
            <ul className="mb-0">
              <li><a href="https://pubchem.ncbi.nlm.nih.gov/" target="_blank" rel="noreferrer noopener">PubChem (NIH)</a></li>
              <li><a href="https://www.osha.gov/hazcom" target="_blank" rel="noreferrer noopener">OSHA Hazard Communication</a></li>
              <li><a href="https://www.cdc.gov/niosh/npg/" target="_blank" rel="noreferrer noopener">NIOSH Pocket Guide</a></li>
              <li><a href="https://echa.europa.eu/information-on-chemicals" target="_blank" rel="noreferrer noopener">ECHA Chemicals Database</a></li>
            </ul>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="data-table-container">
            <h2 className="h5 subheader-accent">GHS Pictograms (Legend)</h2>
            <p className="mb-2">Common hazard pictograms you may see in SDS:</p>
            <ul className="mb-0">
              <li>Health hazard (e.g., carcinogen) — <span aria-hidden>☣ ☠ ⚠</span></li>
              <li>Flame (flammable) — <span aria-hidden>🔥</span></li>
              <li>Gas cylinder (gas under pressure)</li>
              <li>Corrosion (skin corrosion/burns) — <span aria-hidden>🧪</span></li>
              <li>Exploding bomb (explosive) — <span aria-hidden>💥</span></li>
              <li>Skull and crossbones (acute toxicity) — <span aria-hidden>☠</span></li>
              <li>Environment (aquatic toxicity)</li>
            </ul>
          </div>
        </div>
        <div className="col-12">
          <div className="data-table-container">
            <h2 className="h5 subheader-accent">Emergency Contacts</h2>
            <p className="mb-0">Call your local emergency number. Follow institutional procedures and contact your safety officer immediately.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
