import TransactionForm from './TransactionForm';

export default function InputPage() {
    return (
        <div className="max-w-lg mx-auto">
            <div className="glass-panel">
                <h1 className="text-2xl font-bold mb-6 text-center text-primary" style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem', color: 'var(--primary)' }}>New Transaction</h1>
                <TransactionForm />
            </div>
        </div>
    );
}
