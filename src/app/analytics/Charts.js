'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AnalyticsCharts({ data }) {
    if (!data || data.length === 0) {
        return <div className="text-center p-8 text-gray-400">No analytics data available.</div>;
    }

    // Aggregate by Month for better view? Or just show raw daily?
    // Let's show the raw daily data but maybe limit strictness

    return (
        <div className="flex flex-col gap-8">
            <div className="glass-panel h-80">
                <h3 className="text-xl font-bold mb-4 text-primary">Revenue by Date</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="day" stroke="#888" fontSize={12} />
                        <YAxis stroke="#888" fontSize={12} tickFormatter={(value) => `Rp${value / 1000}k`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                            formatter={(value) => [`Rp ${value.toLocaleString()}`, 'Revenue']}
                        />
                        <Bar dataKey="cost" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="glass-panel h-80">
                <h3 className="text-xl font-bold mb-4 text-accent">Duration (Hours) by Date</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="day" stroke="#888" fontSize={12} />
                        <YAxis stroke="#888" fontSize={12} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                        />
                        <Bar dataKey="duration" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
