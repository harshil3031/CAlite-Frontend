import React, { useState } from 'react';
import { useWaiveRecord } from '../hooks/useCompliance';

interface WaiveRecordModalProps {
    record: any;
    onClose: () => void;
}

const WaiveRecordModal: React.FC<WaiveRecordModalProps> = ({ record, onClose }) => {
    const [reason, setReason] = useState('');
    const [errorText, setErrorText] = useState('');
    const waiveMutation = useWaiveRecord();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (reason.trim().length === 0) {
            setErrorText('Waive reason is required');
            return;
        }

        waiveMutation.mutate(
            { id: record.id, data: { reason } },
            {
                onSuccess: () => {
                    onClose(); // Parent handles success msg via hot-toast in hook
                }
            }
        );
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Waive Record</h3>

                <div className="bg-blue-50 text-blue-800 p-3 rounded text-sm mb-4 border border-blue-200">
                    Waived records are excluded from risk computation and overdue counts. A waived reason is required and will be logged permanently.
                </div>

                {errorText && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                        {errorText}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Waive Reason *</label>
                        <textarea
                            required
                            rows={3}
                            placeholder="e.g. Entity naturally inactive this quarter"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value);
                                setErrorText('');
                            }}
                            disabled={waiveMutation.isPending}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
                            disabled={waiveMutation.isPending}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                            disabled={reason.trim().length === 0 || waiveMutation.isPending}
                        >
                            {waiveMutation.isPending ? 'Processing...' : 'Waive Record'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WaiveRecordModal;
