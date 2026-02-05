'use server';

import { getSheets, SPREADSHEET_ID } from '@/lib/googleSheets';

export async function addTransaction(prevState, formData) {
    try {
        const sheets = await getSheets();

        const name = formData.get('name');
        const phone = formData.get('phone');
        const duration = formData.get('duration');
        const cost = formData.get('cost');

        if (!name || !duration || !cost) {
            return { success: false, message: 'Missing required fields' };
        }

        // Format timestamp for Jakarta (User timezone)
        const timestamp = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        });
        // Format: 9/2/2024 16:38:27 (M/d/yyyy HH:mm:ss) to match sheet loosely

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Transaksi!A:E',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [
                    [timestamp, name, phone || '-', duration, cost]
                ]
            }
        });

        return { success: true, message: 'Transaction saved successfully!' };
    } catch (error) {
        console.error('Error adding transaction:', error);
        return { success: false, message: 'Failed to save transaction: ' + error.message };
    }
}
