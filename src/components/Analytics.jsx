import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import analyticsIcon from '../assets/analytics.png';

export default function Analytics() {
    const { getMonthlySummary } = useTransactions();
    const { theme } = useTheme();
    const data = getMonthlySummary();

    const isDark = theme === 'dark';
    const textColor = isDark ? '#eaeaea' : '#6b7280';
    const gridColor = isDark ? '#374151' : '#f3f4f6';
    const axisColor = isDark ? '#4b5563' : '#e5e7eb';

    // Custom tooltip for currency formatting
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div
                    className="p-4 rounded-2xl shadow-xl border"
                    style={{
                        background: isDark ? '#1f2937' : '#ffffff',
                        borderColor: isDark ? '#374151' : '#f3f4f6'
                    }}
                >
                    <p className="font-medium mb-1 text-sm" style={{ color: textColor }}>{label}</p>
                    <p className="font-bold text-lg" style={{ color: isDark ? '#eaeaea' : '#1f2937' }}>
                        Rp {payload[0].value.toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs" style={{ color: textColor, opacity: 0.7 }}>
                        Transactions: {payload[0].payload.count}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="glass-panel p-8 animate-fadeIn">
            <div className="flex items-center gap-3 mb-8">
                <img
                    src={analyticsIcon}
                    alt="icon"
                    className="w-10 h-10 object-contain"
                />
                <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Monthly Analytics</h2>
            </div>

            <div className="h-[300px] md:h-[400px] w-full">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke={textColor}
                                tick={{ fill: textColor, fontSize: 12 }}
                                axisLine={{ stroke: axisColor }}
                                tickLine={false}
                            />
                            <YAxis
                                stroke={textColor}
                                tick={{ fill: textColor, fontSize: 12 }}
                                tickFormatter={(val) => `Rp ${(val / 1000).toFixed(0)}k`}
                                axisLine={{ stroke: axisColor }}
                                tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? '#374151' : '#f9fafb' }} />
                            <Bar
                                dataKey="totalRevenue"
                                fill="var(--primary)"
                                radius={[8, 8, 8, 8]}
                                name="Revenue"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center" style={{ color: 'var(--foreground)', opacity: 0.5 }}>
                        No transaction data available yet.
                    </div>
                )}
            </div>
        </div>
    );
}

