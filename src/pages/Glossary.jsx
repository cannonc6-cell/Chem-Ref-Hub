import React, { useEffect, useState } from 'react';
import '../styles/modern.css';

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
  ];

  const filteredTerms = terms.filter(({ term, def }) =>
    term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    def.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="section-title">Glossary</h1>
        </div>
        <p className="lead mb-0" style={{ position: 'relative', zIndex: 1, marginTop: 'var(--space-2)' }}>
          Common chemistry and safety terms
        </p>
      </div>

      <div className="search-controls" style={{ marginBottom: 'var(--space-4)' }}>
        <input
          type="search"
          className="form-control"
          placeholder="Search terms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      <div className="grid-container" style={{ gridTemplateColumns: '1fr' }}>
        {filteredTerms.length === 0 ? (
          <div className="info-card" style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>No terms found matching "{searchTerm}"</p>
          </div>
        ) : (
          filteredTerms.map(({ term, def }) => (
            <div className="info-card" key={term}>
              <h3>{term}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{def}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
