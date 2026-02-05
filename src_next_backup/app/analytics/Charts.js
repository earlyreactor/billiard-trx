'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AnalyticsCharts({ data }) {
    if (!data || data.length === 0) {
        return <div className="text-center p-8 text-gray-400">No analytics data available.</div>;
    }

    // Aggregate by Month for better view? Or just show raw daily?
    // Let's show the raw daily data but maybe limit strictness

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-panel" style={{ height: '320px' }}>
                <h3 style={{ marginBottom: '1rem', color: '#a1a1aa' }}>Revenue by Date</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis
                            dataKey="day"
                            stroke="#71717a"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#71717a"
                            fontSize={12}
                            tickFormatter={(value) => `Rp${value / 1000}k`}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(23, 23, 23, 0.9)',
                                borderColor: 'rgba(255,255,255,0.1)',
                                color: '#fff',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            formatter={(value) => [`Rp ${value.toLocaleString()}`, 'Revenue']}
                        />
                        <Bar
                            dataKey="cost"
                            fill="#8b5cf6"
                            radius={[4, 4, 0, 0]}
                            animationDuration={1500}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="glass-panel" style={{ height: '320px' }}>
                <h3 style={{ marginBottom: '1rem', color: '#a1a1aa' }}>Duration (Hours) by Date</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis
                            dataKey="day"
                            stroke="#71717a"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#71717a"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(23, 23, 23, 0.9)',
                                borderColor: 'rgba(255,255,255,0.1)',
                                color: '#fff',
                                borderRadius: '0.5rem'
                            }}
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Bar
                            dataKey="duration"
                            fill="#06b6d4"
                            radius={[4, 4, 0, 0]}
                            animationDuration={1500}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
