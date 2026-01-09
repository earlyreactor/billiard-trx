import { getDividendsData } from '@/lib/dataFetcher';

export const dynamic = 'force-dynamic';

export default async function DividendsPage() {
    let tableData = { headers: [], data: [] };
    let error = null;

    try {
        tableData = await getDividendsData();
    } catch (e) {
        console.error(e);
        error = "Failed to load dividends data.";
    }

    const { headers, data } = tableData;

    const totalBapak = data.reduce((acc, curr) => acc + parseFloat(curr.bapak.replace(/[^0-9.-]+/g, '')), 0);
    const totalMarshal = data.reduce((acc, curr) => acc + parseFloat(curr.marshal.replace(/[^0-9.-]+/g, '')), 0);
    const totalMaintenance = data.reduce((acc, curr) => acc + parseFloat(curr.maintenance.replace(/[^0-9.-]+/g, '')), 0);
    const totalDistributed = totalBapak + totalMarshal + totalMaintenance;

    const formatCurrency = (val) => `Rp ${val.toLocaleString('id-ID')}`;

    const SummaryCard = ({ title, value, color }) => (
        <div className="glass-panel p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
        </div>
    );

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Dividends Distribution (RUPS)
            </h1>

            {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded mb-6">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard title="Total Distributed" value={formatCurrency(totalDistributed)} color="text-white" />
                <SummaryCard title="Bapak Share (30%)" value={formatCurrency(totalBapak)} color="text-green-400" />
                <SummaryCard title="Marshal Share (60%)" value={formatCurrency(totalMarshal)} color="text-blue-400" />
                <SummaryCard title="Maintenance (10%)" value={formatCurrency(totalMaintenance)} color="text-orange-400" />
            </div>

            <div className="glass-panel overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-700">
                            {headers.map((h, i) => (
                                <th key={i} className="p-3 font-semibold text-primary whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                                <td className="p-3 font-medium">{row.month}</td>
                                <td className="p-3">{row.total}</td>
                                <td className="p-3 text-green-400">{row.bapak}</td>
                                <td className="p-3 text-blue-400">{row.marshal}</td>
                                <td className="p-3 text-purple-400">{row.yodi}</td>
                                <td className="p-3 text-orange-400">{row.maintenance}</td>
                                <td className="p-3 text-gray-400">{row.remarks}</td>
                                <td className="p-3 text-gray-500 text-sm">{row.control}</td>
                            </tr>
                        ))}
                        {data.length === 0 && !error && (
                            <tr>
                                <td colSpan={headers.length || 5} className="p-8 text-center text-gray-500">No data found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
