import React from 'react';

export default function Glossary() {
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
  return (
    <div className="app-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="section-title">Glossary</h1>
        </div>
      </div>
      <div className="data-table-container">
        <dl className="mb-0">
          {terms.map(({ term, def }) => (
            <div className="mb-2" key={term}>
              <dt className="fw-bold subheader-accent">{term}</dt>
              <dd className="mb-0 text-muted">{def}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
