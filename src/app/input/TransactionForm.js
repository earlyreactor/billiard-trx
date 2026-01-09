'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { addTransaction } from '@/actions/transactionActions';
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react'; // Using lucide-react as requested

const RATE_PER_HOUR = 35000;

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
        >
            {pending ? <Loader2 className="animate-spin" /> : 'Save Transaction'}
        </button>
    );
}

export default function TransactionForm() {
    const [state, formAction] = useFormState(addTransaction, { success: false, message: '' });
    const formRef = useRef(null);
    const [duration, setDuration] = useState('');
    const [cost, setCost] = useState('');

    useEffect(() => {
        if (state.success) {
            formRef.current?.reset();
            setDuration('');
            setCost('');
            // Could show toast here
            alert(state.message); // Simple feedback for now
        } else if (state.message) {
            alert(state.message);
        }
    }, [state]);

    const handleDurationChange = (e) => {
        const d = e.target.value;
        setDuration(d);
        if (d && !isNaN(d)) {
            setCost(parseFloat(d) * RATE_PER_HOUR);
        } else {
            setCost('');
        }
    };

    return (
        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
            <div className="form-group">
                <label>Name</label>
                <input name="name" type="text" required placeholder="Customer Name" />
            </div>

            <div className="form-group">
                <label>Phone (Optional)</label>
                <input name="phone" type="tel" placeholder="0812..." />
            </div>

            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                    <label>Duration (Hours)</label>
                    <input
                        name="duration"
                        type="number"
                        step="0.5"
                        required
                        placeholder="1.0"
                        value={duration}
                        onChange={handleDurationChange}
                    />
                </div>

                <div className="form-group">
                    <label>Cost (Rp)</label>
                    <input
                        name="cost"
                        type="number"
                        required
                        placeholder="35000"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                    />
                </div>
            </div>

            <div className="mt-4">
                <SubmitButton />
            </div>

            {/* Helper text */}
            <p style={{ textAlign: 'center', marginTop: '1rem', opacity: 0.7, fontSize: '0.9rem' }}>
                Rate: Rp {RATE_PER_HOUR.toLocaleString()} / hour
            </p>
        </form>
    );
}
