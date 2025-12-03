import React, { useEffect } from 'react';

function NotFound() {
  useEffect(() => {
    document.title = 'Page Not Found – ChemRef Hub';
  }, []);

  return (
    <div className="not-found-page" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{
        fontSize: '6rem',
        fontWeight: 700,
        color: 'var(--primary-light)',
        lineHeight: 1,
        marginBottom: '1rem'
      }}>
        404
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Page Not Found</h1>
      <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '500px', marginBottom: '2rem' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <a href="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </a>
        <a href="/chemicals" className="btn btn-outline-primary">
          Browse Chemicals
        </a>
      </div>
    </div>
  );
}

export default NotFound;
