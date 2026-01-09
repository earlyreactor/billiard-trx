import { getSheets, SPREADSHEET_ID } from './googleSheets';

export async function getAnalyticsData() {
    const sheets = await getSheets();
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Analytics!A:D',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return [];

    // Skip header
    // Headers: Timestamp - Year-Month, Timestamp - Day-Month, SUM of Durasi, SUM of Biaya
    const data = rows.slice(1).map(row => {
        // Helper to parse currency "Rp105,000" -> 105000
        const parseCurrency = (val) => {
            if (!val) return 0;
            return parseFloat(val.toString().replace(/[^0-9.-]+/g, ""));
        };

        return {
            month: row[0],
            day: row[1],
            duration: parseFloat(row[2] || 0),
            cost: parseCurrency(row[3])
        };
    });

    return data;
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
