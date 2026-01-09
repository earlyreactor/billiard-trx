import { getSheets, SPREADSHEET_ID } from './googleSheets';

export async function getAnalyticsData() {
    const sheets = await getSheets();
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Transaksi!A:E',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return [];

    // Columns: [Timestamp, Name, Phone, Duration, Cost]
    // Skip header (row 0)
    const transactions = rows.slice(1);

    const dailyStats = {};

    transactions.forEach(row => {
        const timestamp = row[0];
        const durationStr = row[3];
        const costStr = row[4];

        if (!timestamp) return;

        // Parse Date
        // Timestamp format assumed: "9/2/2024, 16:38:27" (en-US) or similar
        // We'll try to parse it safely
        const dateObj = new Date(timestamp);
        if (isNaN(dateObj.getTime())) return;

        // Format as YYYY-MM-DD for grouping
        const dayKey = dateObj.toISOString().split('T')[0];

        // Parse Numbers
        const duration = parseFloat(durationStr) || 0;

        // Parse Cost: "Rp 150.000" -> 150000
        const cost = parseFloat((costStr || '0').replace(/[^0-9.-]+/g, ''));

        if (!dailyStats[dayKey]) {
            dailyStats[dayKey] = { day: dayKey, duration: 0, cost: 0 };
        }

        dailyStats[dayKey].duration += duration;
        dailyStats[dayKey].cost += cost;
    });

    // Convert to array and sort by date
    return Object.values(dailyStats).sort((a, b) => a.day.localeCompare(b.day));
}

export async function getDividendsData() {
    const sheets = await getSheets();
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'RUPS!A:H',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return { headers: [], data: [] };

    const headers = rows[0];
    const data = rows.slice(1).map(row => ({
        month: row[0],
        total: row[1],
        bapak: row[2],
        marshal: row[3],
        yodi: row[4],
        maintenance: row[5],
        remarks: row[6] || '',
        control: row[7] || '',
    }));

    // Filter empty rows if any
    const cleanData = data.filter(d => d.month && d.month !== '#N/A');

    return { headers, data: cleanData };
}
