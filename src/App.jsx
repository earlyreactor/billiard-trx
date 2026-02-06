import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dividends from './pages/Dividends';
import Analytics from './components/Analytics';
import TransactionForm from './components/TransactionForm';
import SplashScreen from './components/SplashScreen';
import { TransactionProvider, useTransactions } from './context/TransactionContext';
import { ThemeProvider } from './context/ThemeContext';
import { SkeletonChart, SkeletonCard } from './components/Skeleton';

function Home() {
    return (
        <div className="flex flex-col gap-6 py-20 min-h-screen items-center justify-center animate-fadeIn">
            <div className="w-full max-w-4xl mx-auto px-4 text-center mb-10">
                <h1 className="text-4xl font-extrabold mb-6 tracking-tight" style={{ color: 'var(--foreground)' }}>
                    Billiard TRX Management
                </h1>
                <p className="text-lg" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
                    Record inputs, track analytics, and distribute dividends.
                </p>
            </div>

            {/* Active Padding / Input Section */}
            <div className="w-full px-4">
                <TransactionForm />
            </div>
        </div>
    );
}

function AppContent() {
    const { isLoading } = useTransactions();

    return (
        <Router>
            <div className="container pb-24">
                <Navbar />

                {/* Sections */}
                <section id="home">
                    <Home />
                </section>

                <section id="analytics" className="min-h-screen py-20 flex flex-col justify-center animate-slideUp" style={{ animationDelay: '0.1s' }}>
                    {isLoading ? <SkeletonChart /> : <Analytics />}
                </section>

                <section id="dividends" className="min-h-screen py-20 flex flex-col justify-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </div>
                    ) : (
                        <Dividends />
                    )}
                </section>
            </div>
        </Router>
    );
}

function App() {
    const [showSplash, setShowSplash] = useState(true);

    return (
        <ThemeProvider>
            <TransactionProvider>
                {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
                <AppContent />
            </TransactionProvider>
        </ThemeProvider>
    );
}

export default App;


