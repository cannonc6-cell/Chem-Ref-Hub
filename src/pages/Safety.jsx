import React, { useEffect } from 'react';
import '../styles/modern.css';

function Safety() {
  useEffect(() => {
    document.title = 'Safety – ChemRef Hub';
  }, []);

  return (
    <div className="app-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="section-title">Laboratory Safety Guidelines</h1>
        </div>
        <p className="lead mb-0" style={{ position: 'relative', zIndex: 1, marginTop: 'var(--space-2)' }}>
          Essential safety protocols for chemical handling
        </p>
      </div>

      {/* Personal Protection Equipment */}
      <div className="info-card">
        <h3 style={{ color: 'var(--accent)' }}>Personal Protection Equipment (PPE)</h3>
        <ul style={{ margin: 0, paddingLeft: 'var(--space-4)', color: 'var(--text-secondary)' }}>
          <li><strong style={{ color: 'var(--text-primary)' }}>Eye Protection:</strong> Always wear appropriate safety goggles or face shields</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Hand Protection:</strong> Use appropriate gloves for chemical handling</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Body Protection:</strong> Wear lab coats and closed-toe shoes</li>
        </ul>
      </div>

      {/* Emergency Procedures */}
      <div className="info-card" style={{
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
        borderColor: 'var(--danger)'
      }}>
        <h3 style={{ color: 'var(--danger)' }}>Emergency Procedures</h3>
        <div className="grid-container" style={{ gridTemplateColumns: '1fr', gap: 'var(--space-3)' }}>
          <div>
            <h4 style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>Chemical Spill</h4>
            <ol style={{ margin: 0, paddingLeft: 'var(--space-4)', color: 'var(--text-secondary)' }}>
              <li>Alert others in the area</li>
              <li>Use spill kits for small spills</li>
              <li>Evacuate for large spills</li>
              <li>Contact emergency response</li>
            </ol>
          </div>
          <div>
            <h4 style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>Fire Emergency</h4>
            <ol style={{ margin: 0, paddingLeft: 'var(--space-4)', color: 'var(--text-secondary)' }}>
              <li>Activate fire alarm</li>
              <li>Use fire extinguisher if trained</li>
              <li>Evacuate the building</li>
              <li>Call emergency services</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Chemical Storage */}
      <div className="info-card">
        <h3 style={{ color: 'var(--warning)' }}>Chemical Storage Guidelines</h3>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Chemical Type</th>
                <th>Storage Requirements</th>
                <th>Incompatibilities</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Flammables</strong></td>
                <td>Flammable cabinet, cool, dry area</td>
                <td>Oxidizers, heat sources</td>
              </tr>
              <tr>
                <td><strong>Acids</strong></td>
                <td>Acid cabinet, secondary containment</td>
                <td>Bases, active metals</td>
              </tr>
              <tr>
                <td><strong>Oxidizers</strong></td>
                <td>Separate storage, cool area</td>
                <td>Organic materials, flammables</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* General Safety Rules */}
      <div className="info-card">
        <h3 style={{ color: 'var(--accent)' }}>General Safety Rules</h3>
        <div className="grid-container" style={{ gridTemplateColumns: '1fr', gap: 'var(--space-2)' }}>
          <div>
            <ul style={{ margin: 0, paddingLeft: 'var(--space-4)', color: 'var(--text-secondary)' }}>
              <li>✓ Never work alone in the laboratory</li>
              <li>✓ No food or drink in lab areas</li>
              <li>✓ Know locations of safety equipment</li>
              <li>✓ Read all SDSs before handling chemicals</li>
              <li>✓ Keep work areas clean and organized</li>
              <li>✓ Report all incidents and near-misses</li>
              <li>✓ Dispose of chemicals properly</li>
              <li>✓ No unauthorized experiments</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="alert alert-danger">
        <h4 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>Emergency Contacts</h4>
        <p style={{ margin: 0 }}>
          <strong>Emergency:</strong> 911<br />
          <strong>Lab Supervisor:</strong> [Insert Number]<br />
          <strong>Environmental Health & Safety:</strong> [Insert Number]
        </p>
      </div>
    </div>
  );
}

export default Safety;
