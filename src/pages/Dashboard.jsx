import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/modern.css';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';

const BASE = import.meta.env.BASE_URL || '/';

function Dashboard() {
	const [chemicals, setChemicals] = useState([]);
	const [loading, setLoading] = useState(true);
	const [alertMsg, setAlertMsg] = useState('');
	const [alertVariant, setAlertVariant] = useState('warning');
	const { recentItems } = useRecentlyViewed();

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const res = await fetch(`${BASE}chemical_data.json`);
				if (!res.ok) throw new Error('Network error');
				let base;
				try {
					base = await res.json();
				} catch {
					base = [];
					if (!cancelled) {
						setAlertVariant('danger');
						setAlertMsg('Received invalid chemical data from server. Some dashboard stats may be incomplete.');
					}
				}
				let user = [];
				try {
					user = JSON.parse(localStorage.getItem('userChemicals') || '[]');
					if (!Array.isArray(user)) user = [];
				} catch {
					user = [];
				}
				const list = Array.isArray(user) ? [...base, ...user] : base;
				if (!cancelled) setChemicals(list);
			} catch {
				let user = [];
				try {
					user = JSON.parse(localStorage.getItem('userChemicals') || '[]');
					if (!Array.isArray(user)) user = [];
				} catch {
					user = [];
				}
				const list = Array.isArray(user) ? user : [];
				if (!cancelled) {
					setAlertVariant('warning');
					setAlertMsg('Could not reach the server. Dashboard shows only local chemicals.');
					setChemicals(list);
				}
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
			return entries.slice(0, 5);
		} catch { return []; }
	}, [chemicals]);

	useEffect(() => {
		document.title = 'Dashboard – ChemRef Hub';
	}, []);

	return (
		<div className="app-container">
			{alertMsg && (
				<div className={`alert alert-${alertVariant} d-flex justify-content-between align-items-center`} role="alert">
					<span>{alertMsg}</span>
					<button
						type="button"
						className="btn-close"
						aria-label="Close"
						onClick={() => setAlertMsg('')}
					></button>
				</div>
			)}
			<div className="page-header">
				<div className="header-content">
					<h1 className="section-title">Chemical Dashboard</h1>
				</div>
				<p className="lead mb-0">Overview of your collection and recent activity.</p>
			</div>

			<div className="row g-3 mb-3">
				<div className="col-12 col-md-4">
					<div className="card shadow-sm">
						<div className="card-body">
							<div className="d-flex justify-content-between align-items-center">
								<div>
									<div className="text-muted">Total chemicals</div>
									<div className="fs-3 fw-bold">{loading ? '—' : totalChemicals}</div>
								</div>
								<Link className="btn btn-outline-primary" to="/chemicals">Browse</Link>
							</div>
						</div>
					</div>
				</div>
				<div className="col-12 col-md-4">
					<div className="card shadow-sm">
						<div className="card-body">
							<div className="d-flex justify-content-between align-items-center">
								<div>
									<div className="text-muted">Favorites</div>
									<div className="fs-3 fw-bold">{favoritesCount}</div>
								</div>
								<Link className="btn btn-outline-primary" to="/chemicals">Manage</Link>
							</div>
						</div>
					</div>
				</div>
				<div className="col-12 col-md-4">
					<div className="card shadow-sm">
						<div className="card-body">
							<div className="d-flex justify-content-between align-items-center">
								<div>
									<div className="text-muted">Add new</div>
									<div className="fs-3 fw-bold">—</div>
								</div>
								<Link className="btn btn-primary" to="/add-chemical">Add Chemical</Link>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="row g-3">
				<div className="col-12 col-md-6">
					<div className="card shadow-sm h-100">
						<div className="card-header bg-white">
							<h5 className="mb-0">Recently Viewed</h5>
						</div>
						<div className="card-body p-0">
							<div className="list-group list-group-flush">
								{recentItems.length === 0 ? (
									<div className="p-3 text-center text-muted">No recently viewed chemicals</div>
								) : (
									recentItems.map((item) => (
										<Link
											key={item.id}
											to={`/chemicals/${encodeURIComponent(item.id)}`}
											className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
										>
											<div>
												<div className="fw-medium">{item.name}</div>
												<small className="text-muted">{item.formula}</small>
											</div>
											<small className="text-muted">
												{new Date(item.timestamp).toLocaleDateString()}
											</small>
										</Link>
									))
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="col-12 col-md-6">
					<div className="card shadow-sm h-100">
						<div className="card-header bg-white">
							<h5 className="mb-0">Recent Logbook Entries</h5>
						</div>
						<div className="card-body p-0">
							<div className="list-group list-group-flush">
								{recentEntries.length === 0 ? (
									<div className="p-3 text-center text-muted">No recent entries</div>
								) : (
									recentEntries.map((entry) => (
										<div key={entry.id} className="list-group-item">
											<div className="d-flex w-100 justify-content-between">
												<h6 className="mb-1">{entry.chemicalName || entry.chemical}</h6>
												<small className="text-muted">{new Date(entry.date).toLocaleDateString()}</small>
											</div>
											<p className="mb-1 small">{entry.action}</p>
											<small className="text-muted">
												{entry.quantity} {entry.unit}
											</small>
										</div>
									))
								)}
							</div>
						</div>
						<div className="card-footer text-end bg-white border-top-0">
							<Link className="btn btn-sm btn-outline-primary" to="/logbook">View Logbook</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
