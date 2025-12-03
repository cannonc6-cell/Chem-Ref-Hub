import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";

function Nav({ searchValue, onSearchChange, showSearch = false }) {
  const { user, authLoading, signInWithGoogle, signOutUser } = useAuth();

  return (
    <header className="header" style={{
      height: 'var(--header-height)',
      backgroundColor: 'var(--header-bg)',
      borderBottom: '1px solid var(--header-border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 900,
      width: '100%'
    }}>
      {/* Search Bar */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        {showSearch && (
          <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
            <div style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center'
            }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              placeholder="Search chemicals, properties, or records..."
              value={searchValue || ''}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.625rem 1rem 0.625rem 2.5rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '0.9375rem',
                outline: 'none',
                transition: 'all var(--transition-fast)'
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = 'var(--surface)';
                e.target.style.borderColor = 'var(--primary-light)';
                e.target.style.boxShadow = '0 0 0 3px var(--primary-lighter)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = 'var(--bg-secondary)';
                e.target.style.borderColor = 'var(--border-light)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ThemeToggle />

        {/* Notification Bell (Mock) */}
        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          aria-label="Notifications"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        {!authLoading && (
          <div className="d-flex align-items-center">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="user-info-desktop" style={{ textAlign: 'right', display: 'none' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {(() => {
                      const savedProfile = localStorage.getItem(`userProfile_${user.uid}`);
                      if (savedProfile) {
                        try {
                          const profileData = JSON.parse(savedProfile);
                          return profileData.customName || user.displayName || 'User';
                        } catch {
                          return user.displayName || 'User';
                        }
                      }
                      return user.displayName || 'User';
                    })()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Researcher</div>
                </div>

                <Link to="/profile" style={{ textDecoration: 'none' }}>
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--border-light)'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: '1.25rem'
                    }}>
                      {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={signInWithGoogle}
                style={{
                  backgroundColor: 'var(--primary)',
                  borderColor: 'var(--primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.5rem 1rem',
                  fontWeight: 500
                }}
              >
                Sign in
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Nav;
