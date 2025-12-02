import React, { useState } from 'react';
import '../styles/modern.css';

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
            // Simple parser for demonstration (handles basic elements and numbers, no parentheses yet for simplicity)
            // A more robust parser would be needed for complex formulas with parentheses

            // Regex to match Element + Count
            const regex = /([A-Z][a-z]*)(\d*)/g;
            let match;
            let totalWeight = 0;
            let parsedElements = [];
            let lastIndex = 0;

            while ((match = regex.exec(currentFormula)) !== null) {
                const element = match[1];
                const count = match[2] ? parseInt(match[2]) : 1;

                if (!atomicWeights[element]) {
                    throw new Error(`Unknown element: ${element}`);
                }

                totalWeight += atomicWeights[element] * count;
                parsedElements.push(`${element}${count > 1 ? count : ''}`);
                lastIndex = match.index + match[0].length;
            }

            if (lastIndex !== currentFormula.length) {
                // Check for parentheses or invalid chars
                if (currentFormula.includes('(') || currentFormula.includes(')')) {
                    // Basic parenthesis handling could be added here, but for now:
                    throw new Error('Complex formulas with parentheses are not yet supported in this version.');
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
        <div className="card shadow-sm">
            <div className="card-header bg-white">
                <h5 className="mb-0">Molecular Weight Calculator</h5>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <label htmlFor="formulaInput" className="form-label">Chemical Formula</label>
                    <input
                        type="text"
                        className="form-control"
                        id="formulaInput"
                        placeholder="e.g. H2O, C6H12O6, NaCl"
                        value={formula}
                        onChange={(e) => setFormula(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && calculateWeight()}
                    />
                    <div className="form-text">Enter elements with correct capitalization (e.g. NaCl, not nacl).</div>
                </div>
                <button className="btn btn-primary w-100" onClick={calculateWeight}>Calculate</button>

                {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}

                {result && (
                    <div className="alert alert-success mt-3 mb-0 text-center">
                        <div className="small text-muted mb-1">Molar Mass</div>
                        <div className="fs-2 fw-bold">{result} <span className="fs-5 fw-normal">g/mol</span></div>
                    </div>
                )}
            </div>
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

        // Check which value is missing
        if (!c1 && v1 && c2 && v2) {
            setResult(`Initial Concentration (C1) = ${(valC2 * valV2 / valV1).toFixed(3)}`);
        } else if (c1 && !v1 && c2 && v2) {
            setResult(`Initial Volume (V1) = ${(valC2 * valV2 / valC1).toFixed(3)}`);
        } else if (c1 && v1 && !c2 && v2) {
            setResult(`Final Concentration (C2) = ${(valC1 * valV1 / valV2).toFixed(3)}`);
        } else if (c1 && v1 && c2 && !v2) {
            setResult(`Final Volume (V2) = ${(valC1 * valV1 / valC2).toFixed(3)}`);
        } else {
            setResult('Please enter exactly 3 values to calculate the 4th.');
        }
    };

    const clear = () => {
        setC1('');
        setV1('');
        setC2('');
        setV2('');
        setResult('');
    };

    return (
        <div className="card shadow-sm h-100">
            <div className="card-header bg-white">
                <h5 className="mb-0">Dilution Calculator (C₁V₁ = C₂V₂)</h5>
            </div>
            <div className="card-body">
                <div className="row g-3">
                    <div className="col-6">
                        <label className="form-label">Initial Conc. (C₁)</label>
                        <input type="number" className="form-control" value={c1} onChange={(e) => setC1(e.target.value)} placeholder="C₁" />
                    </div>
                    <div className="col-6">
                        <label className="form-label">Initial Vol. (V₁)</label>
                        <input type="number" className="form-control" value={v1} onChange={(e) => setV1(e.target.value)} placeholder="V₁" />
                    </div>
                    <div className="col-6">
                        <label className="form-label">Final Conc. (C₂)</label>
                        <input type="number" className="form-control" value={c2} onChange={(e) => setC2(e.target.value)} placeholder="C₂" />
                    </div>
                    <div className="col-6">
                        <label className="form-label">Final Vol. (V₂)</label>
                        <input type="number" className="form-control" value={v2} onChange={(e) => setV2(e.target.value)} placeholder="V₂" />
                    </div>
                </div>

                <div className="d-flex gap-2 mt-3">
                    <button className="btn btn-primary flex-grow-1" onClick={calculate}>Calculate</button>
                    <button className="btn btn-outline-secondary" onClick={clear}>Clear</button>
                </div>

                {result && (
                    <div className={`alert mt-3 mb-0 text-center ${result.includes('Please') ? 'alert-warning' : 'alert-success'}`}>
                        <div className="fw-bold">{result}</div>
                    </div>
                )}
            </div>
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
            // Molarity = (Mass / MW) / Volume(L)
            // Assuming Volume is in mL, so convert to L: v / 1000
            const mol = (m / w) / (v / 1000);
            setMolarity(mol.toFixed(4));
        } else {
            setMolarity(null);
        }
    };

    return (
        <div className="card shadow-sm h-100">
            <div className="card-header bg-white">
                <h5 className="mb-0">Molarity Converter</h5>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <label className="form-label">Mass (g)</label>
                    <input type="number" className="form-control" value={mass} onChange={(e) => setMass(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Volume (mL)</label>
                    <input type="number" className="form-control" value={vol} onChange={(e) => setVol(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Molecular Weight (g/mol)</label>
                    <input type="number" className="form-control" value={mw} onChange={(e) => setMw(e.target.value)} />
                </div>

                <button className="btn btn-primary w-100 mb-3" onClick={calculate}>Calculate Molarity</button>

                {molarity !== null && (
                    <div className="alert alert-success text-center mb-0">
                        <div className="small text-muted">Concentration</div>
                        <div className="fs-3 fw-bold">{molarity} M</div>
                    </div>
                )}
            </div>
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
        <div className="card shadow-sm h-100">
            <div className="card-header bg-white">
                <h5 className="mb-0">pH Calculator</h5>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <label className="form-label">[H+] Concentration (M)</label>
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
                    <div className={`alert text-center mb-0 ${ph < 7 ? 'alert-danger' : ph > 7 ? 'alert-primary' : 'alert-success'}`}>
                        <div className="small text-muted">pH Value</div>
                        <div className="fs-3 fw-bold">{ph}</div>
                        <div className="small">{ph < 7 ? 'Acidic' : ph > 7 ? 'Basic' : 'Neutral'}</div>
                    </div>
                )}
            </div>
        </div>
    );
}

function Calculators() {
    return (
        <div className="app-container">
            <div className="page-header">
                <div className="header-content">
                    <h1 className="section-title">Lab Calculators</h1>
                </div>
                <p className="lead mb-0">Essential tools for chemical calculations.</p>
            </div>

            <div className="row g-4">
                <div className="col-12 col-md-6 col-lg-4">
                    <MolecularWeightCalculator />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <DilutionCalculator />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <ConcentrationConverter />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <PHCalculator />
                </div>
            </div>
        </div>
    );
}

export default Calculators;
