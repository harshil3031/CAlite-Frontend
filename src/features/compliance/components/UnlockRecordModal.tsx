import React, { useState } from 'react';
import { useUnlockRecord } from '../hooks/useCompliance';

interface UnlockRecordModalProps {
    record: any;
    onClose: () => void;
}

const UnlockRecordModal: React.FC<UnlockRecordModalProps> = ({ record, onClose }) => {
    const [reason, setReason] = useState('');
    const [errorText, setErrorText] = useState('');
    const unlockMutation = useUnlockRecord();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (reason.length < 10) {
            setErrorText('Reason must be at least 10 characters');
            return;
        }

        if (!window.confirm("Are you sure? This cannot be undone.")) return;

        unlockMutation.mutate(
            { id: record.id, data: { reason } },
            {
                onSuccess: () => {
                    onClose(); // Parent toast handles success msg
                }
            }
        );
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Unlock Record</h3>

                <div className="bg-yellow-50 text-yellow-800 p-3 rounded text-sm mb-4 border border-yellow-200">
                    ⚠️ Unlocking this record will clear all filing evidence including the acknowledgement number and proof PDF. This action is permanent and will be logged to the Activity Timeline.
                </div>

                <div className="mb-4 text-xs text-gray-600 bg-gray-50 p-3 rounded space-y-1">
                    <p><strong>Filed On:</strong> {record.filed_on_date || '—'}</p>
                    <p><strong>Filed By:</strong> {record.filed_by_user?.name || '—'}</p>
                    <p><strong>Ack Number:</strong> {record.ack_number || '—'}</p>
                    <p><strong>Portal Ref:</strong> {record.portal_reference || '—'}</p>
                </div>

                {errorText && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                        {errorText}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unlock Reason *</label>
                        <textarea
                            required
                            minLength={10}
                            rows={3}
                            placeholder="Reason for unlocking (e.g., Incorrect ack number submitted)"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value);
                                setErrorText('');
                            }}
                            disabled={unlockMutation.isPending}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
                            disabled={unlockMutation.isPending}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 text-sm"
                            disabled={reason.length < 10 || unlockMutation.isPending}
                        >
                            {unlockMutation.isPending ? 'Unlocking...' : 'Unlock Record'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UnlockRecordModal;
