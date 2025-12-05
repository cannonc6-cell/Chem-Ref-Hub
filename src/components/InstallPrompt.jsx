import React, { useState, useEffect } from 'react';

/**
 * InstallPrompt Component
 * Shows a banner prompting user to install the PWA
 */
function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
            setIsInstalled(true);
            return;
        }

        // Check if user previously dismissed
        const dismissed = localStorage.getItem('installPromptDismissed');
        if (dismissed) {
            const dismissedDate = new Date(parseInt(dismissed));
            const now = new Date();
            const daysSinceDismissed = (now - dismissedDate) / (1000 * 60 * 60 * 24);

            // Show again after 7 days
            if (daysSinceDismissed < 7) {
                return;
            }
        }

        // Listen for beforeinstallprompt event
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setShowPrompt(false);
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            // Only log in development
            if (import.meta.env.DEV) {
                console.log('User accepted the install prompt');
            }
        } else {
            if (import.meta.env.DEV) {
                console.log('User dismissed the install prompt');
            }
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('installPromptDismissed', Date.now().toString());
    };

    if (isInstalled || !showPrompt) {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9998,
            maxWidth: '500px',
            width: 'calc(100% - 40px)',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            border: '1px solid var(--border-light)',
            animation: 'slideUp 0.3s ease-out',
            overflow: 'hidden'
        }}>
            {/* Gradient top border */}
            <div style={{
                height: '4px',
                background: 'linear-gradient(90deg, var(--purple), var(--pink), var(--teal))'
            }} />

            <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    {/* App Icon */}
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, var(--purple), var(--pink))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        flexShrink: 0
                    }}>
                        🧪
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                            margin: '0 0 0.5rem',
                            fontSize: '1rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)'
                        }}>
                            Install ChemRef Hub
                        </h3>
                        <p style={{
                            margin: 0,
                            fontSize: '0.875rem',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.5
                        }}>
                            Install this app for quick access and offline functionality
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
                        onClick={handleInstall}
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
                        Install App
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
                        Not Now
                    </button>
                </div>
            </div>

            <style>
                {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(100px);
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }
        `}
            </style>
        </div>
    );
}

export default InstallPrompt;
