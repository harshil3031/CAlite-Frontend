import React, { useState, useMemo } from 'react';
import { useComplianceRecords } from '../hooks/useCompliance';
import ComplianceTable from '../components/ComplianceTable';
import { Search, AlertTriangle } from 'lucide-react';
// I'll implement a simple text hook instead of adding dependencies
export const useDebounceValue = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

const CompliancePage: React.FC = () => {
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [riskFilter, setRiskFilter] = useState<string>('all');
    const [overdueOnly, setOverdueOnly] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [clientSearch, setClientSearch] = useState('');
    const [assignedTo, setAssignedTo] = useState('all');
    const [page, setPage] = useState(1);
    const limit = 20;

    const debouncedSearch = useDebounceValue(clientSearch, 300);

    const filters = useMemo(() => {
        const params: any = { page, limit };

        if (statusFilter.length > 0) {
            params.status = statusFilter.join(',');
        }
        if (riskFilter !== 'all') {
            params.risk_level = riskFilter;
        }
        if (overdueOnly) {
            params.overdue = 'true';
        }
        if (fromDate) params.from_date = fromDate;
        if (toDate) params.to_date = toDate;
        if (debouncedSearch) params.client_name = debouncedSearch; // using generic search, backend handles it
        if (assignedTo !== 'all') {
            if (assignedTo === 'unassigned') {
                params.assigned_to = 'null';
            } else {
                params.assigned_to = assignedTo;
            }
        }

        return params;
    }, [statusFilter, riskFilter, overdueOnly, fromDate, toDate, debouncedSearch, assignedTo, page]);

    const { data, isLoading, isError, error, refetch } = useComplianceRecords(filters);

    const handleFilterChange = (setter: any, value: any) => {
        setter(value);
        setPage(1);
    };

    const handleStatusToggle = (status: string) => {
        setStatusFilter(prev => {
            if (prev.includes(status)) {
                return prev.filter(s => s !== status);
            } else {
                return [...prev, status];
            }
        });
        setPage(1);
    };

    const clearFilters = () => {
        setStatusFilter([]);
        setRiskFilter('all');
        setOverdueOnly(false);
        setFromDate('');
        setToDate('');
        setClientSearch('');
        setAssignedTo('all');
        setPage(1);
    };

    const STATUS_OPTIONS = [
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
        { value: 'none', label: '⬜ None (Filed/Waived)' }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Compliance</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {data?.pagination?.totalItems !== undefined
                            ? `${data.pagination.totalItems} records found`
                            : 'Loading records...'}
                    </p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                        <label className="text-xs font-medium text-gray-700 mb-1">Status</label>
                        <div className="relative">
                            <select
                                className="w-full pl-3 pr-8 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onChange={(e) => {
                                    if (e.target.value) handleStatusToggle(e.target.value);
                                    e.target.value = "";
                                }}
                                value=""
                            >
                                <option value="" disabled>Select to add filter</option>
                                {STATUS_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value} disabled={statusFilter.includes(opt.value)}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {statusFilter.map(sf => (
                                    <span key={sf} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                        {STATUS_OPTIONS.find(o => o.value === sf)?.label || sf}
                                        <button onClick={() => handleStatusToggle(sf)} className="ml-1 text-blue-600 hover:text-blue-900">&times;</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs font-medium text-gray-700 mb-1">Risk Level</label>
                        <select
                            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={riskFilter}
                            onChange={(e) => handleFilterChange(setRiskFilter, e.target.value)}
                        >
                            {RISK_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs font-medium text-gray-700 mb-1">Due Date</label>
                        <div className="flex space-x-2">
                            <input
                                type="date"
                                className="w-1/2 px-2 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={fromDate}
                                onChange={(e) => handleFilterChange(setFromDate, e.target.value)}
                                placeholder="From"
                            />
                            <input
                                type="date"
                                className="w-1/2 px-2 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={toDate}
                                onChange={(e) => handleFilterChange(setToDate, e.target.value)}
                                placeholder="To"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs font-medium text-gray-700 mb-1">Client Search</label>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Client name..."
                                className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={clientSearch}
                                onChange={(e) => handleFilterChange(setClientSearch, e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t pt-3">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            className="rounded text-blue-600 focus:ring-blue-500 rounded border-gray-300 h-4 w-4"
                            checked={overdueOnly}
                            onChange={(e) => handleFilterChange(setOverdueOnly, e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-700">Show overdue only</span>
                    </label>

                    <button
                        onClick={clearFilters}
                        className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 border rounded-md hover:bg-gray-50 bg-white"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {isError ? (
                <div className="bg-red-50 p-4 rounded-md border border-red-200">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error loading records</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{(error as any)?.message || 'Something went wrong.'}</p>
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={() => refetch()}
                                    className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <ComplianceTable
                        records={data?.data || []}
                        isLoading={isLoading}
                    />

                    {data?.pagination && data.pagination.totalPages > 1 && (
                        <div className="flex justify-between items-center bg-white px-4 py-3 border-t border-gray-200 sm:px-6 rounded-md shadow-sm">
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing page <span className="font-medium">{page}</span> of <span className="font-medium">{data.pagination.totalPages}</span>
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => setPage(page - 1)}
                                            disabled={page === 1}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-l-md disabled:bg-gray-100 disabled:text-gray-400"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setPage(page + 1)}
                                            disabled={page === data.pagination.totalPages}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-r-md disabled:bg-gray-100 disabled:text-gray-400"
                                        >
                                            Next
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CompliancePage;
