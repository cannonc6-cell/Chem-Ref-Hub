import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console in development
        if (import.meta.env.DEV) {
            console.error('Error caught by boundary:', error, errorInfo);
        }

        // In production, you could send to error reporting service
        // Example: Sentry.captureException(error, { extra: errorInfo });

        this.setState({
            error,
            errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: '2rem',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)'
                }}>
                    <div style={{
                        maxWidth: '600px',
                        textAlign: 'center',
                        padding: '2rem',
                        backgroundColor: 'var(--surface)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️ Something went wrong</h1>
                        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                            We're sorry for the inconvenience. The application encountered an error.
                        </p>

                        {import.meta.env.DEV && this.state.error && (
                            <details style={{
                                textAlign: 'left',
                                marginTop: '1rem',
                                padding: '1rem',
                                backgroundColor: 'var(--bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.875rem'
                            }}>
                                <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                    Error Details
                                </summary>
                                <pre style={{
                                    overflow: 'auto',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word'
                                }}>
                                    {this.state.error.toString()}
                                    {'\n\n'}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                marginTop: '1.5rem',
                                padding: '0.75rem 1.5rem',
                                backgroundColor: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            🔄 Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
