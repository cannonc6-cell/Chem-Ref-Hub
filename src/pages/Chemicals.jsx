import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/modern.css';
import bundledData from '../data/chemical_data.json';

import '../index.css';

const BASE = import.meta.env.BASE_URL || '/';

const extractTags = (data) => {
	const tags = new Set();
	data.forEach((chem) => {
		if (Array.isArray(chem.tags)) {
			chem.tags.forEach((tag) => tags.add(tag));
		}
	});
	return Array.from(tags);
};

// --- PATCH: Normalize chemical data shape and fix image paths ---
// Helper to normalize chemical data fields
function normalizeChemical(chem) {
	return {
		id: chem.id || chem["CAS"] || chem["Chemical Name"] || chem.name,
		name: chem["Chemical Name"] || chem.name || "",
		formula: chem["Formula"] || chem.formula || "",
		appearance: chem["Appearance"] || chem.appearance || "",
		image: chem.image || `${BASE}chemical-images/${(chem["Chemical Name"] || chem.name || '').replace(/\s+/g, '_')}.jpg`,
		tags: Array.isArray(chem.tags) ? chem.tags : [],
		...chem
	};
}

function Chemicals() {
	const [chemicalData, setChemicalData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [search, setSearch] = useState("");
	const [selectedTag, setSelectedTag] = useState("");
	const [favoritesOnly, setFavoritesOnly] = useState(false);
	const [favorites, setFavorites] = useState(() => {
		try { return JSON.parse(localStorage.getItem('favoriteChemicals') || '[]'); }
		catch { return []; }
	});
	const [alertMsg, setAlertMsg] = useState("");
	const [alertVariant, setAlertVariant] = useState("success");
	const [mergeImport, setMergeImport] = useState(true);
	const [notes, setNotes] = useState(() => {
		// Load notes from localStorage
		try {
			return JSON.parse(localStorage.getItem('chemicalNotes') || '{}');
		} catch {
			return {};
		}
	});

	const [inventory, setInventory] = useState(() => {
		// Load inventory from localStorage
		try {
			return JSON.parse(localStorage.getItem('chemicalInventory') || '{}');
		} catch {
			return {};
		}
	});
const handleInventoryChange = (key, value) => {
	const newInventory = { ...inventory, [key]: value };
	setInventory(newInventory);
	localStorage.setItem('chemicalInventory', JSON.stringify(newInventory));
};

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const res = await fetch(`${BASE}chemical_data.json`);
				if (!res.ok) throw new Error('Network error');
				let data;
				try {
					data = await res.json();
				} catch (jsonErr) {
					if (!cancelled) {
						setAlertVariant('danger');
						setAlertMsg('Received invalid chemical data from server. Using built-in dataset instead.');
					}
					data = bundledData;
				}
				if (!cancelled) {
					// Merge with user-added chemicals from localStorage
					let user = [];
					try {
						user = JSON.parse(localStorage.getItem('userChemicals') || '[]');
						if (!Array.isArray(user)) user = [];
					} catch {
						user = [];
					}
					const { list } = combineChemicals(data, Array.isArray(user) ? user : []);
					setChemicalData(list);
				}
			} catch (err) {
				// Fallback to bundled JSON and surface a clear offline message
				if (!cancelled) {
					let user = [];
					try {
						user = JSON.parse(localStorage.getItem('userChemicals') || '[]');
						if (!Array.isArray(user)) user = [];
					} catch {
						user = [];
					}
					const { list } = combineChemicals(bundledData, user);
					setChemicalData(list);
					setAlertVariant('warning');
					setAlertMsg('Could not reach the server. Loaded built-in chemical data and any local additions.');
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => { cancelled = true; };
	}, []);

// Merge helper (by CAS or name/id)
function combineChemicals(base, additions) {
  const keyOf = (c) => String(c.CAS || c['CAS'] || c.id || c['Chemical Name'] || c.name || '').toLowerCase();
  const map = new Map();
  base.forEach((c) => map.set(keyOf(c), c));
  let added = 0, updated = 0;
  additions.forEach((c) => {
    const k = keyOf(c);
    if (map.has(k)) { map.set(k, { ...map.get(k), ...c }); updated++; }
    else { map.set(k, c); added++; }
  });
  return { list: Array.from(map.values()), added, updated };
}

	// Normalize, compute tags list, and filter by search + tag
	const normalizedChemicals = chemicalData.map(normalizeChemical);
	const allTags = React.useMemo(() => extractTags(normalizedChemicals), [normalizedChemicals]);
	const filteredChemicals = normalizedChemicals.filter((chem) => {
		const matchesSearch = chem.name.toLowerCase().includes(search.toLowerCase());
		const matchesTag = !selectedTag || chem.tags.includes(selectedTag);
		const matchesFav = !favoritesOnly || favorites.includes(chem.id);
		return matchesSearch && matchesTag && matchesFav;
	});

	useEffect(() => {
		document.title = 'Chemicals – ChemRef Hub';
	}, []);

	const toggleFavorite = (id) => {
		setFavorites((prev) => {
			const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
			localStorage.setItem('favoriteChemicals', JSON.stringify(next));
			return next;
		});
	};
	const handleNoteChange = (key, value) => {
		const newNotes = { ...notes, [key]: value };
		setNotes(newNotes);
		localStorage.setItem('chemicalNotes', JSON.stringify(newNotes));
	};

	if (loading) {
		return <div className="container py-4">Loading chemical data...</div>;
	}
	if (error) {
		return <div className="container py-4 text-danger">Error: {error}</div>;
	}

		// Export chemicals as JSON
		const handleExport = () => {
			const dataStr = JSON.stringify(chemicalData, null, 2);
			const blob = new Blob([dataStr], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'chemical_data_export.json';
			a.click();
			URL.revokeObjectURL(url);
			setAlertVariant('success');
			setAlertMsg('Chemical data exported.');
		};

		// Import chemicals from JSON
		const handleImport = (e) => {
			const file = e.target.files[0];
			if (!file) return;
			const reader = new FileReader();
			reader.onload = (evt) => {
				try {
					const imported = JSON.parse(evt.target.result);
					if (Array.isArray(imported)) {
						// basic schema validation: need at least CAS or Chemical Name / name
						const valid = [];
						let invalid = 0;
						for (const item of imported) {
							const hasId = Boolean(item && (item.CAS || item.id || item['Chemical Name'] || item.name));
							if (hasId) valid.push(item); else invalid++;
						}
						if (mergeImport) {
							const { list, added, updated } = combineChemicals(chemicalData, valid);
							setChemicalData(list);
							setAlertVariant(invalid ? 'warning' : 'success');
							setAlertMsg(`Imported ${valid.length} items (skipped ${invalid}). Added ${added}, updated ${updated}.`);
						} else {
							setChemicalData(valid);
							setAlertVariant(invalid ? 'warning' : 'success');
							setAlertMsg(`Replaced dataset with ${valid.length} items (skipped ${invalid}).`);
						}
					} else {
						setAlertVariant('danger');
						setAlertMsg('Invalid file format. Expected an array.');
					}
				} catch {
					setAlertVariant('danger');
					setAlertMsg('Error reading file.');
				}
			};
			reader.readAsText(file);
		};

		return (
			<div className="app-container">
				{alertMsg && (
					<div className={`alert alert-${alertVariant} d-flex justify-content-between align-items-center`} role="alert">
						<span>{alertMsg}</span>
						<button type="button" className="btn-close" aria-label="Close" onClick={() => setAlertMsg("")}></button>
					</div>
				)}
				<div className="page-header">
					<div className="header-content">
						<img src={`${BASE}assets/logo.svg`} alt="Logo" className="app-logo" />
						<h1 className="section-title">Chemical Reference</h1>
					</div>
				</div>
				<div className="search-controls">
					<div className="search-box">
						<input
							type="text"
							className="form-control search-input"
							placeholder="Search by name..."
							aria-label="Search chemicals by name"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<div className="filter-box">
						<select
							className="form-select"
							aria-label="Filter chemicals by tag"
							value={selectedTag}
							onChange={(e) => setSelectedTag(e.target.value)}
						>
							<option value="">All tags</option>
							{allTags.map((t) => (
								<option key={t} value={t}>{t}</option>
							))}
						</select>
					</div>
					<div className="action-buttons">
						<button className="btn btn-primary" onClick={handleExport}>
							Export
						</button>
						<div className="form-check form-switch ms-2">
							<input className="form-check-input" type="checkbox" id="favoritesOnly" checked={favoritesOnly} onChange={(e) => setFavoritesOnly(e.target.checked)} />
							<label className="form-check-label" htmlFor="favoritesOnly">Favorites only</label>
						</div>
						<label className="btn btn-outline-primary" aria-label="Import chemicals from JSON">
							Import
							<input type="file" accept="application/json" aria-label="Import chemicals JSON" style={{ display: 'none' }} onChange={handleImport} />
						</label>
						<div className="form-check ms-2 d-flex align-items-center">
							<input className="form-check-input" type="checkbox" id="mergeImport" checked={mergeImport} onChange={(e) => setMergeImport(e.target.checked)} />
							<label className="form-check-label ms-1" htmlFor="mergeImport">Merge import</label>
						</div>
					</div>
				</div>
					   <div className="chemical-grid">
						   {filteredChemicals.length === 0 ? (
							   <div className="text-center">No chemicals found.</div>
						   ) : (
							   <div className="grid-container">
								   {filteredChemicals.map((chem) => (
									   <Link
										   to={`/chemicals/${encodeURIComponent(chem.id)}`}
										   key={chem.id}
										   className="chemical-card"
									   >
										   <div className="card-image">
											   <img src={chem.image} alt={chem.name || 'Chemical'} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `${BASE}assets/logo.svg`; }} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px 8px 0 0' }} />
										   </div>
										   <div className="card-content">
											   <h3 className="card-title">{chem.name}</h3>
											   <div className="card-formula">{chem.formula}</div>
											   <div className="card-brief">{chem.appearance}</div>
											   <button type="button" className={`btn btn-sm ${favorites.includes(chem.id) ? 'btn-warning' : 'btn-outline-secondary'}`} onClick={(e) => { e.preventDefault(); toggleFavorite(chem.id); }} aria-pressed={favorites.includes(chem.id)} aria-label={favorites.includes(chem.id) ? 'Remove from favorites' : 'Add to favorites'}>
											     {favorites.includes(chem.id) ? '\u2605 Favorite' : '\u2606 Favorite'}
											   </button>
										   </div>
									   </Link>
								   ))}
							   </div>
						   )}
					   </div>
			</div>
		);
}

export default Chemicals;
