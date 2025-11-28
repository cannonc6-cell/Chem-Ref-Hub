## Chemical Reference Database

A professional React + Vite web app for chemists to browse, search, and manage a chemical database with user notes, favorites, import/export, and a lab logbook.

### Features
- Chemical directory: search by name, filter by tags, view details.
- Favorites: star chemicals and filter by favorites.
- Images: automatic file matching, lazy-loading, and fallback.
- Import/Export: JSON import with merge/replace, export current dataset.
- Add Chemicals: add your own to a local user list (stored in localStorage).
- Logbook: record usage additions/disposals with inline validation.
- Robust data loading: fetch from `/chemical_data.json` with automatic fallback to bundled `src/data/chemical_data.json`.
- Accessibility: labeled inputs, keyboard-friendly controls.

### Getting started
1. Install dependencies
	- npm install
2. Run the app (dev server)
	- npm run dev
3. Build for production
	- npm run build
4. Preview production build
	- npm run preview

### Project structure
- `public/chemical-images/` — image assets resolved by chemical names.
- `public/chemical_data.json` — primary data source fetched at runtime.
- `src/data/chemical_data.json` — bundled fallback data.
- `src/pages/` — main pages: Chemicals, ChemicalDetail, AddChemical, Logbook, Dashboard, Safety.
- `src/components/` — shared components like the navbar and footer.

### Notes
- User-added chemicals and favorites are stored locally in the browser (localStorage).
- Importing JSON supports merge (by CAS/name/id) or full replace.
- For multi-user persistence, connect a backend or cloud database (future work).

### License
This project is for educational and internal use. Add a license if publishing publicly.
