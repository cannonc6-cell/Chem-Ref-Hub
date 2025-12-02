import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/modern.css";
import { useChemicals } from "../hooks/useChemicals";

const CATEGORY_OPTIONS = [
	"Acid", "Base", "Salt", "Solvent", "Oxidizer", "Reducer", "Fuel", "Metal", "Nonmetal", "Toxic", "Flammable", "Corrosive", "Explosive", "Inorganic", "Organic", "Laboratory", "Food Additive", "Fertilizer", "Pyrotechnic", "Cleaning Agent"
];

function AddChemical() {
	const navigate = useNavigate();
	const { chemicals, addChemical } = useChemicals();

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
		"SDS Link": "",
		categories: [],
		quantity: "",
		unit: "g",
		location: "",
		expirationDate: "",
		lowStockThreshold: "",
	});
	const [error, setError] = useState("");

	useEffect(() => {
		document.title = 'Add Chemical – ChemRef Hub';
	}, []);

	const handleChange = (e) => {
		const { name, value, type, selectedOptions } = e.target;
		if (name === "categories") {
			setForm({ ...form, categories: Array.from(selectedOptions, o => o.value) });
		} else {
			setForm({ ...form, [name]: value });
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Basic validation
		if (!form["Chemical Name"] || !form.CAS) {
			setError("Chemical Name and CAS # are required.");
			return;
		}

		// Check for duplicates using the hook's data
		const exists = chemicals.some((c) => (c.CAS || '').toLowerCase() === (form.CAS || '').toLowerCase());
		if (exists) {
			setError('A chemical with this CAS already exists.');
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
			alert('Chemical added to your local list.');
			navigate("/chemicals");
		} catch (err) {
			console.error(err);
			setError('Failed to save. Please try again.');
		}
	};

	return (
		<div className="app-container">
			<div className="page-header">
				<div className="header-content">
					<h1 className="section-title">Add Chemical</h1>
				</div>
			</div>
			<div className="data-table-container" aria-labelledby="add-chemical-heading">
				{error && (
					<div className="alert alert-danger" role="alert">
						{error}
					</div>
				)}
				<form onSubmit={handleSubmit}>
					<div className="row g-3">
						<div className="col-md-6">
							<label className="form-label" htmlFor="chemical-name">Chemical Name *</label>
							<input
								id="chemical-name"
								type="text"
								className="form-control"
								name="Chemical Name"
								value={form["Chemical Name"]}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="col-md-6">
							<label className="form-label" htmlFor="cas-number">CAS # *</label>
							<input
								id="cas-number"
								type="text"
								className="form-control"
								name="CAS"
								value={form.CAS}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="col-md-6">
							<label className="form-label" htmlFor="formula">Formula</label>
							<input
								id="formula"
								type="text"
								className="form-control"
								name="Formula"
								value={form.Formula}
								onChange={handleChange}
							/>
						</div>
						<div className="col-md-6">
							<label className="form-label" htmlFor="molecular-weight">Molecular Weight</label>
							<input
								id="molecular-weight"
								type="text"
								className="form-control"
								name="Molecular Weight"
								value={form["Molecular Weight"]}
								onChange={handleChange}
							/>
						</div>
						<div className="col-md-6">
							<label className="form-label" htmlFor="density">Density</label>
							<input
								id="density"
								type="text"
								className="form-control"
								name="Density"
								value={form.Density}
								onChange={handleChange}
							/>
						</div>
						<div className="col-md-6">
							<label className="form-label" htmlFor="appearance">Appearance</label>
							<input
								id="appearance"
								type="text"
								className="form-control"
								name="Appearance"
								value={form.Appearance}
								onChange={handleChange}
							/>
						</div>
						<div className="col-12">
							<label className="form-label" htmlFor="hazard-info">Hazard Information</label>
							<textarea
								id="hazard-info"
								className="form-control"
								name="Hazard Information"
								value={form["Hazard Information"]}
								onChange={handleChange}
								rows="2"
							/>
						</div>
						<div className="col-12">
							<label className="form-label" htmlFor="properties">Properties</label>
							<textarea
								id="properties"
								className="form-control"
								name="Properties"
								value={form.Properties}
								onChange={handleChange}
								rows="2"
							/>
						</div>
						<div className="col-12">
							<label className="form-label" htmlFor="handling-storage">Handling &amp; Storage</label>
							<textarea
								id="handling-storage"
								className="form-control"
								name="Handling & Storage"
								value={form["Handling & Storage"]}
								onChange={handleChange}
								rows="2"
							/>
						</div>
						<div className="col-12">
							<label className="form-label" htmlFor="safety-notes">Safety Notes</label>
							<textarea
								id="safety-notes"
								className="form-control"
								name="Safety Notes"
								value={form["Safety Notes"]}
								onChange={handleChange}
								rows="2"
							/>
						</div>
						<div className="col-12">
							<label className="form-label" htmlFor="lab-use-notes">Lab Use Notes</label>
							<textarea
								id="lab-use-notes"
								className="form-control"
								name="Lab Use Notes"
								value={form["Lab Use Notes"]}
								onChange={handleChange}
								rows="2"
							/>
						</div>
						<div className="col-md-6">
							<label className="form-label" htmlFor="sds-link">SDS Link</label>
							<input
								id="sds-link"
								type="url"
								className="form-control"
								name="SDS Link"
								value={form["SDS Link"]}
								onChange={handleChange}
								placeholder="Paste SDS URL (optional)"
							/>
						</div>

						<div className="col-12"><hr className="my-4" /></div>
						<div className="col-12"><h5 className="mb-3">Inventory Details</h5></div>

						<div className="col-md-4">
							<label htmlFor="quantity" className="form-label">Quantity</label>
							<input
								type="number"
								className="form-control"
								id="quantity"
								name="quantity"
								value={form.quantity}
								onChange={handleChange}
								step="any"
							/>
						</div>
						<div className="col-md-4">
							<label htmlFor="unit" className="form-label">Unit</label>
							<select
								className="form-select"
								id="unit"
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
							<label htmlFor="location" className="form-label">Location</label>
							<input
								type="text"
								className="form-control"
								id="location"
								name="location"
								value={form.location}
								onChange={handleChange}
								placeholder="e.g. Cabinet A, Shelf 2"
							/>
						</div>

						<div className="col-md-6">
							<label htmlFor="expirationDate" className="form-label">Expiration Date</label>
							<input
								type="date"
								className="form-control"
								id="expirationDate"
								name="expirationDate"
								value={form.expirationDate}
								onChange={handleChange}
							/>
						</div>
						<div className="col-md-6">
							<label htmlFor="lowStockThreshold" className="form-label">Low Stock Alert Threshold</label>
							<input
								type="number"
								className="form-control"
								id="lowStockThreshold"
								name="lowStockThreshold"
								value={form.lowStockThreshold}
								onChange={handleChange}
								placeholder="Alert when quantity below..."
							/>
						</div>
						<div className="col-md-6">
							<label className="form-label" htmlFor="categories">Categories/Tags</label>
							<select
								id="categories"
								className="form-select"
								name="categories"
								multiple
								value={form.categories}
								onChange={handleChange}
							>
								{CATEGORY_OPTIONS.map((cat) => (
									<option key={cat} value={cat}>{cat}</option>
								))}
							</select>
							<div className="form-text">Hold Ctrl (Windows) or Cmd (Mac) to select multiple.</div>
						</div>
						<div className="col-12 d-flex gap-2 justify-content-end mt-2">
							<button type="button" className="btn btn-outline-primary" onClick={() => navigate("/chemicals")}>Cancel</button>
							<button type="submit" className="btn btn-primary">Add Chemical</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}

export default AddChemical;
