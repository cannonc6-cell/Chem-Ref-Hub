import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { useAuth } from '../context/AuthContext';
import ActivityTimeline from '../components/charts/ActivityTimeline';
import HazardDistribution from '../components/charts/HazardDistribution';
import TopChemicals from '../components/charts/TopChemicals';
import { getActivityTimeline, getHazardDistribution, getMostUsedChemicals } from '../utils/analytics';

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

	// Get logbook for analytics
	const logbook = useMemo(() => {
		try {
			return JSON.parse(localStorage.getItem('chemicalLogbook') || '[]');
		} catch {
			return [];
		}
	}, []);

	// Compute analytics data
	const hazardData = useMemo(() => getHazardDistribution(chemicals), [chemicals]);
	const topUsedChemicals = useMemo(() => getMostUsedChemicals(logbook, chemicals), [logbook, chemicals]);
	const activityData = useMemo(() => getActivityTimeline(logbook, recentItems), [logbook, recentItems]);

	return (
		<div className="dashboard-page">
			{/* Hero Section */}
			<div style={{
				background: 'linear-gradient(135deg, #0369A1 0%, #8B5CF6 50%, #F59E0B 100%)',
				borderRadius: 'var(--radius-xl)',
				padding: '3rem',
				color: 'white',
				marginBottom: '2.5rem',
				position: 'relative',
				overflow: 'hidden',
				boxShadow: '0 20px 60px rgba(3, 105, 161, 0.3)'
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
				<div className="stat-card stat-card-purple" style={{
					backgroundColor: 'var(--surface)',
					padding: '1.5rem',
					borderRadius: 'var(--radius-lg)',
					border: '2px solid var(--border-light)',
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
						<div className="icon-bg-purple" style={{
							width: '48px',
							height: '48px',
							borderRadius: '12px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
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
				<div className="stat-card stat-card-pink" style={{
					backgroundColor: 'var(--surface)',
					padding: '1.5rem',
					borderRadius: 'var(--radius-lg)',
					border: '2px solid var(--border-light)',
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
						<div className="icon-bg-pink" style={{
							width: '48px',
							height: '48px',
							borderRadius: '12px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}>
							<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
								<path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
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

				{/* Add NewEntry Card */}
				<div className="stat-card stat-card-teal" style={{
					backgroundColor: 'var(--surface)',
					padding: '1.5rem',
					borderRadius: 'var(--radius-lg)',
					border: '2px solid var(--border-light)',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					height: '160px',
					textAlign: 'center',
					gap: '1rem'
				}}>
					<div className="icon-bg-teal" style={{
						width: '56px',
						height: '56px',
						borderRadius: '14px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}>
						<svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
						</svg>
					</div>
					<div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Quick Add</div>
					<Link
						to="/add-chemical"
						className="btn btn-teal"
						style={{
							borderRadius: 'var(--radius-md)',
							width: '100%',
							fontWeight: 600
						}}
					>
						Add Chemical
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
									<div className="icon-bg-indigo" style={{
										width: '48px',
										height: '48px',
										borderRadius: '12px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										marginRight: '1rem'
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
									<div className="icon-bg-coral" style={{
										width: '48px',
										height: '48px',
										borderRadius: '12px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										marginRight: '1rem'
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

			{/* Analytics Section */}
			<div style={{ marginBottom: '2.5rem' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
					<h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Analytics Dashboard</h2>
					<span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Last 30 Days</span>
				</div>

				<div style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
					gap: '2rem'
				}}>
					{/* Activity Timeline Chart */}
					<div className="card" style={{ padding: '1.5rem' }}>
						<h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>
							📈 Activity Timeline
						</h3>
						<ActivityTimeline data={activityData} />
					</div>

					{/* Hazard Distribution Chart */}
					<div className="card" style={{ padding: '1.5rem' }}>
						<h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>
							⚠️ Hazard Distribution
						</h3>
						<HazardDistribution data={hazardData} />
					</div>

					{/* Top Used Chemicals Chart */}
					<div className="card" style={{ padding: '1.5rem', gridColumn: 'span 2' }}>
						<h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>
							🧪 Most Used Chemicals
						</h3>
						<TopChemicals data={topUsedChemicals} />
					</div>
				</div>
			</div>

		</div>
	);
}

export default Dashboard;





