import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useChemicals } from '../hooks/useChemicals';
import ChemicalCard from '../components/ChemicalCard';
import ExportToolbar from '../components/ExportToolbar';
import SkeletonCard from '../components/SkeletonCard';
import ChemicalCompareModal from '../components/ChemicalCompareModal';
import BackupRestore from '../components/BackupRestore';
import SEO from '../components/SEO';

function Chemicals() {
	const { chemicals, loading, error, favorites, toggleFavorite } = useChemicals();

	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTag, setSelectedTag] = useState("");
	const [selectedHazard, setSelectedHazard] = useState("");
	const [favoritesOnly, setFavoritesOnly] = useState(false);
	const [sortBy, setSortBy] = useState("name");

	// Compare Mode State
	const [isCompareMode, setIsCompareMode] = useState(false);
	const [selectedChemicals, setSelectedChemicals] = useState(new Set());
	const [showCompareModal, setShowCompareModal] = useState(false);

	// Extract unique tags and hazards
	const { allTags, allHazards } = useMemo(() => {
		const tags = new Set();
		const hazards = new Set();
		chemicals.forEach(chem => {
			if (Array.isArray(chem.tags)) chem.tags.forEach(t => tags.add(t));
			if (Array.isArray(chem.hazards)) chem.hazards.forEach(h => hazards.add(h));
		});
		return {
			allTags: Array.from(tags).sort(),
			allHazards: Array.from(hazards).sort()
		};
	}, [chemicals]);

	// Filter and sort chemicals
	const filteredChemicals = useMemo(() => {
		return chemicals
			.filter(chem => {
				const matchesSearch = (chem.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
					(chem.formula || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
					(chem.casNumber || '').includes(searchTerm);
				const matchesTag = !selectedTag || (chem.tags && chem.tags.includes(selectedTag));
				const matchesHazard = !selectedHazard || (chem.hazards && chem.hazards.includes(selectedHazard));
				const matchesFav = !favoritesOnly || favorites.includes(chem.id);

				return matchesSearch && matchesTag && matchesHazard && matchesFav;
			})
			.sort((a, b) => {
				if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
				if (sortBy === 'formula') return (a.formula || '').localeCompare(b.formula || '');
				return 0;
			});
	}, [chemicals, searchTerm, selectedTag, selectedHazard, favoritesOnly, favorites, sortBy]);

	// Toggle selection for compare
	const toggleSelection = (chemical) => {
		setSelectedChemicals(prev => {
			const next = new Set(prev);
			if (next.has(chemical.id)) {
				next.delete(chemical.id);
			} else {
				if (next.size >= 4) {
					alert("You can compare up to 4 chemicals at a time.");
					return next;
				}
				next.add(chemical.id);
			}
			return next;
		});
	};

	// Handle Compare Button Click
	const handleCompareClick = () => {
		if (!isCompareMode) {
			setIsCompareMode(true);
		} else {
			if (selectedChemicals.size >= 2) {
				setShowCompareModal(true);
			} else if (selectedChemicals.size > 0) {
				alert("Please select at least 2 chemicals to compare.");
			} else {
				setIsCompareMode(false);
				setSelectedChemicals(new Set());
			}
		}
	};

	// Get selected chemical objects for the modal
	const selectedChemicalObjects = useMemo(() => {
		return chemicals.filter(c => selectedChemicals.has(c.id));
	}, [chemicals, selectedChemicals]);

	if (loading) {
		return (
			<div style={{ padding: '2rem' }}>
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
					{[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
				</div>
			</div>
		);
	}

	if (error) {
		return <div className="text-error p-4">Error loading chemicals: {error}</div>;
	}

	return (
		<div className="chemicals-page">
			{/* Page Header */}
			<div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
				<div>
					<h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
						Chemical Records
					</h1>
					<p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
						Browse, search, and manage detailed chemical records effortlessly.
					</p>
				</div>
				<div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
					{/* Compare Button */}
					<button
						className={`btn ${isCompareMode && selectedChemicals.size >= 2 ? 'btn-success' : 'btn-outline-primary'}`}
						onClick={handleCompareClick}
						style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
					>
						<span>⚖️</span>
						{isCompareMode
							? (selectedChemicals.size > 0 ? `Compare Selected (${selectedChemicals.size})` : 'Cancel Compare')
							: 'Compare'
						}
					</button>

					<BackupRestore />

					<ExportToolbar data={filteredChemicals} type="chemicals" />
					<Link to="/add-chemical" className="btn btn-primary">
						Add New Chemical
					</Link>
				</div>
			</div>

			{/* Filters Bar */}
			<div style={{
				backgroundColor: 'var(--surface)',
				padding: '1.25rem',
				borderRadius: 'var(--radius-lg)',
				border: '1px solid var(--border-light)',
				marginBottom: '2rem',
				display: 'flex',
				flexWrap: 'wrap',
				gap: '1rem',
				alignItems: 'flex-end'
			}}>
				{/* Search Input */}
				<div style={{ flex: 1, minWidth: '250px' }}>
					<label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', color: 'var(--text-secondary)' }}>
						Search
					</label>
					<div style={{ position: 'relative' }}>
						<div style={{
							position: 'absolute',
							left: '12px',
							top: '50%',
							transform: 'translateY(-50%)',
							color: 'var(--text-tertiary)',
							pointerEvents: 'none'
						}}>
							<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</div>
						<input
							type="text"
							className="form-select"
							placeholder="Search by name, formula, or CAS..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							style={{ paddingLeft: '2.5rem', width: '100%' }}
						/>
						{searchTerm && (
							<button
								onClick={() => setSearchTerm('')}
								style={{
									position: 'absolute',
									right: '8px',
									top: '50%',
									transform: 'translateY(-50%)',
									background: 'none',
									border: 'none',
									cursor: 'pointer',
									color: 'var(--text-tertiary)',
									padding: '4px',
									display: 'flex',
									alignItems: 'center'
								}}
								aria-label="Clear search"
							>
								<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						)}
					</div>
				</div>

				{/* Category Filter */}
				<div style={{ flex: 1, minWidth: '200px' }}>
					<label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', color: 'var(--text-secondary)' }}>
						Category
					</label>
					<select
						className="form-select"
						value={selectedTag}
						onChange={(e) => setSelectedTag(e.target.value)}
						style={{ width: '100%' }}
					>
						<option value="">All Categories</option>
						{allTags.map(tag => (
							<option key={tag} value={tag}>{tag}</option>
						))}
					</select>
				</div>

				{/* Hazard Filter */}
				<div style={{ flex: 1, minWidth: '200px' }}>
					<label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', color: 'var(--text-secondary)' }}>
						Hazard
					</label>
					<select
						className="form-select"
						value={selectedHazard}
						onChange={(e) => setSelectedHazard(e.target.value)}
						style={{ width: '100%' }}
					>
						<option value="">All Hazards</option>
						{allHazards.map(h => (
							<option key={h} value={h}>{h}</option>
						))}
					</select>
				</div>

				{/* Sort By */}
				<div style={{ flex: 1, minWidth: '200px' }}>
					<label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', color: 'var(--text-secondary)' }}>
						Sort By
					</label>
					<select
						className="form-select"
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value)}
						style={{ width: '100%' }}
					>
						<option value="name">Name (A-Z)</option>
						<option value="formula">Formula</option>
					</select>
				</div>
			</div>

			{/* Favorites Toggle */}
			<div style={{ marginBottom: '1.5rem' }}>
				<label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
					<input
						type="checkbox"
						checked={favoritesOnly}
						onChange={(e) => setFavoritesOnly(e.target.checked)}
						style={{
							width: '1.125rem',
							height: '1.125rem',
							accentColor: 'var(--primary)'
						}}
					/>
					<span style={{ fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Show Favorites Only</span>
				</label>
			</div>

			{/* Grid Layout */}
			<div className="chemical-grid">
				{filteredChemicals.length > 0 ? (
					filteredChemicals.map(chem => (
						<ChemicalCard
							key={chem.id}
							chemical={chem}
							isFavorite={favorites.includes(chem.id)}
							onToggleFavorite={toggleFavorite}
							isSelectable={isCompareMode}
							isSelected={selectedChemicals.has(chem.id)}
							onToggleSelect={toggleSelection}
						/>
					))
				) : (
					<div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: 'var(--text-tertiary)' }}>
						<div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
						<p>No chemicals found matching your filters.</p>
					</div>
				)}
			</div>

			{/* Compare Modal */}
			<ChemicalCompareModal
				show={showCompareModal}
				onClose={() => setShowCompareModal(false)}
				chemicals={selectedChemicalObjects}
			/>
		</div>
	);
}

export default Chemicals;
