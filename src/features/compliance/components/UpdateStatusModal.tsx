import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useUpdateStatus } from '../hooks/useCompliance';
import StatusBadge from './StatusBadge';
import type { RootState } from '../../../store';

interface UpdateStatusModalProps {
    record: any;
    clientId?: string;
    onClose: () => void;
}

const VALID_TRANSITIONS: Record<string, string[]> = {
    not_started: ['in_progress'],
    in_progress: ['pending_client_data', 'under_review', 'on_hold'],
    pending_client_data: ['in_progress', 'on_hold'],
    under_review: ['in_progress', 'on_hold'],
    on_hold: ['in_progress'],
    filed: [],
    waived: []
};

const STATUS_LABELS: Record<string, string> = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    pending_client_data: 'Pending Data',
    under_review: 'Under Review',
    filed: 'Filed',
    on_hold: 'On Hold',
    waived: 'Waived'
};

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({ record, clientId, onClose }) => {
    const [newStatus, setNewStatus] = useState('');
    const [notes, setNotes] = useState('');
    const [conflictMessage, setConflictMessage] = useState('');
    const user = useSelector((state: RootState) => state.auth.user);
    const updateStatusMutation = useUpdateStatus(clientId);

    if (record.is_locked) {
        // Should not reach here normally, guarded in parent.
        return null;
    }

    const validNextStatuses = VALID_TRANSITIONS[record.status] || [];
    let availableOptions = [...validNextStatuses];

    if (user?.role === 'ADMIN' && record.status !== 'waived' && record.status !== 'filed') {
        if (!availableOptions.includes('waived')) {
            availableOptions.push('waived');
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStatus) return;

        updateStatusMutation.mutate(
            {
                id: record.id,
                data: {
                    status: newStatus,
                    notes,
                    updatedAt: record.updated_at
                }
            },
            {
                onSuccess: () => {
                    onClose();
                },
                onError: (error: any) => {
                    if (error.status === 409 || error?.response?.status === 409) {
                        setConflictMessage('This record was updated by someone else. The page will now refresh.');
                        setTimeout(() => {
                            onClose();
                        }, 1500);
                    }
                }
            }
        );
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Update Status</h3>
                    <div className="mb-4 text-sm text-gray-600">
                        <p><strong>Client:</strong> {record.client?.name}</p>
                        <p><strong>Compliance:</strong> {record.template?.name}</p>
                        <p><strong>Period:</strong> {record.period_label}</p>
                        <div className="mt-2 flex items-center">
                            <strong className="mr-2">Current Status:</strong> <StatusBadge status={record.status} />
                        </div>
                    </div>

                    {conflictMessage ? (
                        <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4">
                            {conflictMessage}
                        </div>
                    ) : updateStatusMutation.isError ? (
                        <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4">
                            {(updateStatusMutation.error as any)?.response?.data?.message || updateStatusMutation.error.message}
                        </div>
                    ) : null}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                            <select
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                required
                                disabled={updateStatusMutation.isPending || !!conflictMessage}
                            >
                                <option value="" disabled>Select new status</option>
                                {availableOptions.map(status => (
                                    <option key={status} value={status}>
                                        {STATUS_LABELS[status]}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                            <textarea
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                maxLength={1000}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                disabled={updateStatusMutation.isPending || !!conflictMessage}
                            ></textarea>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                disabled={updateStatusMutation.isPending || !!conflictMessage}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                disabled={!newStatus || updateStatusMutation.isPending || !!conflictMessage}
                            >
                                {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateStatusModal;
