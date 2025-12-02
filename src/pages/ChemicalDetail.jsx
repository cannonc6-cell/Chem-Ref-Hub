import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/modern.css";
import { useChemicals } from "../hooks/useChemicals";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import QRCodeModal from "../components/QRCodeModal";
import ChemicalUsageHistory from "../components/ChemicalUsageHistory";

const BASE = import.meta.env.BASE_URL || '/';

function CollapsibleSection({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-2">
      <button className="btn btn-link p-0" onClick={() => setOpen((v) => !v)}>
        <strong>{open ? "\u25bc" : "\u25ba"} {title}</strong>
      </button>
      {open && <div style={{ whiteSpace: "pre-line", marginLeft: 16 }}>{children}</div>}
    </div>
  );
}

function ChemicalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { chemicals, loading, error: hookError, updateChemical, deleteChemical } = useChemicals();
  const { addToRecent } = useRecentlyViewed();

  const [chemical, setChemical] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [deleted, setDeleted] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertVariant, setAlertVariant] = useState("warning");

  // Find the chemical from the loaded list
  useEffect(() => {
    if (loading) return;

    const decodedId = decodeURIComponent(id);
    const match = (c) => {
      const candidate = String(c.CAS || c.id || c['Chemical Name'] || c.name || '').toLowerCase();
      return candidate === String(decodedId).toLowerCase();
    };
    const chem = chemicals.find(match);
    setChemical(chem || null);
    setEditForm(chem ? { ...chem } : null);
    if (chem) addToRecent(chem);
  }, [id, chemicals, loading]);

  const handleEditClick = () => {
    setEditMode(true);
    setEditForm({ ...chemical });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    // Use the hook to update and persist
    updateChemical(editForm);
    setChemical({ ...editForm });
    setEditMode(false);
    setAlertVariant('success');
    setAlertMsg('Changes saved successfully.');
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this chemical? This cannot be undone.")) {
      if (chemical) {
        deleteChemical(chemical.id);
        setDeleted(true);
      }
    }
  };

  if (deleted) {
    return (
      <div className="app-container">
        <div className="page-header">
          <div className="header-content d-flex align-items-center justify-content-between flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => navigate("/chemicals")}
            >
              &larr; Back to Chemicals
            </button>
            <h1 className="section-title mb-0">Chemical Detail</h1>
          </div>
        </div>
        <div className="data-table-container">
          <div className="alert alert-success mb-3" role="alert">
            Chemical deleted.
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/chemicals")}
          >
            Back to list
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="app-container"><p>Loading...</p></div>;
  }

  if (!chemical) {
    return (
      <div className="app-container">
        <div className="page-header">
          <div className="header-content d-flex align-items-center justify-content-between flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => navigate("/chemicals")}
            >
              &larr; Back to Chemicals
            </button>
            <h1 className="section-title mb-0">Chemical Detail</h1>
          </div>
        </div>
        <div className="data-table-container">
          {alertMsg && (
            <div className={`alert alert-${alertVariant} d-flex justify-content-between align-items-center mb-3`} role="alert">
              <span>{alertMsg}</span>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setAlertMsg("")}
              ></button>
            </div>
          )}
          <p className="mb-0">{hookError || "Chemical not found."}</p>
        </div>
      </div>
    );
  }

  let pictograms = [];
  let nfpa = { health: '', flammability: '', reactivity: '', special: '' };
  if (chemical["Hazard Information"]) {
    // GHS pictograms (Unicode icons)
    const match = chemical["Hazard Information"].match(/([\u2600-\u26FF\u2700-\u27BF\u2B50-\u2BFF\u2620-\u2623\u274C\u2757\u26A0\u26A1\u26D4\u26C4\u26C8\u26FD\u269B\u269C\u2695\u2696\u2697\u2698\u2699\u269A\u269B\u269C\u26A0\u26A1\u26D4\u26C4\u26C8\u26FD\u2620\u2622\u2623\u262E\u262F\u2638\u2639\u263A\u263B\u263C\u263D\u263E\u263F\u2640\u2641\u2642\u2643\u2644\u2645\u2646\u2647\u2648\u2649\u264A\u264B\u264C\u264D\u264E\u264F\u2650\u2651\u2652\u2653\u2654\u2655\u2656\u2657\u2658\u2659\u265A\u265B\u265C\u265D\u265E\u265F\u2660\u2661\u2662\u2663\u2664\u2665\u2666\u2667\u2668\u2669\u266A\u266B\u266C\u266D\u266E\u266F\u2670\u2671\u2672\u2673\u2674\u2675\u2676\u2677\u2678\u2679\u267A\u267B\u267C\u267D\u267E\u267F]+)/g);
    if (match) pictograms = match;
    // NFPA 704 Diamond logic could go here if needed
  }

  return (
    <div className="app-container">
      <div className="page-header">
        <div className="header-content d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => navigate(-1)}
            >
              &larr; Back
            </button>
            <h1 className="section-title mb-0">
              {editMode ? editForm["Chemical Name"] : chemical["Chemical Name"] || chemical.title}
            </h1>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setShowQR(true)}
            >
              📷 QR Code
            </button>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => window.print()}
            >
              🖨️ Print
            </button>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={handleEditClick}
            >
              Edit
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="data-table-container p-0 overflow-hidden">
        {alertMsg && (
          <div className={`alert alert-${alertVariant} d-flex justify-content-between align-items-center mb-0`} role="alert">
            <span>{alertMsg}</span>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setAlertMsg("")}
            ></button>
          </div>
        )}
        <img
          src={
            (editMode ? editForm.image : chemical.image)
            || chemical.structureImage
            || `${BASE}chemical-images/${(chemical["Chemical Name"] || chemical.title || "placeholder")}.jpg`
          }
          onError={e => {
            // Try .png if .jpg fails, else fallback to placeholder
            if (!e.target.src.endsWith('.png') && !e.target.src.includes('via.placeholder.com')) {
              const base = `${BASE}chemical-images/${(chemical["Chemical Name"] || chemical.title || "placeholder")}`;
              e.target.onerror = null;
              e.target.src = base + '.png';
            } else {
              e.target.onerror = null;
              e.target.src = `${BASE}assets/logo.svg`;
            }
          }}
          alt={chemical["Chemical Name"]}
          className="img-fluid w-100 border-bottom"
          style={{ height: "220px", objectFit: "contain", background: "#f8f9fa" }}
        />
        <div className="p-3 p-md-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-2 gap-2">
            <h2 className="h4 mb-0 text-center text-md-start flex-grow-1">
              {editMode ? editForm["Chemical Name"] : chemical["Chemical Name"] || chemical.title}
            </h2>
            {!editMode && Array.isArray(chemical.tags) && chemical.tags.length > 0 && (
              <div className="d-flex flex-wrap gap-1 justify-content-center justify-content-md-end ms-md-3">
                {chemical.tags.map((t) => (
                  <span key={t} className="badge-coral">{t}</span>
                ))}
              </div>
            )}
            {!editMode && (
              <div className="d-flex gap-2 justify-content-center justify-content-md-end">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleEditClick}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          {/* GHS pictograms */}
          {pictograms.length > 0 && (
            <div className="mb-2 text-center" style={{ fontSize: 32 }}>
              {pictograms.map((icon, i) => <span key={i} style={{ marginRight: 8 }}>{icon}</span>)}
            </div>
          )}
          {editMode && editForm ? (
            <form onSubmit={handleEditSave} className="mb-3">
              <div className="row g-2">
                <div className="col-12 col-md-4">
                  <label htmlFor="edit-chemical-name" className="form-label">Chemical Name</label>
                  <input
                    id="edit-chemical-name"
                    type="text"
                    name="Chemical Name"
                    className="form-control"
                    placeholder="e.g. Acetone"
                    value={editForm["Chemical Name"] || ""}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label htmlFor="edit-formula" className="form-label">Formula</label>
                  <input
                    id="edit-formula"
                    type="text"
                    name="Formula"
                    className="form-control"
                    placeholder="e.g. C3H6O"
                    value={editForm["Formula"] || ""}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label htmlFor="edit-cas" className="form-label">CAS Number</label>
                  <input
                    id="edit-cas"
                    type="text"
                    name="CAS"
                    className="form-control"
                    placeholder="e.g. 67-64-1"
                    value={editForm["CAS"] || ""}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>
              <div className="row g-2 mt-2">
                <div className="col-12 col-md-4">
                  <label htmlFor="edit-mw" className="form-label">Molecular Weight</label>
                  <input
                    id="edit-mw"
                    type="text"
                    name="Molecular Weight"
                    className="form-control"
                    placeholder="e.g. 58.08 g/mol"
                    value={editForm["Molecular Weight"] || ""}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label htmlFor="edit-density" className="form-label">Density</label>
                  <input
                    id="edit-density"
                    type="text"
                    name="Density"
                    className="form-control"
                    placeholder="e.g. 0.79 g/mL"
                    value={editForm["Density"] || ""}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label htmlFor="edit-appearance" className="form-label">Appearance</label>
                  <input
                    id="edit-appearance"
                    type="text"
                    name="Appearance"
                    className="form-control"
                    placeholder="e.g. Colorless liquid"
                    value={editForm["Appearance"] || ""}
                    onChange={handleEditChange}
                  />
                </div>
              </div>
              <div className="row g-2 mt-2">
                <div className="col-12 col-md-6">
                  <label htmlFor="edit-hazard" className="form-label">Hazard Information</label>
                  <input
                    id="edit-hazard"
                    type="text"
                    name="Hazard Information"
                    className="form-control"
                    placeholder="e.g. Flammable, irritant"
                    value={editForm["Hazard Information"] || ""}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label htmlFor="edit-properties" className="form-label">Properties</label>
                  <input
                    id="edit-properties"
                    type="text"
                    name="Properties"
                    className="form-control"
                    placeholder="e.g. Miscible with water"
                    value={editForm["Properties"] || ""}
                    onChange={handleEditChange}
                  />
                </div>
              </div>
              <div className="row g-2 mt-2">
                <div className="col-12 col-md-6">
                  <label htmlFor="edit-handling" className="form-label">Handling &amp; Storage</label>
                  <input
                    id="edit-handling"
                    type="text"
                    name="Handling & Storage"
                    className="form-control"
                    placeholder="e.g. Store in cool, dry place"
                    value={editForm["Handling & Storage"] || ""}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label htmlFor="edit-safety" className="form-label">Safety Notes</label>
                  <input
                    id="edit-safety"
                    type="text"
                    name="Safety Notes"
                    className="form-control"
                    placeholder="e.g. Use gloves and goggles"
                    value={editForm["Safety Notes"] || ""}
                    onChange={handleEditChange}
                  />
                </div>
              </div>
              <div className="row g-2 mt-2">
                <div className="col-12 col-md-6">
                  <label htmlFor="edit-lab-notes" className="form-label">Lab Use Notes</label>
                  <input
                    id="edit-lab-notes"
                    type="text"
                    name="Lab Use Notes"
                    className="form-control"
                    placeholder="e.g. Used as solvent"
                    value={editForm["Lab Use Notes"] || ""}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label htmlFor="edit-sds" className="form-label">SDS Link</label>
                  <input
                    id="edit-sds"
                    type="text"
                    name="SDS Link"
                    className="form-control"
                    placeholder="Paste SDS URL (optional)"
                    value={editForm["SDS Link"] || ""}
                    onChange={handleEditChange}
                  />
                </div>
              </div>
              <div className="row g-2 mt-2">
                <div className="col-12 col-md-6">
                  <label htmlFor="edit-image" className="form-label">Image URL</label>
                  <input
                    id="edit-image"
                    type="text"
                    name="image"
                    className="form-control"
                    placeholder="Paste image URL (optional)"
                    value={editForm.image || ""}
                    onChange={handleEditChange}
                  />
                </div>
              </div>
              <div className="mt-3 d-flex flex-column flex-md-row gap-2">
                <button type="submit" className="btn btn-primary">Save</button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <ul className="list-unstyled mb-2">
                {chemical["Formula"] && <li><strong>Formula:</strong> {chemical["Formula"]}</li>}
                {chemical["CAS"] && <li><strong>CAS #:</strong> {chemical["CAS"]}</li>}
                {chemical["Molecular Weight"] && <li><strong>Molecular Weight:</strong> {chemical["Molecular Weight"]}</li>}
                {chemical["Density"] && <li><strong>Density:</strong> {chemical["Density"]}</li>}
                {chemical["Appearance"] && <li><strong>Appearance:</strong> {chemical["Appearance"]}</li>}
                {chemical["SDS Link"] && (
                  <li><strong>SDS:</strong> <a href={chemical["SDS Link"]} target="_blank" rel="noopener noreferrer">View SDS</a></li>
                )}
              </ul>
              {chemical["Hazard Information"] && (
                <CollapsibleSection title="Hazard Information">
                  {chemical["Hazard Information"]}
                </CollapsibleSection>
              )}
              {chemical["Properties"] && (
                <CollapsibleSection title="Properties">
                  {chemical["Properties"]}
                </CollapsibleSection>
              )}
              {chemical["Handling & Storage"] && (
                <CollapsibleSection title="Handling & Storage">
                  {chemical["Handling & Storage"]}
                </CollapsibleSection>
              )}
              {chemical["Safety Notes"] && (
                <CollapsibleSection title="Safety Notes">
                  {chemical["Safety Notes"]}
                </CollapsibleSection>
              )}
              {chemical["Lab Use Notes"] && (
                <CollapsibleSection title="Lab Use Notes">
                  {chemical["Lab Use Notes"]}
                </CollapsibleSection>
              )}
            </>
          )}
        </div>
      </div>
      <CollapsibleSection title="Inventory Status" isOpen={true}>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="p-3 border rounded bg-light">
              <div className="text-muted small mb-1">Current Quantity</div>
              <div className="fs-4 fw-bold">
                {chemical.inventory?.quantity || 0} {chemical.inventory?.unit || 'g'}
              </div>
              {chemical.inventory?.lowStockThreshold > 0 &&
                (chemical.inventory?.quantity || 0) <= chemical.inventory.lowStockThreshold && (
                  <div className="badge bg-danger mt-2">Low Stock Alert</div>
                )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-3 border rounded bg-light">
              <div className="text-muted small mb-1">Location</div>
              <div className="fs-5">{chemical.inventory?.location || 'Not assigned'}</div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-3 border rounded bg-light">
              <div className="text-muted small mb-1">Expiration Date</div>
              <div className={`fs-5 ${chemical.inventory?.expirationDate && new Date(chemical.inventory.expirationDate) < new Date() ? 'text-danger fw-bold' : ''}`}>
                {chemical.inventory?.expirationDate ? new Date(chemical.inventory.expirationDate).toLocaleDateString() : 'N/A'}
                {chemical.inventory?.expirationDate && new Date(chemical.inventory.expirationDate) < new Date() && (
                  <span className="badge bg-danger ms-2">Expired</span>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-3 border rounded bg-light">
              <div className="text-muted small mb-1">Last Updated</div>
              <div className="fs-5">{new Date(chemical.dateAdded || Date.now()).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Usage History">
        <ChemicalUsageHistory chemicalId={chemical.id} />
      </CollapsibleSection>

      <QRCodeModal
        show={showQR}
        onClose={() => setShowQR(false)}
        chemical={chemical}
        url={window.location.href}
      />
    </div>
  );
}

export default ChemicalDetail;
