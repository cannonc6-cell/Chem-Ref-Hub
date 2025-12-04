import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

/**
 * Hazard Distribution Pie Chart
 * Shows distribution of chemical hazards
 */
function HazardDistribution({ data }) {
    if (!data || data.length === 0) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '300px',
                color: 'var(--text-tertiary)',
                fontSize: '0.875rem'
            }}>
                No hazard data available
            </div>
        );
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (
                <div style={{
                    backgroundColor: 'white',
                    padding: '12px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    <p style={{ margin: 0, fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                        {data.name}
                    </p>
                    <p style={{ margin: 0, color: '#64748B', fontSize: '0.875rem' }}>
                        Count: {data.value}
                    </p>
                    <p style={{ margin: 0, color: '#64748B', fontSize: '0.875rem' }}>
                        {((data.value / data.payload.total) * 100).toFixed(1)}%
                    </p>
                </div>
            );
        }
        return null;
    };

    // Calculate total for percentages
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const dataWithTotal = data.map(item => ({ ...item, total }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={dataWithTotal}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#64748B', strokeWidth: 1 }}
                >
                    {dataWithTotal.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value, entry) => (
                        <span style={{ color: '#64748B', fontSize: '0.875rem' }}>{value}</span>
                    )}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

export default HazardDistribution;
