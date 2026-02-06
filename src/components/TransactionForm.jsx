import { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import Swal from 'sweetalert2';
import transactionIcon from '../assets/transaction.png';

const RATE_PER_HOUR = 35000;

export default function TransactionForm() {
    const { addTransaction, saveToSheet } = useTransactions();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        duration: '',
        cost: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newFormData = { ...formData, [name]: value };

        // Auto-calculate cost when duration changes
        if (name === 'duration') {
            const duration = parseFloat(value);
            if (!isNaN(duration)) {
                newFormData.cost = duration * RATE_PER_HOUR;
            } else {
                newFormData.cost = '';
            }
        }

        setFormData(newFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newTrx = {
            name: formData.name,
            phone: formData.phone || '-',
            duration: parseFloat(formData.duration),
            cost: parseFloat(formData.cost),
        };

        // 1. Save Locally (Instant Update UI)
        addTransaction(newTrx);

        // 2. Save to Google Sheet (Background)
        await saveToSheet(newTrx);

        setIsSubmitting(false);

        // Reset form
        setFormData({ name: '', phone: '', duration: '', cost: '' });

        // 3. Show Success Popup
        Swal.fire({
            title: 'Success!',
            text: 'Transaction saved to Sheet & Local Storage.',
            icon: 'success',
            confirmButtonColor: '#FACC15',
            background: '#fff',
            color: '#1F2937'
        });
    };

    return (
        <div className="glass-panel p-8 w-full max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
                <img
                    src={transactionIcon}
                    alt="icon"
                    className="w-8 h-8 object-contain"
                />
                <h2 className="text-2xl font-bold text-center" style={{ color: 'var(--foreground)' }}>New Transaction</h2>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                <div className="form-group">
                    <label>Customer Name</label>
                    <input
                        name="name"
                        type="text"
                        required
                        placeholder="Enter customer name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Phone (Optional)</label>
                    <input
                        name="phone"
                        type="tel"
                        placeholder="0812..."
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                        <label>Duration (Hours)</label>
                        <input
                            name="duration"
                            type="number"
                            step="0.5"
                            required
                            placeholder="e.g. 2.0"
                            value={formData.duration}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Cost (Rp)</label>
                        <input
                            name="cost"
                            type="number"
                            required
                            placeholder="Auto-calculated"
                            value={formData.cost}
                            readOnly
                            className="opacity-80 cursor-not-allowed"
                        />
                    </div>
                </div>

                <button type="submit" className="mt-4" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Transaction'}
                </button>

                <p className="text-center text-xs mt-2" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                    Rate: Rp {RATE_PER_HOUR.toLocaleString()} / hour
                </p>
            </form>
        </div>
    );
}
