import React, { useState, useEffect } from 'react';

function MolecularWeightCalculator() {
    const [formula, setFormula] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    // Atomic weights of common elements
    const atomicWeights = {
        H: 1.008, He: 4.003, Li: 6.941, Be: 9.012, B: 10.811, C: 12.011, N: 14.007, O: 15.999, F: 18.998, Ne: 20.180,
        Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.086, P: 30.974, S: 32.065, Cl: 35.453, K: 39.098, Ca: 40.078,
        Sc: 44.956, Ti: 47.867, V: 50.942, Cr: 51.996, Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546,
        Zn: 65.38, Ga: 69.723, Ge: 72.64, As: 74.922, Se: 78.96, Br: 79.904, Kr: 83.798, Rb: 85.468, Sr: 87.62,
        Y: 88.906, Zr: 91.224, Nb: 92.906, Mo: 95.96, Tc: 98, Ru: 101.07, Rh: 102.91, Pd: 106.42, Ag: 107.87,
        Cd: 112.41, In: 114.82, Sn: 118.71, Sb: 121.76, Te: 127.60, I: 126.90, Xe: 131.29, Cs: 132.91, Ba: 137.33,
        La: 138.91, Ce: 140.12, Pr: 140.91, Nd: 144.24, Pm: 145, Sm: 150.36, Eu: 151.96, Gd: 157.25, Tb: 158.93,
        Dy: 162.50, Ho: 164.93, Er: 167.26, Tm: 168.93, Yb: 173.05, Lu: 174.97, Hf: 178.49, Ta: 180.95, W: 183.84,
        Re: 186.21, Os: 190.23, Ir: 192.22, Pt: 195.08, Au: 196.97, Hg: 200.59, Tl: 204.38, Pb: 207.2, Bi: 208.98,
        Po: 209, At: 210, Rn: 222, Fr: 223, Ra: 226, Ac: 227, Th: 232.04, Pa: 231.04, U: 238.03, Np: 237, Pu: 244,
        Am: 243, Cm: 247, Bk: 247, Cf: 251, Es: 252, Fm: 257, Md: 258, No: 259, Lr: 262, Rf: 267, Db: 268, Sg: 271,
        Bh: 272, Hs: 270, Mt: 276, Ds: 281, Rg: 280, Cn: 285, Nh: 284, Fl: 289, Mc: 288, Lv: 293, Ts: 294, Og: 294
    };

    const calculateWeight = () => {
        if (!formula.trim()) {
            setError('Please enter a chemical formula');
            setResult(null);
            return;
        }

        try {
            let currentFormula = formula.trim();
            const regex = /([A-Z][a-z]*)(\d*)/g;
            let match;
            let totalWeight = 0;
            let lastIndex = 0;

            while ((match = regex.exec(currentFormula)) !== null) {
                const element = match[1];
                const count = match[2] ? parseInt(match[2]) : 1;

                if (!atomicWeights[element]) {
                    throw new Error(`Unknown element: ${element}`);
                }

                totalWeight += atomicWeights[element] * count;
                lastIndex = match.index + match[0].length;
            }

            if (lastIndex !== currentFormula.length) {
                if (currentFormula.includes('(') || currentFormula.includes(')')) {
                    throw new Error('Complex formulas with parentheses are not yet supported.');
                }
                throw new Error('Invalid characters in formula');
            }

            setResult(totalWeight.toFixed(3));
            setError('');
        } catch (err) {
            setError(err.message);
            setResult(null);
        }
    };

    return (
        <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            padding: '1.5rem',
            height: '100%'
        }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Molecular Weight Calculator
            </h3>
            <div className="mb-3">
                <label className="form-label" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Chemical Formula</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. H2O, C6H12O6"
                    value={formula}
                    onChange={(e) => setFormula(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && calculateWeight()}
                />
                <div className="form-text">Case sensitive (e.g. NaCl)</div>
            </div>
            <button className="btn btn-primary w-100 mb-3" onClick={calculateWeight}>Calculate</button>

            {error && <div className="alert alert-danger mb-0 py-2">{error}</div>}

            {result && (
                <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Molar Mass</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {result} <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-primary)' }}>g/mol</span>
                    </div>
                </div>
            )}
        </div>
    );
}

function DilutionCalculator() {
    const [c1, setC1] = useState('');
    const [v1, setV1] = useState('');
    const [c2, setC2] = useState('');
    const [v2, setV2] = useState('');
    const [result, setResult] = useState('');

    const calculate = () => {
        const valC1 = parseFloat(c1);
        const valV1 = parseFloat(v1);
        const valC2 = parseFloat(c2);
        const valV2 = parseFloat(v2);

        if (!c1 && v1 && c2 && v2) {
            setResult(`Initial Concentration (C1) = ${(valC2 * valV2 / valV1).toFixed(3)}`);
        } else if (c1 && !v1 && c2 && v2) {
            setResult(`Initial Volume (V1) = ${(valC2 * valV2 / valC1).toFixed(3)}`);
        } else if (c1 && v1 && !c2 && v2) {
            setResult(`Final Concentration (C2) = ${(valC1 * valV1 / valV2).toFixed(3)}`);
        } else if (c1 && v1 && c2 && !v2) {
            setResult(`Final Volume (V2) = ${(valC1 * valV1 / valC2).toFixed(3)}`);
        } else {
            setResult('Please enter exactly 3 values.');
        }
    };

    const clear = () => {
        setC1(''); setV1(''); setC2(''); setV2(''); setResult('');
    };

    return (
        <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            padding: '1.5rem',
            height: '100%'
        }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Dilution Calculator (C₁V₁ = C₂V₂)
            </h3>
            <div className="row g-2 mb-3">
                <div className="col-6">
                    <label className="form-label small">Initial Conc. (C₁)</label>
                    <input type="number" className="form-control" value={c1} onChange={(e) => setC1(e.target.value)} placeholder="C₁" />
                </div>
                <div className="col-6">
                    <label className="form-label small">Initial Vol. (V₁)</label>
                    <input type="number" className="form-control" value={v1} onChange={(e) => setV1(e.target.value)} placeholder="V₁" />
                </div>
                <div className="col-6">
                    <label className="form-label small">Final Conc. (C₂)</label>
                    <input type="number" className="form-control" value={c2} onChange={(e) => setC2(e.target.value)} placeholder="C₂" />
                </div>
                <div className="col-6">
                    <label className="form-label small">Final Vol. (V₂)</label>
                    <input type="number" className="form-control" value={v2} onChange={(e) => setV2(e.target.value)} placeholder="V₂" />
                </div>
            </div>

            <div className="d-flex gap-2 mb-3">
                <button className="btn btn-primary flex-grow-1" onClick={calculate}>Calculate</button>
                <button className="btn btn-outline-secondary" onClick={clear}>Clear</button>
            </div>

            {result && (
                <div className={`alert mb-0 text-center py-2 ${result.includes('Please') ? 'alert-warning' : 'alert-success'}`}>
                    <div className="fw-bold small">{result}</div>
                </div>
            )}
        </div>
    );
}

function ConcentrationConverter() {
    const [mass, setMass] = useState('');
    const [vol, setVol] = useState('');
    const [mw, setMw] = useState('');
    const [molarity, setMolarity] = useState(null);

    const calculate = () => {
        const m = parseFloat(mass);
        const v = parseFloat(vol);
        const w = parseFloat(mw);

        if (m && v && w) {
            const mol = (m / w) / (v / 1000);
            setMolarity(mol.toFixed(4));
        } else {
            setMolarity(null);
        }
    };

    return (
        <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            padding: '1.5rem',
            height: '100%'
        }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Molarity Converter
            </h3>
            <div className="mb-2">
                <label className="form-label small">Mass (g)</label>
                <input type="number" className="form-control" value={mass} onChange={(e) => setMass(e.target.value)} />
            </div>
            <div className="mb-2">
                <label className="form-label small">Volume (mL)</label>
                <input type="number" className="form-control" value={vol} onChange={(e) => setVol(e.target.value)} />
            </div>
            <div className="mb-3">
                <label className="form-label small">Molecular Weight (g/mol)</label>
                <input type="number" className="form-control" value={mw} onChange={(e) => setMw(e.target.value)} />
            </div>

            <button className="btn btn-primary w-100 mb-3" onClick={calculate}>Calculate Molarity</button>

            {molarity !== null && (
                <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Concentration</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {molarity} <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-primary)' }}>M</span>
                    </div>
                </div>
            )}
        </div>
    );
}

function PHCalculator() {
    const [hIon, setHIon] = useState('');
    const [ph, setPh] = useState(null);

    const calculate = () => {
        const h = parseFloat(hIon);
        if (h > 0) {
            const val = -Math.log10(h);
            setPh(val.toFixed(2));
        } else {
            setPh(null);
        }
    };

    return (
        <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            padding: '1.5rem',
            height: '100%'
        }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                pH Calculator
            </h3>
            <div className="mb-3">
                <label className="form-label small">[H+] Concentration (M)</label>
                <input
                    type="number"
                    className="form-control"
                    value={hIon}
                    onChange={(e) => setHIon(e.target.value)}
                    placeholder="e.g. 0.001"
                    step="any"
                />
            </div>

            <button className="btn btn-primary w-100 mb-3" onClick={calculate}>Calculate pH</button>

            {ph !== null && (
                <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>pH Value</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: ph < 7 ? 'var(--error)' : ph > 7 ? 'var(--primary)' : 'var(--success)' }}>
                        {ph}
                    </div>
                    <div className="small text-muted">{ph < 7 ? 'Acidic' : ph > 7 ? 'Basic' : 'Neutral'}</div>
                </div>
            )}
        </div>
    );
}

function Calculators() {
    useEffect(() => {
        document.title = 'Calculators – ChemRef Hub';
    }, []);

    return (
        <div className="calculators-page" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Lab Calculators</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Essential tools for common chemical calculations and conversions.</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
            }}>
                <MolecularWeightCalculator />
                <DilutionCalculator />
                <ConcentrationConverter />
                <PHCalculator />
            </div>
        </div>
    );
}

export default Calculators;
