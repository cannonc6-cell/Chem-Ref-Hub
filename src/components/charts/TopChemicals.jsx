import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

/**
 * Top Chemicals Bar Chart
 * Shows most used or viewed chemicals
 */
function TopChemicals({ data, title = "Most Used Chemicals" }) {
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
                No data available
            </div>
        );
    }

    // Color palette for bars
    const colors = ['#0369A1', '#8B5CF6', '#F59E0B', '#64748B', '#0EA5E9', '#A78BFA', '#FCD34D', '#94A3B8'];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
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
                    {data.formula && (
                        <p style={{ margin: 0, color: '#64748B', fontSize: '0.875rem', fontFamily: 'monospace' }}>
                            {data.formula}
                        </p>
                    )}
                    <p style={{ margin: 0, color: '#64748B', fontSize: '0.875rem', marginTop: '4px' }}>
                        Uses: {data.count}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: '#64748B', fontSize: 12 }}
                    width={90}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

export default TopChemicals;




