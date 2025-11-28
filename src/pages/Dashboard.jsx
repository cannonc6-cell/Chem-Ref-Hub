import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/modern.css';

const BASE = import.meta.env.BASE_URL || '/';

function Dashboard() {
	const [chemicals, setChemicals] = useState([]);
	const [loading, setLoading] = useState(true);
	const [alertMsg, setAlertMsg] = useState('');
	const [alertVariant, setAlertVariant] = useState('warning');

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

			<div className="card">
				<div className="card-header"><span className="subheader-accent">Recent logbook entries</span></div>
				<div className="card-body p-0">
					<div className="table-responsive">
						<table className="table mb-0">
							<thead>
								<tr>
									<th>Date</th>
									<th>Chemical</th>
									<th>Quantity</th>
									<th>Action</th>
									<th>Notes</th>
								</tr>
							</thead>
							<tbody>
								{recentEntries.length === 0 ? (
									<tr><td colSpan="5" className="text-center py-3">No entries yet</td></tr>
								) : recentEntries.map((e) => (
									<tr key={e.id}>
										<td>{new Date(e.date).toLocaleDateString()}</td>
										<td>{e.chemical}</td>
										<td>{e.quantity}</td>
										<td>
											<span className={`badge ${
												e.action === 'used' ? 'bg-warning' : e.action === 'added' ? 'bg-success' : 'bg-danger'
											}`}>{e.action}</span>
										</td>
										<td>{e.notes}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
				<div className="card-footer text-end">
					<Link className="btn btn-outline-primary" to="/logbook">Open Logbook</Link>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
