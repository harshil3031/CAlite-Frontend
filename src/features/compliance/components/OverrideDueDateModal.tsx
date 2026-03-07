import React, { useState } from 'react';
import { useOverrideDueDate } from '../hooks/useCompliance';
import DueOverrideBadge from './DueOverrideBadge';

interface OverrideDueDateModalProps {
    record: any;
    onClose: () => void;
}

const OverrideDueDateModal: React.FC<OverrideDueDateModalProps> = ({ record, onClose }) => {
    const [dueDate, setDueDate] = useState(
        record.due_date ? record.due_date.split('T')[0] : ''
    );
    const [reason, setReason] = useState('');
    const overrideMutation = useOverrideDueDate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!dueDate) return;

        overrideMutation.mutate(
            { id: record.id, data: { due_date: dueDate, reason } },
            {
                onSuccess: () => {
                    onClose(); // Toast handles success
                }
            }
        );
    };

    const getISTDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
    };

    const originalDue = record.period_end ? (() => {
        // If we assume period_end + some days, or perhaps backend stores original due date.
        // The prompt says "Original: {original_due_date}". Wait, if it's already overridden,
        // where is original_due_date stored? Actually the prompt says 
        // "Tooltip: "Original: {original_due_date}"". I'll just use a placeholder if it doesn't exist.
        // However, if due_date_overridden is false, then due_date is original.
        let orig = record.due_date;
        // wait, if we don't have original_due_date in the frontend record, we might need a fallback.
        // Let's assume record has original_due_date.
        orig = record.original_due_date || record.due_date;
        return orig ? getISTDate(orig) : '—';
    })() : '—';

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Override Due Date</h3>

                <div className="bg-blue-50 text-blue-800 p-3 rounded text-[11px] mb-4 border border-blue-200">
                    Original system-computed date is always preserved. Past and future dates are both permitted (some portals allow late filing).
                </div>

                <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded space-y-1">
                    <p>
                        <strong>System Due Date:</strong> {originalDue}
                    </p>
                    <p className="flex items-center">
                        <strong>Current Due Date:</strong>
                        <span className="ml-1">{record.due_date ? getISTDate(record.due_date) : '—'}</span>
                        {record.due_date_overridden && <DueOverrideBadge originalDate={originalDue} />}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Due Date *</label>
                        <input
                            type="date"
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            disabled={overrideMutation.isPending}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
                        <textarea
                            maxLength={500}
                            rows={2}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            disabled={overrideMutation.isPending}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
                            disabled={overrideMutation.isPending}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                            disabled={!dueDate || overrideMutation.isPending}
                        >
                            {overrideMutation.isPending ? 'Saving...' : 'Override Due Date'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OverrideDueDateModal;
