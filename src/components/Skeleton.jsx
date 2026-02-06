export default function Skeleton({ className = '', type = 'text' }) {
    const baseClass = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';

    const types = {
        text: 'h-4 w-full',
        title: 'h-8 w-3/4',
        card: 'h-32 w-full rounded-2xl',
        chart: 'h-[300px] w-full rounded-2xl',
        avatar: 'h-12 w-12 rounded-full',
    };

    return (
        <div className={`${baseClass} ${types[type] || types.text} ${className}`} />
    );
}

export function SkeletonCard() {
    return (
        <div className="glass-panel p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
    );
}

export function SkeletonChart() {
    return (
        <div className="glass-panel p-8 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="h-[300px] bg-gray-200 rounded-2xl"></div>
        </div>
    );
}
