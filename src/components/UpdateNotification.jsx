import React, { useState, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * UpdateNotification Component
 * Shows notification when app update is available
 */
function UpdateNotification() {
    const [showUpdate, setShowUpdate] = useState(false);

    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(registration) {
            if (import.meta.env.DEV) {
                console.log('Service Worker registered:', registration);
            }
        },
        onRegisterError(error) {
            if (import.meta.env.DEV) {
                console.log('Service Worker registration error:', error);
            }
        },
    });

    useEffect(() => {
        if (needRefresh) {
            setShowUpdate(true);
        }
    }, [needRefresh]);

    const handleUpdate = () => {
        updateServiceWorker(true);
    };

    const handleDismiss = () => {
        setShowUpdate(false);
        setNeedRefresh(false);
    };

    if (!showUpdate) {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            maxWidth: '400px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            border: '1px solid var(--border-light)',
            animation: 'slideIn 0.3s ease-out',
            overflow: 'hidden'
        }}>
            {/* Gradient top border */}
            <div style={{
                height: '4px',
                background: 'linear-gradient(90deg, var(--teal), var(--indigo))'
            }} />

            <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    {/* Icon */}
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, var(--teal), var(--indigo))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        flexShrink: 0
                    }}>
                        ⬆️
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                            margin: '0 0 0.5rem',
                            fontSize: '1rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)'
                        }}>
                            Update Available
                        </h3>
                        <p style={{
                            margin: 0,
                            fontSize: '0.875rem',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.5
                        }}>
                            A new version of ChemRef Hub is ready. Update now to get the latest features and improvements.
                        </p>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={handleDismiss}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            color: 'var(--text-tertiary)',
                            flexShrink: 0
                        }}
                        aria-label="Dismiss"
                    >
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Action buttons */}
                <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    marginTop: '1rem'
                }}>
                    <button
                        onClick={handleUpdate}
                        className="btn-gradient"
                        style={{
                            flex: 1,
                            padding: '0.625rem 1rem',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Update Now
                    </button>
                    <button
                        onClick={handleDismiss}
                        style={{
                            padding: '0.625rem 1rem',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            border: '1px solid var(--border-medium)',
                            backgroundColor: 'transparent',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        Later
                    </button>
                </div>
            </div>

            <style>
                {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(100px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
            </style>
        </div>
    );
}

export default UpdateNotification;
