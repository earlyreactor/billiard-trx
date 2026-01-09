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

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-primary">Dividends Distribution (RUPS)</h1>

            {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded mb-6">
                    {error}
                </div>
            )}

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
                                <td className="p-3 text-green-400">{row.marshal}</td>
                                <td className="p-3 text-green-400">{row.yodi}</td>
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
