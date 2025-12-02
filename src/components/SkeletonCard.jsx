import React from 'react';
import '../styles/modern.css';

function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton-image skeleton"></div>
            <div className="skeleton-content">
                <div className="skeleton-title skeleton"></div>
                <div className="skeleton-formula skeleton"></div>
                <div className="skeleton-text skeleton"></div>
                <div className="skeleton-text-short skeleton"></div>
                <div className="skeleton-button skeleton"></div>
            </div>
        </div>
    );
}

export default SkeletonCard;
