import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import '../styles/modern.css';
import '../index.css';
import { useChemicals } from '../hooks/useChemicals';
import { useCompare } from '../hooks/useCompare';
import CompareModal from '../components/CompareModal';
import SkeletonCard from '../components/SkeletonCard';
import BarcodeScanner from '../components/BarcodeScanner';

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
	const [sortBy, setSortBy] = useState("name"); // name, formula, dateAdded
	const [selectedChemicals, setSelectedChemicals] = useState(new Set());
	const [isSelectionMode, setIsSelectionMode] = useState(false);
	const [showCompareModal, setShowCompareModal] = useState(false);
	const { compareList, addToCompare, removeFromCompare } = useCompare();
	const [alertMsg, setAlertMsg] = useState("");
	const [alertVariant, setAlertVariant] = useState("success");
	const [mergeImport, setMergeImport] = useState(true);
	const [exportFormat, setExportFormat] = useState('csv'); // csv, json, pdf, excel
	const [exportScope, setExportScope] = useState('filtered'); // filtered, favorites, selected
	const [showScanner, setShowScanner] = useState(false);

	// Extract tags from the loaded chemicals
	const allTags = useMemo(() => extractTags(chemicals), [chemicals]);

	// Filter and sort chemicals
	const filteredChemicals = useMemo(() => {
		const filtered = chemicals.filter((chem) => {
			const term = searchTerm.toLowerCase();
			const matchesSearch =
				(chem.name || '').toLowerCase().includes(term) ||
				(chem.formula || '').toLowerCase().includes(term) ||
				(chem.CAS || '').toLowerCase().includes(term) ||
				(chem.appearance || '').toLowerCase().includes(term) ||
				(chem.description || '').toLowerCase().includes(term);

			const matchesTag = !selectedTag || chem.tags.includes(selectedTag);
			const matchesFav = !favoritesOnly || favorites.includes(chem.id);
			return matchesSearch && matchesTag && matchesFav;
		});

		// Sort the filtered results
		const sorted = [...filtered].sort((a, b) => {
			if (sortBy === 'name') {
				return (a.name || '').localeCompare(b.name || '');
			} else if (sortBy === 'formula') {
				return (a.formula || '').localeCompare(b.formula || '');
			} else if (sortBy === 'dateAdded') {
				// Assuming newer items have higher IDs or timestamps
				return (b.id || 0) - (a.id || 0);
			}
			return 0;
		});

		return sorted;
	}, [chemicals, searchTerm, selectedTag, favoritesOnly, favorites, sortBy]);

	useEffect(() => {
		document.title = 'Chemicals – ChemRef Hub';

		// Keyboard shortcuts
		const handleKeyDown = (e) => {
			// / to focus search
			if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
				e.preventDefault();
				const searchInput = document.querySelector('input[type="search"]');
				if (searchInput) searchInput.focus();
			}
			// Esc to clear search if focused
			if (e.key === 'Escape' && document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'search') {
				setSearchTerm('');
				document.activeElement.blur();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	// Helper to get chemicals for export based on scope
	const getExportChemicals = () => {
		if (exportScope === 'favorites') {
			return chemicals.filter(c => favorites.includes(c.id));
		}
		if (exportScope === 'selected') {
			return chemicals.filter(c => selectedChemicals.has(c.id));
		}
		// default: filtered list
		return filteredChemicals;
	};

	// Export chemicals as JSON
	const handleExportJSON = () => {
		const exportList = getExportChemicals();
		if (!exportList.length) {
			setAlertVariant('warning');
			setAlertMsg('No chemicals to export for the chosen options.');
			return;
		}

		const dataStr = JSON.stringify(exportList, null, 2);
		const blob = new Blob([dataStr], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'chemical_data_export.json';
		a.click();
		URL.revokeObjectURL(url);
		setAlertVariant('success');
		setAlertMsg('Chemical data exported as JSON.');
	};

	// Export chemicals as CSV
	const handleExportCSV = () => {
		const exportList = getExportChemicals();
		if (!exportList.length) {
			setAlertVariant('warning');
			setAlertMsg('No chemicals to export for the chosen options.');
			return;
		}

		// Define headers
		const headers = ['Name', 'Formula', 'CAS', 'Appearance', 'Tags'];

		// Convert data to CSV rows
		const rows = exportList.map(chem => {
			return [
				`"${(chem.name || '').replace(/"/g, '""')}"`,
				`"${(chem.formula || '').replace(/"/g, '""')}"`,
				`"${(chem.CAS || '').replace(/"/g, '""')}"`,
				`"${(chem.appearance || '').replace(/"/g, '""')}"`,
				`"${(Array.isArray(chem.tags) ? chem.tags.join(', ') : '').replace(/"/g, '""')}"`
			].join(',');
		});

		const csvContent = [headers.join(','), ...rows].join('\n');
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'chemical_data_export.csv';
		a.click();
		URL.revokeObjectURL(url);
		setAlertVariant('success');
		setAlertMsg(`Exported ${exportList.length} chemicals as CSV.`);
	};

	// Export chemicals as Excel-compatible CSV (.xls)
	const handleExportExcel = () => {
		const exportList = getExportChemicals();
		if (!exportList.length) {
			setAlertVariant('warning');
			setAlertMsg('No chemicals to export for the chosen options.');
			return;
		}

		// Define headers
		const headers = ['Name', 'Formula', 'CAS', 'Appearance', 'Tags'];

		// Convert data to CSV rows
		const rows = exportList.map(chem => {
			return [
				`"${(chem.name || '').replace(/"/g, '""')}"`,
				`"${(chem.formula || '').replace(/"/g, '""')}"`,
				`"${(chem.CAS || '').replace(/"/g, '""')}"`,
				`"${(chem.appearance || '').replace(/"/g, '""')}"`,
				`"${(Array.isArray(chem.tags) ? chem.tags.join(', ') : '').replace(/"/g, '""')}"`
			].join(',');
		});

		const csvContent = [headers.join(','), ...rows].join('\n');
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'chemical_data_export.xls'; // Excel-compatible
		a.click();
		URL.revokeObjectURL(url);
		setAlertVariant('success');
		setAlertMsg(`Exported ${exportList.length} chemicals as Excel-compatible file.`);
	};

	// Export chemicals as PDF
	const handleExportPDF = () => {
		const exportList = getExportChemicals();
		if (!exportList.length) {
			setAlertVariant('warning');
			setAlertMsg('No chemicals to export for the chosen options.');
			return;
		}

		const doc = new jsPDF({ orientation: 'landscape' });
		const headers = ['Name', 'Formula', 'CAS', 'Appearance', 'Tags'];
		const rows = exportList.map(chem => [
			chem.name || '',
			chem.formula || '',
			chem.CAS || '',
			chem.appearance || '',
			Array.isArray(chem.tags) ? chem.tags.join(', ') : ''
		]);

		let x = 10;
		let y = 15;
		const lineHeight = 7;
		const maxWidth = doc.internal.pageSize.getWidth() - 20;

		// Simple header row
		doc.setFontSize(12);
		doc.text('ChemRef Hub - Chemical Export', 10, 10);
		doc.setFontSize(10);
		doc.text(headers.join(' | '), x, y);
		y += lineHeight;

		rows.forEach(row => {
			const line = row.join(' | ');
			const split = doc.splitTextToSize(line, maxWidth);
			if (y + split.length * lineHeight > doc.internal.pageSize.getHeight() - 10) {
				doc.addPage();
				y = 15;
			}
			split.forEach(l => {
				doc.text(l, x, y);
				y += lineHeight;
			});
		});

		doc.save('chemical_data_export.pdf');
		setAlertVariant('success');
		setAlertMsg(`Exported ${exportList.length} chemicals as PDF.`);
	};

	// Toggle selection of a chemical
	const toggleSelection = (id) => {
		const newSelection = new Set(selectedChemicals);
		if (newSelection.has(id)) {
			newSelection.delete(id);
		} else {
			newSelection.add(id);
		}
		setSelectedChemicals(newSelection);
	};

	// Toggle selection mode
	const toggleSelectionMode = () => {
		setIsSelectionMode(!isSelectionMode);
		setSelectedChemicals(new Set());
	};

	// Select all filtered chemicals
	const selectAll = () => {
		if (selectedChemicals.size === filteredChemicals.length) {
			setSelectedChemicals(new Set());
		} else {
			const newSelection = new Set();
			filteredChemicals.forEach(c => newSelection.add(c.id));
			setSelectedChemicals(newSelection);
		}
	};

	// Export selected chemicals as CSV
	const handleExportSelectedCSV = () => {
		if (selectedChemicals.size === 0) return;

		const selected = chemicals.filter(c => selectedChemicals.has(c.id));

		// Define headers
		const headers = ['Name', 'Formula', 'CAS', 'Appearance', 'Tags'];

		// Convert data to CSV rows
		const rows = selected.map(chem => {
			return [
				`"${(chem.name || '').replace(/"/g, '""')}"`,
				`"${(chem.formula || '').replace(/"/g, '""')}"`,
				`"${(chem.CAS || '').replace(/"/g, '""')}"`,
				`"${(chem.appearance || '').replace(/"/g, '""')}"`,
				`"${(Array.isArray(chem.tags) ? chem.tags.join(', ') : '').replace(/"/g, '""')}"`
			].join(',');
		});

		const csvContent = [headers.join(','), ...rows].join('\n');
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'selected_chemicals_export.csv';
		a.click();
		URL.revokeObjectURL(url);
		setAlertVariant('success');
		setAlertMsg(`Exported ${selected.length} selected chemicals.`);
		setIsSelectionMode(false);
		setSelectedChemicals(new Set());
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
		return (
			<div className="app-container">
				<div className="page-header">
					<div className="header-content">
						<img src={`${BASE}assets/logo.svg`} alt="Logo" className="app-logo" />
						<h1 className="section-title">Chemical Reference</h1>
					</div>
				</div>
				<div className="chemical-grid">
					{Array.from({ length: 8 }).map((_, index) => (
						<SkeletonCard key={index} />
					))}
				</div>
			</div>
		);
	}
	if (error) {
		return <div className="container py-4 text-danger">Error: {error}</div>;
	}

	return (
		<div className="app-container">
			{showScanner && (
				<BarcodeScanner
					onDetected={(code) => {
						// Try to find a chemical by CAS or id matching the scanned code
						const lower = code.toLowerCase();
						const match = chemicals.find(c =>
							(String(c.CAS || '')).toLowerCase() === lower ||
							(String(c.id || '')).toLowerCase() === lower
						);
						if (match) {
							setSearchTerm(match.CAS || match.id || '');
							setAlertVariant('success');
							setAlertMsg(`Found chemical for code: ${code}`);
						} else {
							setAlertVariant('warning');
							setAlertMsg(`No chemical found for code: ${code}`);
						}
						setShowScanner(false);
					}}
					onClose={() => setShowScanner(false)}
				/>
			)}
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
						placeholder="Search by name, formula, CAS..."
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
				<div className="filter-box">
					<select
						className="form-select"
						aria-label="Sort chemicals"
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value)}
					>
						<option value="name">Sort by Name</option>
						<option value="formula">Sort by Formula</option>
						<option value="dateAdded">Sort by Date Added</option>
					</select>
				</div>
				<div className="action-buttons">
					<div className="form-check form-switch me-2">
						<input
							className="form-check-input"
							id="favoritesOnlyToggle"
							type="checkbox"
							role="switch"
							checked={favoritesOnly}
							onChange={() => setFavoritesOnly(!favoritesOnly)}
						/>
						<label className="form-check-label" htmlFor="favoritesOnlyToggle">
							Favorites only
						</label>
					</div>
					<button
						className={`btn ${isSelectionMode ? 'btn-primary' : 'btn-outline-primary'}`}
						onClick={toggleSelectionMode}
					>
						{isSelectionMode ? 'Cancel Selection' : 'Select Multiple'}
					</button>
					{!isSelectionMode && (
						<>
							<button
								className="btn btn-outline-primary position-relative"
								onClick={() => setShowCompareModal(true)}
								disabled={compareList.length === 0}
							>
								Compare
								{compareList.length > 0 && (
									<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
										{compareList.length}
										<span className="visually-hidden">items selected</span>
									</span>
								)}
							</button>
							<button
								className={`btn ${favoritesOnly ? 'btn-primary' : 'btn-outline-primary'}`}
								onClick={() => setFavoritesOnly(!favoritesOnly)}
							>
								{favoritesOnly ? '⭐ Favorites' : '☆ Show Favorites'}
							</button>
							<button
								className="btn btn-outline-secondary"
								type="button"
								onClick={() => setShowScanner(true)}
							>
								Scan Barcode
							</button>
							<div className="d-flex align-items-center gap-2">
								<select
									className="form-select form-select-sm"
									value={exportFormat}
									onChange={(e) => setExportFormat(e.target.value)}
									aria-label="Select export format"
								>
									<option value="csv">CSV</option>
									<option value="json">JSON</option>
									<option value="pdf">PDF</option>
									<option value="excel">Excel</option>
								</select>
								<select
									className="form-select form-select-sm"
									value={exportScope}
									onChange={(e) => setExportScope(e.target.value)}
									aria-label="Select which chemicals to export"
								>
									<option value="filtered">Filtered list</option>
									<option value="favorites">Favorites only</option>
									<option value="selected">Selected only</option>
								</select>
							</div>
							<div className="btn-group">
								<button
									className="btn btn-outline-primary"
									type="button"
									onClick={() => {
										if (exportFormat === 'json') {
											handleExportJSON();
										} else if (exportFormat === 'pdf') {
											handleExportPDF();
										} else if (exportFormat === 'excel') {
											handleExportExcel();
										} else {
											handleExportCSV();
										}
									}}
								>
									Export
								</button>
							</div>
							<label className="btn btn-outline-primary" style={{ cursor: 'pointer', margin: 0 }}>
								Import JSON
								<input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
							</label>
						</>
					)}
				</div>
			</div>

			{isSelectionMode && (
				<div className="alert alert-info d-flex justify-content-between align-items-center sticky-top shadow-sm" style={{ top: '70px', zIndex: 900 }}>
					<div className="d-flex align-items-center gap-3">
						<div className="form-check mb-0">
							<input
								className="form-check-input"
								type="checkbox"
								checked={selectedChemicals.size === filteredChemicals.length && filteredChemicals.length > 0}
								onChange={selectAll}
								id="selectAll"
							/>
							<label className="form-check-label" htmlFor="selectAll">
								Select All ({selectedChemicals.size} selected)
							</label>
						</div>
					</div>
					<div className="d-flex gap-2">
						<button
							className="btn btn-sm btn-primary"
							onClick={handleExportSelectedCSV}
							disabled={selectedChemicals.size === 0}
						>
							Export Selected
						</button>
					</div>
				</div>
			)}

			<div className="chemical-grid">
				{filteredChemicals.length === 0 ? (
					<div style={{
						gridColumn: '1 / -1',
						textAlign: 'center',
						padding: 'var(--space-8) var(--space-4)',
					}}>
						<div style={{ fontSize: '64px', marginBottom: 'var(--space-3)', opacity: 0.3 }}>
							🧪
						</div>
						<h3 style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
							No chemicals found
						</h3>
						<p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
							{searchTerm || selectedTag || favoritesOnly
								? 'Try adjusting your filters or search term'
								: 'Get started by adding your first chemical'}
						</p>
						{!searchTerm && !selectedTag && !favoritesOnly && (
							<a href="/add-chemical" className="btn btn-primary">
								Add Chemical
							</a>
						)}
					</div>
				) : (
					filteredChemicals.map((chem) => (
						<div key={chem.id} className="position-relative">
							{isSelectionMode && (
								<div className="position-absolute top-0 start-0 p-2" style={{ zIndex: 10 }}>
									<input
										type="checkbox"
										className="form-check-input"
										style={{ width: '1.5em', height: '1.5em', cursor: 'pointer' }}
										checked={selectedChemicals.has(chem.id)}
										onChange={() => toggleSelection(chem.id)}
									/>
								</div>
							)}
							<Link
								to={isSelectionMode ? '#' : `/chemicals/${encodeURIComponent(chem.id)}`}
								onClick={(e) => {
									if (isSelectionMode) {
										e.preventDefault();
										toggleSelection(chem.id);
									}
								}}
								className={`chemical-card ${isSelectionMode && selectedChemicals.has(chem.id) ? 'border-primary' : ''}`}
								style={{ display: 'block', height: '100%', textDecoration: 'none', color: 'inherit' }}
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
									{!isSelectionMode && (
										<div className="d-flex gap-2 mt-2">
											<button
												type="button"
												className={`btn btn-sm flex-grow-1 ${favorites.includes(chem.id) ? 'btn-warning' : 'btn-outline-secondary'}`}
												onClick={(e) => { e.preventDefault(); toggleFavorite(chem.id); }}
											>
												{favorites.includes(chem.id) ? '★' : '☆'} Fav
											</button>
											<button
												type="button"
												className={`btn btn-sm flex-grow-1 ${compareList.some(c => c.id === chem.id) ? 'btn-info' : 'btn-outline-info'}`}
												onClick={(e) => {
													e.preventDefault();
													if (compareList.some(c => c.id === chem.id)) {
														removeFromCompare(chem.id);
													} else {
														addToCompare(chem);
													}
												}}
											>
												{compareList.some(c => c.id === chem.id) ? '✓' : '+'} Compare
											</button>
										</div>
									)}
								</div>
							</Link>
						</div>
					))
				)}
			</div>

			<CompareModal show={showCompareModal} onClose={() => setShowCompareModal(false)} />
		</div>
	);
}

export default Chemicals;
