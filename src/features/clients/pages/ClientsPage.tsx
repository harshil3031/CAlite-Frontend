import { useState, useMemo } from 'react';
import { Upload, Filter, UserPlus } from 'lucide-react';
import { useClients, useDeactivateClient, useReactivateClient } from '../hooks/useClients';
import { SearchBar } from '../components/SearchBar';
import { ClientsTable } from '../components/ClientsTable';
import { Pagination } from '../components/Pagination';
import { AddClientModal } from '../components/AddClientModal';
import { EditClientModal } from '../components/EditClientModal';
import { ImportModal } from '../components/ImportModal';
import type { ClientDTO } from '../../../services/clientService';

const ENTITY_TYPE_OPTIONS = [
    { value: '', label: 'All Entities' },
    { value: 'individual', label: 'Individual' },
    { value: 'proprietorship', label: 'Proprietorship' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'llp', label: 'LLP' },
    { value: 'pvt_ltd', label: 'Pvt Ltd' },
    { value: 'public_ltd', label: 'Public Ltd' },
    { value: 'trust', label: 'Trust' },
    { value: 'huf', label: 'HUF' },
];

export const ClientsPage = () => {
    // Local UI State
    const [search, setSearch] = useState('');
    const [entityType, setEntityType] = useState('');
    const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(20);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<ClientDTO | null>(null);

    // Memoized query params to avoid unnecessary refetches
    const queryParams = useMemo(() => ({
        search: search || undefined,
        entity_type: entityType || undefined,
        is_active: isActive,
        page,
        limit: pageSize,
    }), [search, entityType, isActive, page, pageSize]);

    // Server state
    const { data, isLoading, isError, error } = useClients(queryParams);
    const deactivateMutation = useDeactivateClient();
    const reactivateMutation = useReactivateClient();

    const clients = data?.clients ?? [];
    const totalItems = data?.total ?? 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    const handleDeactivate = (client: ClientDTO) => {
        if (window.confirm(`Are you sure you want to deactivate ${client.full_name}?`)) {
            deactivateMutation.mutate(client.id);
        }
    };

    const handleReactivate = (client: ClientDTO) => {
        reactivateMutation.mutate(client.id);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage and organize your firm's clients</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <Upload className="w-4 h-4" />
                        Import CSV
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add Client
                    </button>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200">
                <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} />

                <div className="flex flex-1 gap-2 overflow-x-auto pb-1 md:pb-0">
                    <div className="relative min-w-[140px]">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <select
                            value={entityType}
                            onChange={(e) => { setEntityType(e.target.value); setPage(1); }}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium"
                        >
                            {ENTITY_TYPE_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                        <button
                            onClick={() => { setIsActive(undefined); setPage(1); }}
                            className={`px-3 py-1.5 text-xs font-bold transition-colors ${isActive === undefined ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => { setIsActive(true); setPage(1); }}
                            className={`px-3 py-1.5 text-xs font-bold border-x border-slate-200 transition-colors ${isActive === true ? 'bg-emerald-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => { setIsActive(false); setPage(1); }}
                            className={`px-3 py-1.5 text-xs font-bold transition-colors ${isActive === false ? 'bg-red-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                        >
                            Inactive
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content (Table) */}
            <div className="space-y-0">
                {isError && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm mb-4">
                        Failed to load clients: {error.message}
                    </div>
                )}

                <ClientsTable
                    clients={clients}
                    isLoading={isLoading}
                    onEdit={(c) => setEditingClient(c)}
                    onDeactivate={handleDeactivate}
                    onReactivate={handleReactivate}
                />

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    pageSize={pageSize}
                    onPageChange={(p) => setPage(p)}
                />
            </div>

            {/* Modals */}
            <AddClientModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            <EditClientModal
                isOpen={!!editingClient}
                onClose={() => setEditingClient(null)}
                client={editingClient}
            />

            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
            />
        </div>
    );
};
