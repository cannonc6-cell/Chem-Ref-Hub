import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useChemicals } from '../hooks/useChemicals';
import ChemicalCard from '../components/ChemicalCard';
import SkeletonCard from '../components/SkeletonCard';

function Chemicals() {
	const { chemicals, loading, error, favorites, toggleFavorite } = useChemicals();

	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTag, setSelectedTag] = useState("");
	const [selectedHazard, setSelectedHazard] = useState("");
	const [favoritesOnly, setFavoritesOnly] = useState(false);
	const [sortBy, setSortBy] = useState("name");

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
			<div style={{ marginBottom: '2rem' }}>
				<h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
					Chemical Records
				</h1>
				<p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
					Browse, search, and manage detailed chemical records effortlessly.
				</p>
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

				{/* Add New Button */}
				<div style={{ marginLeft: 'auto' }}>
					<Link
						to="/add-chemical"
						className="btn btn-primary"
						style={{
							height: '42px',
							display: 'inline-flex',
							alignItems: 'center',
							backgroundColor: 'var(--primary)',
							borderColor: 'var(--primary)',
							color: 'white',
							padding: '0 1.5rem',
							borderRadius: 'var(--radius-md)',
							fontWeight: 500,
							textDecoration: 'none'
						}}
					>
						Add New Chemical
					</Link>
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
			<div style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
				gap: '1.5rem'
			}}>
				{filteredChemicals.length > 0 ? (
					filteredChemicals.map(chem => (
						<ChemicalCard
							key={chem.id}
							chemical={chem}
							isFavorite={favorites.includes(chem.id)}
							onToggleFavorite={toggleFavorite}
						/>
					))
				) : (
					<div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: 'var(--text-tertiary)' }}>
						<div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
						<p>No chemicals found matching your filters.</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default Chemicals;

