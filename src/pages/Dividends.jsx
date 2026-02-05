import { useTransactions } from '../context/TransactionContext';

const formatCurrency = (val) => `Rp ${val.toLocaleString('id-ID')}`;

const SummaryCard = ({ title, value, color }) => (
    <div className="glass-panel p-6 flex flex-col justify-between h-full">
        <h3 className="text-gray-500 text-sm font-semibold mb-2 uppercase tracking-wider">{title}</h3>
        <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
    </div>
);

export default function Dividends() {
    const { getMonthlySummary } = useTransactions();
    const summaryData = getMonthlySummary();

    // Calculations
    const calculatedData = summaryData.map(item => {
        const total = item.totalRevenue;
        return {
            month: item.name,
            total: formatCurrency(total),
            bapak: formatCurrency(total * 0.30),
            marshal: formatCurrency(total * 0.60),
            maintenance: formatCurrency(total * 0.10),
            rawTotal: total // kept for sum calculation
        };
    });

    const totalRevenueAllTime = calculatedData.reduce((acc, curr) => acc + curr.rawTotal, 0);
    const totalBapak = totalRevenueAllTime * 0.30;
    const totalMarshal = totalRevenueAllTime * 0.60;
    const totalMaintenance = totalRevenueAllTime * 0.10;

    return (
        <div className="flex flex-col gap-10 fade-in">
            <div className="flex items-center gap-4">
                <img
                    src="/dividends.png"
                    alt="icon"
                    className="w-12 h-12 object-contain hidden"
                    onError={(e) => e.target.style.display = 'none'}
                    onLoad={(e) => e.target.style.display = 'block'}
                />
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Dividends Distribution (RUPS)
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard title="Total Distributed" value={formatCurrency(totalRevenueAllTime)} color="text-gray-900" />
                <SummaryCard title="Bapak Share (30%)" value={formatCurrency(totalBapak)} color="text-green-600" />
                <SummaryCard title="Marshal Share (60%)" value={formatCurrency(totalMarshal)} color="text-blue-600" />
                <SummaryCard title="Maintenance (10%)" value={formatCurrency(totalMaintenance)} color="text-orange-500" />
            </div>

            <div className="glass-panel overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap">Month</th>
                            <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap">Total Revenue</th>
                            <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap">Bapak (30%)</th>
                            <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap">Marshal (60%)</th>
                            <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap">Maintenance (10%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {calculatedData.map((row, i) => (
                            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                                <td className="p-4 font-semibold text-gray-900">{row.month}</td>
                                <td className="p-4 text-gray-600">{row.total}</td>
                                <td className="p-4 text-green-600 font-medium">{row.bapak}</td>
                                <td className="p-4 text-blue-600 font-medium">{row.marshal}</td>
                                <td className="p-4 text-orange-500 font-medium">{row.maintenance}</td>
                            </tr>
                        ))}
                        {calculatedData.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">No transaction data found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
