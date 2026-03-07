import React, { useState } from 'react';
import { useComplianceTemplates } from '../hooks/useCompliance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createManual } from '../../../services/complianceService';
import toast from 'react-hot-toast';

interface ManualRecordModalProps {
    clientId: string;
    onClose: () => void;
}

const ManualRecordModal: React.FC<ManualRecordModalProps> = ({ clientId, onClose }) => {
    const [templateId, setTemplateId] = useState('');
    const [periodLabel, setPeriodLabel] = useState('');
    const [periodStart, setPeriodStart] = useState('');
    const [periodEnd, setPeriodEnd] = useState('');

    const templatesQuery = useComplianceTemplates();
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: any) => createManual(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['compliance', 'client', clientId] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success('Manual record created.');
            onClose();
        },
        onError: (error: any) => {
            if (error.status === 409 || error?.response?.status === 409) {
                toast.error('A record already exists for this client, template, and period.');
            } else {
                toast.error(error?.response?.data?.message || error.message);
            }
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!templateId || !periodLabel || !periodStart || !periodEnd) return;

        if (periodEnd <= periodStart) {
            toast.error('Period end date must be after period start date.');
            return;
        }

        createMutation.mutate({
            client_id: clientId,
            template_id: templateId,
            period_label: periodLabel,
            period_start: new Date(periodStart).toISOString(),
            period_end: new Date(periodEnd).toISOString(),
        });
    };

    const templates = templatesQuery.data?.data || [];
    const activeTemplates = templates.filter((t: any) => t.is_active);

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Add Manual Record</h3>

                <div className="bg-blue-50 text-blue-800 p-3 rounded text-[11px] mb-4 border border-blue-200">
                    Creates a one-off compliance record for this client outside of the auto-generation cycle.
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Template *</label>
                        <select
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            value={templateId}
                            onChange={(e) => setTemplateId(e.target.value)}
                            disabled={createMutation.isPending || templatesQuery.isLoading}
                        >
                            <option value="" disabled>Select template</option>
                            {activeTemplates.map((t: any) => (
                                <option key={t.id} value={t.id}>
                                    {t.name} ({t.short_code} - {t.authority})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Period Label *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Mar 2026"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            value={periodLabel}
                            onChange={(e) => setPeriodLabel(e.target.value)}
                            disabled={createMutation.isPending}
                        />
                    </div>

                    <div className="flex space-x-4 mb-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Period Start *</label>
                            <input
                                type="date"
                                required
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                value={periodStart}
                                onChange={(e) => setPeriodStart(e.target.value)}
                                disabled={createMutation.isPending}
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Period End *</label>
                            <input
                                type="date"
                                required
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                value={periodEnd}
                                onChange={(e) => setPeriodEnd(e.target.value)}
                                disabled={createMutation.isPending}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
                            disabled={createMutation.isPending}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                            disabled={!templateId || !periodLabel || !periodStart || !periodEnd || createMutation.isPending}
                        >
                            {createMutation.isPending ? 'Creating...' : 'Create Record'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManualRecordModal;
