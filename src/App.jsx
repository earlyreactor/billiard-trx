import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dividends from './pages/Dividends';
import Analytics from './components/Analytics';
import TransactionForm from './components/TransactionForm';
import { TransactionProvider } from './context/TransactionContext';

function Home() {
    return (
        <div className="flex flex-col gap-6 py-20 min-h-screen items-center justify-center">
            <div className="w-full max-w-4xl mx-auto px-4 text-center mb-10">
                <h1 className="text-4xl font-extrabold mb-6 text-gray-900 tracking-tight">
                    Billiard TRX Management
                </h1>
                <p className="text-gray-600 text-lg">
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

function App() {
    return (
        <TransactionProvider>
            <Router>
                <div className="container pb-24">
                    <Navbar />

                    {/* Sections */}
                    <section id="home">
                        <Home />
                    </section>

                    <section id="analytics" className="min-h-screen py-20 flex flex-col justify-center">
                        <Analytics />
                    </section>

                    <section id="dividends" className="min-h-screen py-20 flex flex-col justify-center">
                        <Dividends />
                    </section>
                </div>
            </Router>
        </TransactionProvider>
    );
}

export default App;
