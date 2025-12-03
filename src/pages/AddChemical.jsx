import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { useChemicals } from "../hooks/useChemicals";

const CATEGORY_OPTIONS = [
	"Acid", "Base", "Salt", "Solvent", "Oxidizer", "Reducer", "Fuel", "Metal", "Nonmetal", "Toxic", "Flammable", "Corrosive", "Explosive", "Inorganic", "Organic", "Laboratory", "Food Additive", "Fertilizer", "Pyrotechnic", "Cleaning Agent"
];

// Reusable Accordion Section Component
const FormSection = ({ title, isOpen, onToggle, children }) => {
	return (
		<div style={{
			border: '1px solid var(--border-light)',
			borderRadius: 'var(--radius-lg)',
			marginBottom: '1rem',
			backgroundColor: 'var(--surface)',
			overflow: 'hidden'
		}}>
			<button
				type="button"
				onClick={onToggle}
				style={{
					width: '100%',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: '1.25rem',
					background: 'none',
					border: 'none',
					cursor: 'pointer',
					textAlign: 'left'
				}}
			>
				<h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>{title}</h3>
				<svg
					width="20"
					height="20"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					style={{
						transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
						transition: 'transform var(--transition-fast)',
						color: 'var(--text-secondary)'
					}}
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			{isOpen && (
				<div style={{ padding: '0 1.25rem 1.25rem 1.25rem', borderTop: '1px solid var(--border-light)' }}>
					{children}
				</div>
			)}
		</div>
	);
};

function AddChemical() {
	const navigate = useNavigate();
	const { chemicals, addChemical } = useChemicals();

	// Section visibility state
	const [sections, setSections] = useState({
		general: true,
		identifiers: true,
		properties: false,
		hazards: false,
		storage: false,
		inventory: true
	});

	const toggleSection = (section) => {
		setSections(prev => ({ ...prev, [section]: !prev[section] }));
	};

	const [form, setForm] = useState({
		title: "",
		"Chemical Name": "",
		Formula: "",
		CAS: "",
		"Molecular Weight": "",
		Density: "",
		Appearance: "",
		"Hazard Information": "",
		Properties: "",
		"Handling & Storage": "",
		"Safety Notes": "",
		"Lab Use Notes": "",
		"SDS Link": "",
		categories: [],
		quantity: "",
		unit: "g",
		location: "",
		expirationDate: "",
		lowStockThreshold: "",
	});

	useEffect(() => {
		document.title = 'Add Chemical – ChemRef Hub';
	}, []);

	const handleChange = (e) => {
		const { name, value, selectedOptions } = e.target;
		if (name === "categories") {
			setForm({ ...form, categories: Array.from(selectedOptions, o => o.value) });
		} else {
			setForm({ ...form, [name]: value });
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!form["Chemical Name"] || !form.CAS) {
			toast.error("Chemical Name and CAS # are required.");
			return;
		}

		const exists = chemicals.some((c) => (c.CAS || '').toLowerCase() === (form.CAS || '').toLowerCase());
		if (exists) {
			toast.error('A chemical with this CAS already exists.');
			return;
		}

		try {
			const toSave = {
				...form,
				id: form.CAS || form["Chemical Name"],
				inventory: {
					quantity: parseFloat(form.quantity) || 0,
					unit: form.unit,
					location: form.location,
					expirationDate: form.expirationDate,
					lowStockThreshold: parseFloat(form.lowStockThreshold) || 0
				}
			};

			addChemical(toSave);
			toast.success('Chemical added successfully.');
			navigate("/chemicals");
		} catch (err) {
			console.error(err);
			toast.error('Failed to save. Please try again.');
		}
	};

	return (
		<div className="add-chemical-page" style={{ maxWidth: '800px', margin: '0 auto' }}>
			<div style={{ marginBottom: '2rem' }}>
				<h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Add New Chemical Record</h1>
				<p style={{ color: 'var(--text-secondary)' }}>
					Input detailed information for a new chemical entry, including general data, properties, hazard information, and inventory details.
				</p>
			</div>

			<form onSubmit={handleSubmit}>
				{/* General Information */}
				<FormSection
					title="General Information"
					isOpen={sections.general}
					onToggle={() => toggleSection('general')}
				>
					<div className="row g-3">
						<div className="col-md-6">
							<label className="form-label fw-medium">Chemical Name *</label>
							<input
								type="text"
								className="form-control"
								name="Chemical Name"
								value={form["Chemical Name"]}
								onChange={handleChange}
								required
								placeholder="e.g. Acetone"
							/>
						</div>
						<div className="col-md-6">
							<label className="form-label fw-medium">Formula</label>
							<input
								type="text"
								className="form-control"
								name="Formula"
								value={form.Formula}
								onChange={handleChange}
								placeholder="e.g. C3H6O"
							/>
						</div>
						<div className="col-12">
							<label className="form-label fw-medium">Description</label>
							<textarea
								className="form-control"
								name="Properties"
								value={form.Properties}
								onChange={handleChange}
								rows="3"
								placeholder="Brief description of the chemical and its uses."
							/>
						</div>
					</div>
				</FormSection>

				{/* Identifiers */}
				<FormSection
					title="Identifiers"
					isOpen={sections.identifiers}
					onToggle={() => toggleSection('identifiers')}
				>
					<div className="row g-3">
						<div className="col-md-6">
							<label className="form-label fw-medium">CAS Number *</label>
							<input
								type="text"
								className="form-control"
								name="CAS"
								value={form.CAS}
								onChange={handleChange}
								required
								placeholder="e.g. 67-64-1"
							/>
						</div>
						<div className="col-md-6">
							<label className="form-label fw-medium">SDS Link</label>
							<input
								type="url"
								className="form-control"
								name="SDS Link"
								value={form["SDS Link"]}
								onChange={handleChange}
								placeholder="https://..."
							/>
						</div>
					</div>
				</FormSection>

				{/* Physical & Chemical Properties */}
				<FormSection
					title="Physical & Chemical Properties"
					isOpen={sections.properties}
					onToggle={() => toggleSection('properties')}
				>
					<div className="row g-3">
						<div className="col-md-6">
							<label className="form-label fw-medium">Molecular Weight</label>
							<input
								type="text"
								className="form-control"
								name="Molecular Weight"
								value={form["Molecular Weight"]}
								onChange={handleChange}
								placeholder="e.g. 58.08 g/mol"
							/>
						</div>
						<div className="col-md-6">
							<label className="form-label fw-medium">Density</label>
							<input
								type="text"
								className="form-control"
								name="Density"
								value={form.Density}
								onChange={handleChange}
								placeholder="e.g. 0.7845 g/cm3"
							/>
						</div>
						<div className="col-12">
							<label className="form-label fw-medium">Appearance</label>
							<input
								type="text"
								className="form-control"
								name="Appearance"
								value={form.Appearance}
								onChange={handleChange}
								placeholder="e.g. Colorless liquid"
							/>
						</div>
					</div>
				</FormSection>

				{/* Hazard Information */}
				<FormSection
					title="Hazard Information"
					isOpen={sections.hazards}
					onToggle={() => toggleSection('hazards')}
				>
					<div className="row g-3">
						<div className="col-12">
							<label className="form-label fw-medium">Hazard Statements</label>
							<textarea
								className="form-control"
								name="Hazard Information"
								value={form["Hazard Information"]}
								onChange={handleChange}
								rows="3"
								placeholder="GHS Hazard statements..."
							/>
						</div>
						<div className="col-12">
							<label className="form-label fw-medium">Safety Notes</label>
							<textarea
								className="form-control"
								name="Safety Notes"
								value={form["Safety Notes"]}
								onChange={handleChange}
								rows="2"
								placeholder="Specific safety precautions..."
							/>
						</div>
					</div>
				</FormSection>

				{/* Storage & Handling */}
				<FormSection
					title="Storage & Handling"
					isOpen={sections.storage}
					onToggle={() => toggleSection('storage')}
				>
					<div className="row g-3">
						<div className="col-12">
							<label className="form-label fw-medium">Handling & Storage Instructions</label>
							<textarea
								className="form-control"
								name="Handling & Storage"
								value={form["Handling & Storage"]}
								onChange={handleChange}
								rows="3"
							/>
						</div>
						<div className="col-12">
							<label className="form-label fw-medium">Lab Use Notes</label>
							<textarea
								className="form-control"
								name="Lab Use Notes"
								value={form["Lab Use Notes"]}
								onChange={handleChange}
								rows="2"
							/>
						</div>
					</div>
				</FormSection>

				{/* Inventory & Tags */}
				<FormSection
					title="Inventory & Tags"
					isOpen={sections.inventory}
					onToggle={() => toggleSection('inventory')}
				>
					<div className="row g-3">
						<div className="col-md-4">
							<label className="form-label fw-medium">Quantity</label>
							<input
								type="number"
								className="form-control"
								name="quantity"
								value={form.quantity}
								onChange={handleChange}
								step="any"
							/>
						</div>
						<div className="col-md-4">
							<label className="form-label fw-medium">Unit</label>
							<select
								className="form-select"
								name="unit"
								value={form.unit}
								onChange={handleChange}
							>
								<option value="g">g</option>
								<option value="kg">kg</option>
								<option value="mL">mL</option>
								<option value="L">L</option>
								<option value="mg">mg</option>
							</select>
						</div>
						<div className="col-md-4">
							<label className="form-label fw-medium">Location</label>
							<input
								type="text"
								className="form-control"
								name="location"
								value={form.location}
								onChange={handleChange}
								placeholder="e.g. Cabinet A"
							/>
						</div>
						<div className="col-md-6">
							<label className="form-label fw-medium">Expiration Date</label>
							<input
								type="date"
								className="form-control"
								name="expirationDate"
								value={form.expirationDate}
								onChange={handleChange}
							/>
						</div>
						<div className="col-md-6">
							<label className="form-label fw-medium">Low Stock Threshold</label>
							<input
								type="number"
								className="form-control"
								name="lowStockThreshold"
								value={form.lowStockThreshold}
								onChange={handleChange}
							/>
						</div>
						<div className="col-12">
							<label className="form-label fw-medium">Categories/Tags</label>
							<select
								className="form-select"
								name="categories"
								multiple
								value={form.categories}
								onChange={handleChange}
								style={{ height: '120px' }}
							>
								{CATEGORY_OPTIONS.map((cat) => (
									<option key={cat} value={cat}>{cat}</option>
								))}
							</select>
							<div className="form-text">Hold Ctrl/Cmd to select multiple</div>
						</div>
					</div>
				</FormSection>

				{/* Action Bar */}
				<div style={{
					display: 'flex',
					justifyContent: 'flex-end',
					gap: '1rem',
					marginTop: '2rem',
					padding: '1rem',
					backgroundColor: 'var(--surface)',
					borderRadius: 'var(--radius-lg)',
					border: '1px solid var(--border-light)'
				}}>
					<button
						type="button"
						className="btn btn-outline-secondary"
						onClick={() => navigate("/chemicals")}
					>
						Cancel
					</button>
					<button
						type="submit"
						className="btn btn-primary"
						style={{ minWidth: '120px' }}
					>
						Save Chemical
					</button>
				</div>
			</form>
		</div>
	);
}

export default AddChemical;
