import { getAnalyticsData } from '@/lib/dataFetcher';
import AnalyticsCharts from './Charts';

export const dynamic = 'force-dynamic'; // Always fetch fresh data

export default async function AnalyticsPage() {
    let data = [];
    let error = null;

    try {
        data = await getAnalyticsData();
    } catch (e) {
        console.error(e);
        error = "Failed to load analytics. Please check Google Sheets configuration.";
    }

    return (
        <div>
            <h1>Analytics</h1>
            {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded mb-6">
                    {error}
                </div>
            )}
            <AnalyticsCharts data={data} />
        </div>
    );
}
