import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../styles/modern.css';
import '../index.css';
import { useChemicals } from '../hooks/useChemicals';

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

function Chemicals() {
	const { chemicals, loading, error, favorites, toggleFavorite, addChemical } = useChemicals();

	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTag, setSelectedTag] = useState("");
	const [favoritesOnly, setFavoritesOnly] = useState(false);
	const [alertMsg, setAlertMsg] = useState("");
	const [alertVariant, setAlertVariant] = useState("success");
	const [mergeImport, setMergeImport] = useState(true);

	// Extract tags from the loaded chemicals
	const allTags = useMemo(() => extractTags(chemicals), [chemicals]);

	// Filter chemicals using local search
	const filteredChemicals = useMemo(() => {
		return chemicals.filter((chem) => {
			const matchesSearch = chem.name.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesTag = !selectedTag || chem.tags.includes(selectedTag);
			const matchesFav = !favoritesOnly || favorites.includes(chem.id);
			return matchesSearch && matchesTag && matchesFav;
		});
	}, [chemicals, searchTerm, selectedTag, favoritesOnly, favorites]);

	useEffect(() => {
		document.title = 'Chemicals – ChemRef Hub';
	}, []);

	// Export chemicals as JSON
	const handleExport = () => {
		const dataStr = JSON.stringify(chemicals, null, 2);
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
					let addedCount = 0;
					let updatedCount = 0;

					// Basic validation
					const validItems = imported.filter(item =>
						item && (item.CAS || item.id || item['Chemical Name'] || item.name)
					);

					if (mergeImport) {
						// For merge, we just add/update each item via the hook
						// Note: This might trigger many re-renders if not batched, 
						// but for this scale it's acceptable.
						validItems.forEach(item => {
							// We treat import as "adding/updating" user chemicals
							addChemical(item);
							addedCount++;
						});
						setAlertVariant('success');
						setAlertMsg(`Imported ${validItems.length} items.`);
					} else {
						// Replace is tricky with the current hook structure (which merges base + user).
						// "Replace" usually implies clearing user data and setting new data.
						// For now, we'll warn that replace isn't fully supported or just merge.
						validItems.forEach(item => addChemical(item));
						setAlertVariant('warning');
						setAlertMsg(`Imported ${validItems.length} items (Replace mode acted as Merge).`);
					}
				} else {
					setAlertVariant('danger');
					setAlertMsg('Invalid file format. Expected an array.');
				}
			} catch (err) {
				console.error(err);
				setAlertVariant('danger');
				setAlertMsg('Error reading file.');
			}
		};
		reader.readAsText(file);
	};

	if (loading) {
		return <div className="container py-4">Loading chemical data...</div>;
	}
	if (error) {
		return <div className="container py-4 text-danger">Error: {error}</div>;
	}

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
				<div className="filter-box">
					<input
						type="search"
						className="form-control"
						placeholder="Search chemicals..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						style={{ flex: 1 }}
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
					<button
						className={`btn ${favoritesOnly ? 'btn-primary' : 'btn-outline-primary'}`}
						onClick={() => setFavoritesOnly(!favoritesOnly)}
					>
						{favoritesOnly ? '⭐ Favorites' : '☆ Show Favorites'}
					</button>
					<button className="btn btn-outline-primary" onClick={handleExport}>
						Export JSON
					</button>
					<label className="btn btn-outline-primary" style={{ cursor: 'pointer', margin: 0 }}>
						Import JSON
						<input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
					</label>
				</div>
			</div>
			<div className="chemical-grid">
				{filteredChemicals.length === 0 ? (
					<div className="text-center">No chemicals found.</div>
				) : (
					filteredChemicals.map((chem) => (
						<Link
							to={`/chemicals/${encodeURIComponent(chem.id)}`}
							key={chem.id}
							className="chemical-card"
						>
							<div className="card-image">
								<img
									src={chem.image}
									alt={chem.name || 'Chemical'}
									loading="lazy"
									onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `${BASE}assets/logo.svg`; }}
									style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
								/>
							</div>
							<div className="card-content">
								<h3 className="card-title">{chem.name}</h3>
								<div className="card-formula">{chem.formula}</div>
								<div className="card-brief">{chem.appearance}</div>
								<button
									type="button"
									className={`btn btn-sm ${favorites.includes(chem.id) ? 'btn-warning' : 'btn-outline-secondary'}`}
									onClick={(e) => { e.preventDefault(); toggleFavorite(chem.id); }}
									aria-pressed={favorites.includes(chem.id)}
									aria-label={favorites.includes(chem.id) ? 'Remove from favorites' : 'Add to favorites'}
								>
									{favorites.includes(chem.id) ? '\u2605 Favorite' : '\u2606 Favorite'}
								</button>
							</div>
						</Link>
					))
				)}
			</div>
		</div>
	);
}

export default Chemicals;
