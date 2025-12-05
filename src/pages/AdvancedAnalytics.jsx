import React, { useMemo } from 'react';
import { useChemicals } from '../hooks/useChemicals';

const AdvancedAnalytics = () => {
    const { chemicals } = useChemicals();

    // Calculate analytics data
    const analytics = useMemo(() => {
        const now = new Date();

        // Usage by category
        const categoryStats = {};
        chemicals.forEach(chem => {
            const category = chem.category || 'Uncategorized';
            categoryStats[category] = (categoryStats[category] || 0) + 1;
        });

        // Expiring soon (next 30 days)
        const expiringSoon = chemicals.filter(chem => {
            if (!chem.inventory?.expirationDate) return false;
            const expDate = new Date(chem.inventory.expirationDate);
            const daysUntil = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
            return daysUntil >= 0 && daysUntil <= 30;
        });

        // Already expired
        const expired = chemicals.filter(chem => {
            if (!chem.inventory?.expirationDate) return false;
            return new Date(chem.inventory.expirationDate) < now;
        });

        // Hazard distribution
        const hazardStats = {};
        chemicals.forEach(chem => {
            if (chem.hazards && Array.isArray(chem.hazards)) {
                chem.hazards.forEach(hazard => {
                    hazardStats[hazard] = (hazardStats[hazard] || 0) + 1;
                });
            }
        });

        // Low stock items
        const lowStock = chemicals.filter(chem => {
            const qty = chem.inventory?.quantity || 0;
            const threshold = chem.inventory?.lowStockThreshold || 10;
            return qty > 0 && qty <= threshold;
        });

        // Total inventory value (if prices available)
        const totalValue = chemicals.reduce((sum, chem) => {
            const price = chem.pricing?.pricePerUnit || 0;
            const quantity = chem.inventory?.quantity || 0;
            return sum + (price * quantity);
        }, 0);

        return {
            categoryStats,
            expiringSoon: expiringSoon.length,
            expired: expired.length,
            hazardStats,
            lowStock: lowStock.length,
            totalValue,
            totalChemicals: chemicals.length
        };
    }, [chemicals]);

    const topCategories = Object.entries(analytics.categoryStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const topHazards = Object.entries(analytics.hazardStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>📊 Advanced Analytics</h1>

            {/* Key Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div style={{
                    padding: '1.5rem',
                    backgroundColor: 'var(--surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-light)'
                }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Chemicals</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>{analytics.totalChemicals}</div>
                </div>

                <div style={{
                    padding: '1.5rem',
                    backgroundColor: 'var(--surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid #EF4444'
                }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>⚠️ Low Stock</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#EF4444' }}>{analytics.lowStock}</div>
                </div>

                <div style={{
                    padding: '1.5rem',
                    backgroundColor: 'var(--surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid #F59E0B'
                }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>⏰ Expiring Soon</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#F59E0B' }}>{analytics.expiringSoon}</div>
                </div>

                <div style={{
                    padding: '1.5rem',
                    backgroundColor: 'var(--surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid #DC2626'
                }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>❌ Expired</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#DC2626' }}>{analytics.expired}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                {/* Category Distribution */}
                <div style={{
                    backgroundColor: 'var(--surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-light)',
                    padding: '2rem'
                }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Chemical Categories</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {topCategories.map(([category, count]) => {
                            const percentage = (count / analytics.totalChemicals * 100).toFixed(1);
                            return (
                                <div key={category}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 500 }}>{category}</span>
                                        <span style={{ color: 'var(--text-secondary)' }}>{count} ({percentage}%)</span>
                                    </div>
                                    <div style={{
                                        height: '8px',
                                        backgroundColor: 'var(--bg-secondary)',
                                        borderRadius: '4px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${percentage}%`,
                                            backgroundColor: 'var(--primary)',
                                            transition: 'width 0.3s ease'
                                        }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Hazard Distribution */}
                <div style={{
                    backgroundColor: 'var(--surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-light)',
                    padding: '2rem'
                }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Top Hazards</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {topHazards.map(([hazard, count]) => {
                            const maxCount = Math.max(...Object.values(analytics.hazardStats));
                            const percentage = (count / maxCount * 100).toFixed(1);
                            const hazardColors = {
                                'Flammable': '#EF4444',
                                'Toxic': '#8B5CF6',
                                'Corrosive': '#F59E0B',
                                'Explosive': '#DC2626',
                                'Oxidizer': '#3B82F6'
                            };
                            const color = hazardColors[hazard] || 'var(--primary)';

                            return (
                                <div key={hazard}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 500 }}>{hazard}</span>
                                        <span style={{ color: 'var(--text-secondary)' }}>{count} chemicals</span>
                                    </div>
                                    <div style={{
                                        height: '8px',
                                        backgroundColor: 'var(--bg-secondary)',
                                        borderRadius: '4px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${percentage}%`,
                                            backgroundColor: color,
                                            transition: 'width 0.3s ease'
                                        }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Inventory Insights */}
            <div style={{
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                padding: '2rem'
            }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Inventory Insights</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>📦 Total Categories</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{Object.keys(analytics.categoryStats).length}</div>
                    </div>
                    <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>⚠️ Unique Hazards</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{Object.keys(analytics.hazardStats).length}</div>
                    </div>
                    <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>💰 Est. Total Value</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>${analytics.totalValue.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvancedAnalytics;
