import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Nav({ searchValue, onSearchChange, showSearch = false }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg fixed-top" style={{
      backgroundColor: 'var(--primary)',
      boxShadow: 'var(--shadow-lg)'
    }}>
      <div className="container-fluid" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
        <a href="#main-content" className="visually-hidden-focusable btn btn-light btn-sm me-2">Skip to content</a>
        <Link className="navbar-brand" to="/dashboard" style={{ fontWeight: '700', fontSize: 'var(--text-xl)' }}>
          ChemRef Hub
        </Link>

        {/* Integrated Search Bar (Desktop) */}
        {showSearch && (
          <div className="d-none d-lg-flex flex-grow-1 mx-4" style={{ maxWidth: '500px' }}>
            <input
              type="search"
              className="form-control"
              placeholder="Search chemicals..."
              value={searchValue || ''}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#fff',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
              }}
            />
          </div>
        )}

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarResponsive"
          aria-expanded={open ? "true" : "false"}
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
          style={{
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '0.5rem'
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`} id="navbarResponsive">
          {/* Mobile Search Bar */}
          {showSearch && (
            <div className="d-lg-none mt-3 mb-2">
              <input
                type="search"
                className="form-control"
                placeholder="Search chemicals..."
                value={searchValue || ''}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  padding: '0.75rem 1rem',
                }}
              />
            </div>
          )}

          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                to="/dashboard"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname.startsWith('/chemicals') ? 'active' : ''}`}
                to="/chemicals"
                onClick={() => setOpen(false)}
              >
                Chemicals
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/add-chemical' ? 'active' : ''}`}
                to="/add-chemical"
                onClick={() => setOpen(false)}
              >
                Add Chemical
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/safety' ? 'active' : ''}`}
                to="/safety"
                onClick={() => setOpen(false)}
              >
                Safety
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/logbook' ? 'active' : ''}`}
                to="/logbook"
                onClick={() => setOpen(false)}
              >
                Logbook
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/resources' ? 'active' : ''}`}
                to="/resources"
                onClick={() => setOpen(false)}
              >
                Resources
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/glossary' ? 'active' : ''}`}
                to="/glossary"
                onClick={() => setOpen(false)}
              >
                Glossary
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/faq' ? 'active' : ''}`}
                to="/faq"
                onClick={() => setOpen(false)}
              >
                FAQ
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
                to="/about"
                onClick={() => setOpen(false)}
              >
                About
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
