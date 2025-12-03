import React, { useEffect } from 'react';

function Safety() {
  useEffect(() => {
    document.title = 'Safety – ChemRef Hub';
  }, []);

  return (
    <div className="safety-page" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Laboratory Safety Guidelines</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Essential safety protocols and emergency procedures for chemical handling.</p>
      </div>

      <div style={{ display: 'grid', gap: '2rem' }}>

        {/* Emergency Contacts */}
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          border: '1px solid var(--error-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem'
        }}>
          <h3 style={{ color: 'var(--error)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Emergency Contacts
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Emergency Services</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--error)' }}>911</div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Lab Supervisor</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>[Insert Number]</div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>EH&S Dept</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>[Insert Number]</div>
            </div>
          </div>
        </div>

        {/* PPE */}
        <div style={{
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          padding: '2rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--primary)' }}>Personal Protection Equipment (PPE)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem'
              }}>🥽</div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Eye Protection</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>Always wear appropriate safety goggles or face shields in the lab.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem'
              }}>🧤</div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Hand Protection</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>Use appropriate chemical-resistant gloves for specific chemicals.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem'
              }}>🥼</div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Body Protection</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>Wear lab coats and closed-toe shoes at all times.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Procedures Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

          {/* Emergency Procedures */}
          <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            padding: '2rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Emergency Procedures</h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--warning)' }}>Chemical Spill</h4>
              <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', margin: 0 }}>
                <li style={{ marginBottom: '0.25rem' }}>Alert others in the immediate area.</li>
                <li style={{ marginBottom: '0.25rem' }}>Use spill kits for small, contained spills.</li>
                <li style={{ marginBottom: '0.25rem' }}>Evacuate for large or hazardous spills.</li>
                <li>Contact emergency response immediately.</li>
              </ol>
            </div>

            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--error)' }}>Fire Emergency</h4>
              <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', margin: 0 }}>
                <li style={{ marginBottom: '0.25rem' }}>Activate the nearest fire alarm.</li>
                <li style={{ marginBottom: '0.25rem' }}>Use fire extinguisher only if trained and safe.</li>
                <li style={{ marginBottom: '0.25rem' }}>Evacuate the building via nearest exit.</li>
                <li>Call emergency services from a safe location.</li>
              </ol>
            </div>
          </div>

          {/* Storage Guidelines */}
          <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            padding: '2rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Storage Guidelines</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--error)' }}>Flammables</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Store in dedicated flammable safety cabinets. Keep away from oxidizers and heat sources.</div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--warning)' }}>Acids</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Store in corrosive/acid cabinets. Use secondary containment. Separate from bases and active metals.</div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--primary)' }}>Oxidizers</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Store in a cool, dry area. Keep strictly separate from organic materials and flammables.</div>
              </div>
            </div>
          </div>

        </div>

        {/* General Rules */}
        <div style={{
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          padding: '2rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>General Safety Rules</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
              <li style={{ marginBottom: '0.5rem' }}>Never work alone in the laboratory.</li>
              <li style={{ marginBottom: '0.5rem' }}>No food, drink, or cosmetics in lab areas.</li>
              <li style={{ marginBottom: '0.5rem' }}>Know the locations of all safety equipment (showers, eyewashes).</li>
              <li style={{ marginBottom: '0.5rem' }}>Read all Safety Data Sheets (SDS) before handling chemicals.</li>
            </ul>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
              <li style={{ marginBottom: '0.5rem' }}>Keep work areas clean, organized, and free of clutter.</li>
              <li style={{ marginBottom: '0.5rem' }}>Report all incidents, spills, and near-misses immediately.</li>
              <li style={{ marginBottom: '0.5rem' }}>Dispose of chemical waste in designated containers only.</li>
              <li style={{ marginBottom: '0.5rem' }}>Do not perform unauthorized experiments.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Safety;
