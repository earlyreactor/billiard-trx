import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useTransactions } from '../context/TransactionContext';

export default function Analytics() {
    const { getMonthlySummary } = useTransactions();
    const data = getMonthlySummary();

    // Custom tooltip for currency formatting
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-gray-100 rounded-2xl shadow-xl">
                    <p className="text-gray-500 font-medium mb-1 text-sm">{label}</p>
                    <p className="text-gray-900 font-bold text-lg">
                        Rp {payload[0].value.toLocaleString('id-ID')}
                    </p>
                    <p className="text-gray-400 text-xs">
                        Transactions: {payload[0].payload.count}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="glass-panel p-8 fade-in">
            <div className="flex items-center gap-3 mb-8">
                <img
                    src="/analytics.png"
                    alt="icon"
                    className="w-10 h-10 object-contain hidden"
                    onError={(e) => e.target.style.display = 'none'}
                    onLoad={(e) => e.target.style.display = 'block'}
                />
                <h2 className="text-2xl font-bold text-gray-900">Monthly Analytics</h2>
            </div>

            <div className="h-[300px] md:h-[400px] w-full">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="#9ca3af"
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                axisLine={{ stroke: '#e5e7eb' }}
                                tickLine={false}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                tickFormatter={(val) => `Rp ${(val / 1000).toFixed(0)}k`}
                                axisLine={{ stroke: '#e5e7eb' }}
                                tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                            <Bar
                                dataKey="totalRevenue"
                                fill="var(--primary)"
                                radius={[8, 8, 8, 8]}
                                name="Revenue"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        No transaction data available yet.
                    </div>
                )}
            </div>
        </div>
    );
}
