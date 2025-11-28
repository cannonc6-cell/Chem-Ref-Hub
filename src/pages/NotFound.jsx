import React, { useEffect } from 'react';
import '../styles/modern.css';

function NotFound() {
  useEffect(() => {
    document.title = 'Page Not Found – ChemRef Hub';
  }, []);

  return (
    <div className="app-container text-center">
      <div className="page-header">
        <div className="header-content">
          <h1 className="section-title">Page not found</h1>
        </div>
        <p className="lead mb-0">The page you are looking for doesn&apos;t exist or has been moved.</p>
      </div>
      <div className="mt-4 d-flex flex-column flex-sm-row justify-content-center gap-2">
        <a href="/dashboard" className="btn btn-primary">Back to Dashboard</a>
        <a href="/chemicals" className="btn btn-outline-primary">Browse Chemicals</a>
      </div>
    </div>
  );
}

export default NotFound;
