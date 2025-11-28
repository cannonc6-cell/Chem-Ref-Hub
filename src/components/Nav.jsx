import React from "react";
import { Link, useLocation } from "react-router-dom";

function Nav() {
  const location = useLocation();

  return (
  <nav className="navbar navbar-expand-lg fixed-top" style={{
      backgroundColor: 'var(--primary)',
      boxShadow: 'var(--shadow-lg)'
    }}>
      <div className="container">
    <a href="#main-content" className="visually-hidden-focusable btn btn-light btn-sm me-2">Skip to content</a>
  <Link className="navbar-brand" to="/dashboard" style={{ fontWeight: '600' }}>
          ChemRef Hub
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                to="/dashboard"
              >
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname.startsWith('/chemicals') ? 'active' : ''}`}
                to="/chemicals"
              >
                Chemicals
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/add-chemical' ? 'active' : ''}`}
                to="/add-chemical"
              >
                Add Chemical
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/safety' ? 'active' : ''}`}
                to="/safety"
              >
                Safety
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/logbook' ? 'active' : ''}`}
                to="/logbook"
              >
                Logbook
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/resources' ? 'active' : ''}`}
                to="/resources"
              >
                Resources
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/glossary' ? 'active' : ''}`}
                to="/glossary"
              >
                Glossary
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/faq' ? 'active' : ''}`}
                to="/faq"
              >
                FAQ
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
                to="/about"
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
