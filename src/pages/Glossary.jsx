import React, { useEffect, useState } from 'react';

export default function Glossary() {
  useEffect(() => {
    document.title = 'Glossary – ChemRef Hub';
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  const terms = [
    { term: 'CAS Number', def: 'Unique numerical identifier assigned by the Chemical Abstracts Service (CAS) to every chemical described in the literature.' },
    { term: 'SDS', def: 'Safety Data Sheet. Official document providing hazards, handling, and emergency measures for a chemical.' },
    { term: 'GHS', def: 'Globally Harmonized System of Classification and Labelling of Chemicals.' },
    { term: 'NFPA 704', def: 'Standard hazard rating (Health, Flammability, Reactivity, Special) shown as a diamond.' },
    { term: 'Flash Point', def: 'Lowest temperature at which vapors ignite in air with an ignition source.' },
    { term: 'LD50', def: 'Median lethal dose causing death in 50% of a test population (toxicity measure).' },
    { term: 'Oxidizer', def: 'Substance that can cause or contribute to combustion, often intensifying fire.' },
    { term: 'Corrosive', def: 'Substance that causes irreversible damage to skin or metals on contact.' },
    { term: 'Miscible', def: 'Liquids that mix in all proportions forming a homogeneous solution.' },
    { term: 'PPE', def: 'Personal Protective Equipment such as gloves, goggles, and lab coats.' },
    { term: 'Molarity', def: 'A measure of concentration in terms of moles of solute per liter of solution.' },
    { term: 'pH', def: 'A measure of the acidity or basicity of an aqueous solution.' },
  ];

  const filteredTerms = terms.filter(({ term, def }) =>
    term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    def.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glossary-page" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Glossary</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Common chemistry and safety terms definitions.</p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="search"
            className="form-control"
            placeholder="Search definitions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              paddingLeft: '2.5rem',
              height: '48px',
              fontSize: '1rem',
              borderRadius: 'var(--radius-md)'
            }}
          />
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)'
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {filteredTerms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No terms found matching "{searchTerm}"
          </div>
        ) : (
          filteredTerms.map(({ term, def }) => (
            <div key={term} style={{
              backgroundColor: 'var(--surface)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)'
            }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--primary)' }}>{term}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{def}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
