import { createContext, useContext, useState, useEffect } from 'react';
import Papa from 'papaparse';

const TransactionContext = createContext();
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1yPRCQrY_Va3tbrTZ-HpyfyXRte9aqI7HQQOVDQiZAfg/export?format=csv';

export function useTransactions() {
    return useContext(TransactionContext);
}

export function TransactionProvider({ children }) {
    // Local transactions (from the form)
    const [localTransactions, setLocalTransactions] = useState(() => {
        const saved = localStorage.getItem('billiard_transactions');
        return saved ? JSON.parse(saved) : [];
    });

    // Sheet transactions (from Google Sheets)
    const [sheetTransactions, setSheetTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Persist local transactions
    useEffect(() => {
        localStorage.setItem('billiard_transactions', JSON.stringify(localTransactions));
    }, [localTransactions]);

    // Fetch Sheet Data
    useEffect(() => {
        const fetchSheetData = async () => {
            try {
                // Add a cache buster (timestamp) so we don't see old data for 5 minutes
                const cacheBuster = `&t=${new Date().getTime()}`;
                const response = await fetch(SHEET_CSV_URL + cacheBuster);
                const csvText = await response.text();

                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const parsedData = results.data.map(row => {
                            // Parse Cost: "Rp35,000" -> 35000
                            const costString = row['Biaya'] || '0';
                            const cost = parseFloat(costString.replace(/[^0-9]/g, ''));

                            // Parse Duration
                            const duration = parseFloat(row['Durasi'] || '0');

                            // Parse Date: "9/2/2024, 16:38:27" -> ISO String
                            let timestamp = new Date().toISOString();
                            try {
                                if (row['Timestamp']) {
                                    timestamp = new Date(row['Timestamp']).toISOString();
                                }
                            } catch (e) {
                                console.warn('Invalid date:', row['Timestamp']);
                            }

                            return {
                                id: crypto.randomUUID(), // Temp ID
                                name: row['Nama'],
                                phone: row['No. Telp'],
                                duration: duration,
                                cost: cost,
                                timestamp: timestamp,
                                source: 'sheet'
                            };
                        });
                        setSheetTransactions(parsedData);
                        setIsLoading(false);
                    },
                    error: (err) => {
                        console.error('CSV Parse Error:', err);
                        setIsLoading(false);
                    }
                });
            } catch (error) {
                console.error('Fetch Error:', error);
                setIsLoading(false);
            }
        };

        fetchSheetData();
    }, []);

    // Merge both sources (Local + Sheet)
    const transactions = [...localTransactions, ...sheetTransactions];

    // Google Apps Script Web App URL
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyaaqyVbyuOxBWQtarrjZWx9aHsO4b7GULXwBF4LCO0pPMy_fcyGj3cOX5oQhduERW0/exec';

    const saveToSheet = async (data) => {
        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Important for Google Apps Script "Anyone" access
                headers: {
                    'Content-Type': 'text/plain', // Use text/plain to avoid CORS preflight
                },
                body: JSON.stringify(data)
            });
            // With no-cors, we can't read the response, so we assume success if no network error thrown.
            return true;
        } catch (error) {
            console.error('Error saving to sheet:', error);
            return false;
        }
    };

    const addTransaction = (newTrx) => {
        const trx = {
            ...newTrx,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(), // Use current time
            source: 'local'
        };
        setLocalTransactions([trx, ...localTransactions]);
    };

    const getMonthlySummary = () => {
        const summary = {};

        transactions.forEach(trx => {
            const date = new Date(trx.timestamp);
            // Group by "Month Year" e.g., "January 2024"
            const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });

            if (!summary[monthYear]) {
                summary[monthYear] = {
                    name: monthYear, // formatted name
                    monthIndex: date.getMonth(),
                    year: date.getFullYear(),
                    totalRevenue: 0,
                    count: 0
                };
            }
            summary[monthYear].totalRevenue += Number(trx.cost);
            summary[monthYear].count += 1;
        });

        // Sort by Date (Year -> Month)
        return Object.values(summary).sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            return a.monthIndex - b.monthIndex;
        });
    };

    return (
        <TransactionContext.Provider value={{ transactions, addTransaction, saveToSheet, getMonthlySummary, isLoading }}>
            {children}
        </TransactionContext.Provider>
    );
}
