import { getSheets, SPREADSHEET_ID } from '../lib/googleSheets.js';
import fs from 'fs';
import path from 'path';

// Mock process.env for the module if needed, or rely on dotenv if I can load it.
// Since googleSheets.js uses process.env, I need to load it.
function loadEnv() {
    const envPaths = ['.env', '.env.local'];
    for (const p of envPaths) {
        if (fs.existsSync(p)) {
            const content = fs.readFileSync(p, 'utf8');
            content.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    let value = match[2].trim();
                    if ((value.startsWith('"') && value.endsWith('"'))) {
                        value = value.slice(1, -1);
                    }
                    process.env[match[1]] = value;
                }
            });
        }
    }
}
loadEnv();

async function debugSheets() {
    try {
        const sheets = await getSheets();

        // 1. Check Sheet Names
        const meta = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID
        });
        const sheetNames = meta.data.sheets.map(s => s.properties.title);
        console.log('Available Sheets:', sheetNames);

        // 2. Fetch Raw Transactions
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Transaksi!A:E',
        });

        const rows = response.data.values;
        if (!rows) {
            console.log('No data in Transaksi.');
            return;
        }

        console.log('Total Rows:', rows.length);
        console.log('Header:', rows[0]);
        if (rows.length > 1) {
            console.log('First Row:', rows[1]);
            console.log('Last Row:', rows[rows.length - 1]);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

debugSheets();
