import React from 'react';
import '../styles/modern.css';

function Safety() {
  return (
    <div className="app-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="section-title">Laboratory Safety Guidelines</h1>
        </div>
      </div>
      
      {/* Personal Protection Equipment */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h3 className="h5 mb-0 subheader-accent">Personal Protection Equipment (PPE)</h3>
        </div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <strong>Eye Protection:</strong> Always wear appropriate safety goggles or face shields
            </li>
            <li className="list-group-item">
              <strong>Hand Protection:</strong> Use appropriate gloves for chemical handling
            </li>
            <li className="list-group-item">
              <strong>Body Protection:</strong> Wear lab coats and closed-toe shoes
            </li>
          </ul>
        </div>
      </div>

      {/* Emergency Procedures */}
      <div className="card mb-4">
        <div className="card-header bg-danger text-white">
          <h3 className="h5 mb-0 subheader-accent">Emergency Procedures</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h4 className="h6 subheader-accent">Chemical Spill</h4>
              <ol className="list-unstyled">
                <li>1. Alert others in the area</li>
                <li>2. Use spill kits for small spills</li>
                <li>3. Evacuate for large spills</li>
                <li>4. Contact emergency response</li>
              </ol>
            </div>
            <div className="col-md-6">
              <h4 className="h6 subheader-accent">Fire Emergency</h4>
              <ol className="list-unstyled">
                <li>1. Activate fire alarm</li>
                <li>2. Use fire extinguisher if trained</li>
                <li>3. Evacuate the building</li>
                <li>4. Call emergency services</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Chemical Storage */}
      <div className="card mb-4">
        <div className="card-header bg-warning">
          <h3 className="h5 mb-0 subheader-accent">Chemical Storage Guidelines</h3>
        </div>
        <div className="card-body">
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
                  <td>Flammables</td>
                  <td>Flammable cabinet, cool, dry area</td>
                  <td>Oxidizers, heat sources</td>
                </tr>
                <tr>
                  <td>Acids</td>
                  <td>Acid cabinet, secondary containment</td>
                  <td>Bases, active metals</td>
                </tr>
                <tr>
                  <td>Oxidizers</td>
                  <td>Separate storage, cool area</td>
                  <td>Organic materials, flammables</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* General Safety Rules */}
      <div className="card">
        <div className="card-header bg-info text-white">
          <h3 className="h5 mb-0 subheader-accent">General Safety Rules</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <ul className="list-unstyled">
                <li>✓ Never work alone in the laboratory</li>
                <li>✓ No food or drink in lab areas</li>
                <li>✓ Know locations of safety equipment</li>
                <li>✓ Read all SDSs before handling chemicals</li>
              </ul>
            </div>
            <div className="col-md-6">
              <ul className="list-unstyled">
                <li>✓ Keep work areas clean and organized</li>
                <li>✓ Report all incidents and near-misses</li>
                <li>✓ Dispose of chemicals properly</li>
                <li>✓ No unauthorized experiments</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="alert alert-info mt-4" role="alert">
        <h4 className="alert-heading subheader-accent">Emergency Contacts</h4>
        <p className="mb-0">
          Emergency: 911<br />
          Lab Supervisor: [Insert Number]<br />
          Environmental Health & Safety: [Insert Number]
        </p>
      </div>
    </div>
  );
}

export default Safety;
