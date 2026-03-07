import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useClientCompliance } from '../hooks/useCompliance';
import ComplianceTable from './ComplianceTable';
import ManualRecordModal from './ManualRecordModal';
import { AlertTriangle, Plus } from 'lucide-react';
import type { RootState } from '../../../store';

interface ComplianceTabProps {
    clientId: string;
    entityType?: string;
    isActive: boolean;
}

const ComplianceTab: React.FC<ComplianceTabProps> = ({ clientId, isActive }) => {
    const [statusFilter, setStatusFilter] = useState('');
    const [riskFilter, setRiskFilter] = useState('all');
    const [overdueOnly, setOverdueOnly] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 20;

    const user = useSelector((state: RootState) => state.auth.user);
    const isAdmin = user?.role === 'ADMIN';

    const [isManualModalOpen, setIsManualModalOpen] = useState(false);

    const filters = useMemo(() => {
        const params: any = { page, limit };
        if (statusFilter) params.status = statusFilter;
        if (riskFilter !== 'all') params.risk_level = riskFilter;
        if (overdueOnly) params.overdue = 'true';
        return params;
    }, [statusFilter, riskFilter, overdueOnly, page]);

    const { data, isLoading, isError, error, refetch } = useClientCompliance(clientId, filters);

    const STATUS_OPTIONS = [
        { value: '', label: 'All Statuses' },
        { value: 'not_started', label: 'Not Started' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'pending_client_data', label: 'Pending Data' },
        { value: 'under_review', label: 'Under Review' },
        { value: 'filed', label: 'Filed' },
        { value: 'on_hold', label: 'On Hold' },
        { value: 'waived', label: 'Waived' }
    ];

    const RISK_OPTIONS = [
        { value: 'all', label: 'All Risks' },
        { value: 'critical', label: '⚫ CRITICAL' },
        { value: 'red', label: '🔴 Urgent' },
        { value: 'yellow', label: '🟡 Attention' },
        { value: 'green', label: '🟢 Safe' },
        { value: 'none', label: '⬜ None' }
    ];

    const handleFilterChange = (setter: any, value: any) => {
        setter(value);
        setPage(1);
    };

    const clearFilters = () => {
        setStatusFilter('');
        setRiskFilter('all');
        setOverdueOnly(false);
        setPage(1);
    };

    return (
        <div className="space-y-4">
            {!isActive && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700 font-medium">
                                This client is deactivated. Records are read-only.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <select
                        className="px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={statusFilter}
                        onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}
                    >
                        {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    <select
                        className="px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={riskFilter}
                        onChange={(e) => handleFilterChange(setRiskFilter, e.target.value)}
                    >
                        {RISK_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    <label className="flex items-center space-x-2 cursor-pointer bg-white px-3 py-1.5 border rounded-md h-full">
                        <input
                            type="checkbox"
                            className="rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                            checked={overdueOnly}
                            onChange={(e) => handleFilterChange(setOverdueOnly, e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-700">Overdue</span>
                    </label>

                    {(statusFilter || riskFilter !== 'all' || overdueOnly) && (
                        <button
                            onClick={clearFilters}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {isAdmin && isActive && (
                    <button
                        onClick={() => setIsManualModalOpen(true)}
                        className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium shadow-sm transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Manual Record
                    </button>
                )}
            </div>

            {isError ? (
                <div className="bg-red-50 p-4 rounded-md border border-red-200">
                    <p className="text-sm text-red-700">Error loading records: {(error as any)?.message}</p>
                    <button onClick={() => refetch()} className="mt-2 text-sm text-red-600 underline">Retry</button>
                </div>
            ) : (
                <>
                    <div className={`${!isActive ? 'pointer-events-none opacity-80' : ''}`}>
                        <ComplianceTable
                            records={data?.data || []}
                            isLoading={isLoading}
                            clientScoped={true}
                        />
                    </div>

                    {data?.pagination && data.pagination.totalPages > 1 && (
                        <div className="flex justify-between items-center bg-white px-4 py-3 border-t border-gray-200 rounded-md mt-4">
                            <span className="text-sm text-gray-700">
                                Page {page} of {data.pagination.totalPages}
                            </span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                    className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                                >
                                    Prev
                                </button>
                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === data.pagination.totalPages}
                                    className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {isManualModalOpen && (
                <ManualRecordModal
                    clientId={clientId}
                    onClose={() => setIsManualModalOpen(false)}
                />
            )}
        </div>
    );
};

export default ComplianceTab;
