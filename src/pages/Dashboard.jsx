import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { useAuth } from '../context/AuthContext';

const BASE = import.meta.env.BASE_URL || '/';

function Dashboard() {
	const [chemicals, setChemicals] = useState([]);
	const [loading, setLoading] = useState(true);
	const { recentItems } = useRecentlyViewed();
	const { user } = useAuth();

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const res = await fetch(`${BASE}chemical_data.json`);
				let base = [];
				if (res.ok) {
					try { base = await res.json(); } catch (e) { base = []; }
				}

				let userChems = [];
				try {
					userChems = JSON.parse(localStorage.getItem('userChemicals') || '[]');
					if (!Array.isArray(userChems)) userChems = [];
				} catch (e) { userChems = []; }

				const list = Array.isArray(userChems) ? [...base, ...userChems] : base;
				if (!cancelled) setChemicals(list);
			} catch (err) {
				console.error("Error loading chemicals", err);
				// Fallback to local storage only
				try {
					const userChems = JSON.parse(localStorage.getItem('userChemicals') || '[]');
					if (!cancelled) setChemicals(Array.isArray(userChems) ? userChems : []);
				} catch (e) { if (!cancelled) setChemicals([]); }
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => { cancelled = true };
	}, []);

	const totalChemicals = chemicals.length;
	const favorites = useMemo(() => {
		try { return JSON.parse(localStorage.getItem('favoriteChemicals') || '[]'); } catch { return []; }
	}, [chemicals]);
	const favoritesCount = favorites.length;

	const recentEntries = useMemo(() => {
		try {
			const entries = JSON.parse(localStorage.getItem('chemicalLogbook') || '[]');
			return entries.slice(0, 4);
		} catch { return []; }
	}, []);

	useEffect(() => {
		document.title = 'Dashboard – ChemRef Hub';
	}, []);

	// Get user name for welcome message
	const userName = useMemo(() => {
		if (!user) return 'Researcher';
		const savedProfile = localStorage.getItem(`userProfile_${user.uid}`);
		if (savedProfile) {
			try {
				const profileData = JSON.parse(savedProfile);
				return profileData.customName || user.displayName || 'Researcher';
			} catch { return user.displayName || 'Researcher'; }
		}
		return user.displayName || 'Researcher';
	}, [user]);

	return (
		<div className="dashboard-page">
			{/* Hero Section */}
			<div style={{
				background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
				borderRadius: 'var(--radius-xl)',
				padding: '3rem',
				color: 'white',
				marginBottom: '2.5rem',
				position: 'relative',
				overflow: 'hidden',
				boxShadow: 'var(--shadow-lg)'
			}}>
				<div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
					<h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>
						Welcome to ChemRef DB, {userName}!
					</h1>
					<p style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '2rem', lineHeight: 1.6 }}>
						Your comprehensive platform for managing chemical data, ensuring safety, and accelerating research. Explore our vast database or add new entries with ease.
					</p>
					<Link
						to="/add-chemical"
						className="btn"
						style={{
							backgroundColor: 'white',
							color: 'var(--primary)',
							fontWeight: 600,
							padding: '0.75rem 1.5rem',
							borderRadius: 'var(--radius-md)',
							border: 'none',
							display: 'inline-flex',
							alignItems: 'center',
							gap: '0.5rem',
							textDecoration: 'none',
							transition: 'transform var(--transition-fast)'
						}}
						onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
						onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
					>
						<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
						</svg>
						Add New Chemical
					</Link>
				</div>

				{/* Decorative Background Element */}
				<div style={{
					position: 'absolute',
					right: '-50px',
					top: '-50px',
					width: '500px',
					height: '500px',
					opacity: 0.1,
					pointerEvents: 'none'
				}}>
					<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
						<path fill="currentColor" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-4.9C93.5,9.3,82.2,22.9,71.3,34.8C60.4,46.7,49.9,56.9,37.8,64.2C25.7,71.5,12.1,75.9,-0.8,77.3C-13.7,78.7,-26.2,77.1,-37.6,70.9C-49,64.7,-59.3,53.9,-67.6,41.5C-75.9,29.1,-82.2,15.1,-82.9,0.7C-83.6,-13.7,-78.7,-28.5,-69.5,-40.3C-60.3,-52.1,-46.8,-60.9,-33.3,-68.5C-19.8,-76.1,-6.3,-82.5,5.6,-92.2L11.2,-101.9" transform="translate(100 100)" />
					</svg>
				</div>
			</div>

			{/* Stats Cards */}
			<div style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
				gap: '1.5rem',
				marginBottom: '2.5rem'
			}}>
				{/* Total Chemicals Card */}
				<div style={{
					backgroundColor: 'var(--surface)',
					padding: '1.5rem',
					borderRadius: 'var(--radius-lg)',
					border: '1px solid var(--border-light)',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					height: '160px'
				}}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
						<div>
							<div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Chemicals</div>
							<div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, marginTop: '0.5rem' }}>
								{loading ? '...' : totalChemicals}
							</div>
						</div>
						<div style={{
							width: '40px',
							height: '40px',
							borderRadius: '50%',
							backgroundColor: 'var(--bg-secondary)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: 'var(--text-secondary)'
						}}>
							<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
							</svg>
						</div>
					</div>
					<Link
						to="/chemicals"
						className="btn btn-sm btn-outline-secondary"
						style={{ alignSelf: 'flex-start', borderRadius: 'var(--radius-md)' }}
					>
						Browse Database
					</Link>
				</div>

				{/* Favorites Card */}
				<div style={{
					backgroundColor: 'var(--surface)',
					padding: '1.5rem',
					borderRadius: 'var(--radius-lg)',
					border: '1px solid var(--border-light)',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					height: '160px'
				}}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
						<div>
							<div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Favorites</div>
							<div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, marginTop: '0.5rem' }}>
								{favoritesCount}
							</div>
						</div>
						<div style={{
							width: '40px',
							height: '40px',
							borderRadius: '50%',
							backgroundColor: 'var(--bg-secondary)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: 'var(--accent)'
						}}>
							<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
							</svg>
						</div>
					</div>
					<Link
						to="/chemicals"
						className="btn btn-sm btn-outline-secondary"
						style={{ alignSelf: 'flex-start', borderRadius: 'var(--radius-md)' }}
					>
						Manage Favorites
					</Link>
				</div>

				{/* Add New Entry Card */}
				<div style={{
					backgroundColor: 'var(--surface)',
					padding: '1.5rem',
					borderRadius: 'var(--radius-lg)',
					border: '1px solid var(--border-light)',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					height: '160px',
					textAlign: 'center'
				}}>
					<div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '1rem' }}>Add New Entry</div>
					<Link
						to="/add-chemical"
						className="btn btn-primary"
						style={{
							backgroundColor: 'var(--primary)',
							borderColor: 'var(--primary)',
							borderRadius: 'var(--radius-md)',
							width: '100%'
						}}
					>
						+ Add Chemical
					</Link>
				</div>
			</div>

			{/* Recent Activity Section */}
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

				{/* Recently Viewed */}
				<div>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
						<h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recently Viewed</h3>
						<Link to="/chemicals" style={{ fontSize: '0.875rem', fontWeight: 500 }}>View All</Link>
					</div>
					<div style={{
						backgroundColor: 'var(--surface)',
						borderRadius: 'var(--radius-lg)',
						border: '1px solid var(--border-light)',
						overflow: 'hidden'
					}}>
						{recentItems.length === 0 ? (
							<div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
								No recently viewed chemicals
							</div>
						) : (
							recentItems.map((item, index) => (
								<Link
									key={item.id}
									to={`/chemicals/${encodeURIComponent(item.id)}`}
									style={{
										display: 'flex',
										alignItems: 'center',
										padding: '1rem 1.5rem',
										borderBottom: index < recentItems.length - 1 ? '1px solid var(--border-light)' : 'none',
										textDecoration: 'none',
										color: 'inherit',
										transition: 'background-color var(--transition-fast)'
									}}
									onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
									onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
								>
									<div style={{
										width: '40px',
										height: '40px',
										borderRadius: '50%',
										backgroundColor: 'var(--bg-secondary)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										marginRight: '1rem',
										color: 'var(--primary)'
									}}>
										<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
									<div style={{ flex: 1 }}>
										<div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
										<div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item.formula}</div>
									</div>
									<div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
										{new Date(item.timestamp).toLocaleDateString()}
									</div>
								</Link>
							))
						)}
					</div>
				</div>

				{/* Recent Logbook Entries */}
				<div>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
						<h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recent Logbook Entries</h3>
						<Link to="/logbook" style={{ fontSize: '0.875rem', fontWeight: 500 }}>View Logbook</Link>
					</div>
					<div style={{
						backgroundColor: 'var(--surface)',
						borderRadius: 'var(--radius-lg)',
						border: '1px solid var(--border-light)',
						overflow: 'hidden'
					}}>
						{recentEntries.length === 0 ? (
							<div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
								No recent logbook entries
							</div>
						) : (
							recentEntries.map((entry, index) => (
								<div
									key={entry.id}
									style={{
										display: 'flex',
										alignItems: 'flex-start',
										padding: '1rem 1.5rem',
										borderBottom: index < recentEntries.length - 1 ? '1px solid var(--border-light)' : 'none'
									}}
								>
									<div style={{
										width: '40px',
										height: '40px',
										borderRadius: '50%',
										backgroundColor: 'var(--bg-secondary)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										marginRight: '1rem',
										color: 'var(--text-secondary)'
									}}>
										<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
										</svg>
									</div>
									<div style={{ flex: 1 }}>
										<div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{entry.chemicalName || entry.chemical}</div>
										<div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{entry.action}</div>
									</div>
									<div style={{ textAlign: 'right' }}>
										<div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{new Date(entry.date).toLocaleDateString()}</div>
										<div style={{ fontSize: '0.75rem', fontWeight: 500 }}>{entry.quantity} {entry.unit}</div>
									</div>
								</div>
							))
						)}
					</div>
				</div>

			</div>
		</div>
	);
}

export default Dashboard;
