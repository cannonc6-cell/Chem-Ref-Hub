import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({
    title = "No items found",
    message = "Try adjusting your search or filters to find what you're looking for.",
    icon = "🔍",
    actionLabel,
    onAction,
    actionLink
}) => {
    return (
        <div className="text-center py-5 my-3 rounded bg-light border border-dashed" style={{ borderStyle: 'dashed' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>
                {icon}
            </div>
            <h3 className="h4 text-secondary mb-2">{title}</h3>
            <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
                {message}
            </p>

            {actionLabel && onAction && (
                <button className="btn btn-primary" onClick={onAction}>
                    {actionLabel}
                </button>
            )}

            {actionLabel && actionLink && (
                <Link to={actionLink} className="btn btn-primary">
                    {actionLabel}
                </Link>
            )}
        </div>
    );
};

export default EmptyState;
