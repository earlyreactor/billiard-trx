import { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { Download, Search, FileText, Table } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import dividendsIcon from '../assets/dividends.png';

const formatCurrency = (val) => `Rp ${val.toLocaleString('id-ID')}`;

const SummaryCard = ({ title, value, color }) => (
    <div className="glass-panel p-6 flex flex-col justify-between h-full">
        <h3 className="text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--foreground)', opacity: 0.6 }}>{title}</h3>
        <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
    </div>
);

export default function Dividends() {
    const { getMonthlySummary } = useTransactions();
    const summaryData = getMonthlySummary();
    const [searchTerm, setSearchTerm] = useState('');

    // Calculations
    const calculatedData = summaryData.map(item => {
        const total = item.totalRevenue;
        return {
            month: item.name,
            total: formatCurrency(total),
            bapak: formatCurrency(total * 0.30),
            marshal: formatCurrency(total * 0.60),
            maintenance: formatCurrency(total * 0.10),
            rawTotal: total,
            rawBapak: total * 0.30,
            rawMarshal: total * 0.60,
            rawMaintenance: total * 0.10
        };
    });

    // Filter data
    const filteredData = calculatedData.filter(row =>
        row.month.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRevenueAllTime = calculatedData.reduce((acc, curr) => acc + curr.rawTotal, 0);
    const totalBapak = totalRevenueAllTime * 0.30;
    const totalMarshal = totalRevenueAllTime * 0.60;
    const totalMaintenance = totalRevenueAllTime * 0.10;

    // Export to PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Dividends Report - Billiard TRX', 14, 22);
        doc.setFontSize(11);
        doc.text(`Generated: ${new Date().toLocaleDateString('id-ID')}`, 14, 30);

        doc.autoTable({
            startY: 40,
            head: [['Month', 'Total', 'Bapak (30%)', 'Marshal (60%)', 'Maintenance (10%)']],
            body: filteredData.map(row => [row.month, row.total, row.bapak, row.marshal, row.maintenance]),
            theme: 'striped',
            headStyles: { fillColor: [31, 41, 55] }
        });

        doc.save('dividends-report.pdf');
    };

    // Export to CSV
    const exportToCSV = () => {
        const headers = ['Month', 'Total', 'Bapak (30%)', 'Marshal (60%)', 'Maintenance (10%)'];
        const csvData = filteredData.map(row => [row.month, row.rawTotal, row.rawBapak, row.rawMarshal, row.rawMaintenance]);
        const csvContent = [headers, ...csvData].map(e => e.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'dividends-report.csv';
        link.click();
    };

    return (
        <div className="flex flex-col gap-10 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <img
                        src={dividendsIcon}
                        alt="icon"
                        className="w-12 h-12 object-contain"
                    />
                    <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--foreground)' }}>
                        Dividends Distribution
                    </h1>
                </div>
                <div className="flex gap-2">
                    <button onClick={exportToPDF} className="flex items-center gap-2 text-sm" style={{ padding: '0.5rem 1rem' }}>
                        <FileText size={16} /> PDF
                    </button>
                    <button onClick={exportToCSV} className="flex items-center gap-2 text-sm" style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: 'var(--primary-text)' }}>
                        <Table size={16} /> CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard title="Total Distributed" value={formatCurrency(totalRevenueAllTime)} color="text-gray-900" />
                <SummaryCard title="Bapak Share (30%)" value={formatCurrency(totalBapak)} color="text-green-600" />
                <SummaryCard title="Marshal Share (60%)" value={formatCurrency(totalMarshal)} color="text-blue-600" />
                <SummaryCard title="Maintenance (10%)" value={formatCurrency(totalMaintenance)} color="text-orange-500" />
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by month..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 w-full max-w-md"
                />
            </div>

            <div className="glass-panel p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="p-4 font-bold text-xs uppercase tracking-wider whitespace-nowrap" style={{ color: 'var(--foreground)', opacity: 0.6 }}>Month</th>
                                <th className="p-4 font-bold text-xs uppercase tracking-wider whitespace-nowrap" style={{ color: 'var(--foreground)', opacity: 0.6 }}>Total Revenue</th>
                                <th className="p-4 font-bold text-xs uppercase tracking-wider whitespace-nowrap" style={{ color: 'var(--foreground)', opacity: 0.6 }}>Bapak (30%)</th>
                                <th className="p-4 font-bold text-xs uppercase tracking-wider whitespace-nowrap" style={{ color: 'var(--foreground)', opacity: 0.6 }}>Marshal (60%)</th>
                                <th className="p-4 font-bold text-xs uppercase tracking-wider whitespace-nowrap" style={{ color: 'var(--foreground)', opacity: 0.6 }}>Maintenance (10%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((row, i) => (
                                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                                    <td className="p-4 font-semibold whitespace-nowrap" style={{ color: 'var(--foreground)' }}>{row.month}</td>
                                    <td className="p-4 whitespace-nowrap" style={{ color: 'var(--foreground)', opacity: 0.8 }}>{row.total}</td>
                                    <td className="p-4 text-green-600 font-medium whitespace-nowrap">{row.bapak}</td>
                                    <td className="p-4 text-blue-600 font-medium whitespace-nowrap">{row.marshal}</td>
                                    <td className="p-4 text-orange-500 font-medium whitespace-nowrap">{row.maintenance}</td>
                                </tr>
                            ))}
                            {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center" style={{ color: 'var(--foreground)', opacity: 0.5 }}>
                                        {searchTerm ? 'No matching data found' : 'No transaction data found'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

