import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Eye, Edit2, Trash2, RefreshCw } from 'lucide-react';
import type { ClientDTO } from '../../../services/clientService';
import { ClientStatusBadge } from './ClientStatusBadge';
import { useAppSelector } from '../../../store';

interface ClientsTableProps {
    clients: ClientDTO[];
    isLoading: boolean;
    onEdit: (client: ClientDTO) => void;
    onDeactivate: (client: ClientDTO) => void;
    onReactivate: (client: ClientDTO) => void;
}

export const ClientsTable = ({
    clients,
    isLoading,
    onEdit,
    onDeactivate,
    onReactivate,
}: ClientsTableProps) => {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);
    const isAdmin = user?.role === 'admin';

    if (isLoading) {
        return (
            <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            {['Full Name', 'PAN', 'Entity Type', 'Mobile', 'Status', 'Actions'].map((h) => (
                                <th
                                    key={h}
                                    className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {[...Array(5)].map((_, i) => (
                            <tr key={i} className="animate-pulse">
                                {[...Array(6)].map((_, j) => (
                                    <td key={j} className="px-6 py-4 whitespace-nowrap">
                                        <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (clients.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <p className="text-slate-500 text-sm font-medium">No clients found.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-t-xl border-x border-t border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Full Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            PAN
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Entity Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Mobile
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                    {clients.map((client) => (
                        <tr
                            key={client.id}
                            className="hover:bg-slate-50 transition-colors cursor-pointer group"
                            onClick={() => navigate(`/clients/${client.id}`)}
                        >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                {client.full_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">
                                {client.pan}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 capitalize">
                                {client.entity_type.replace('_', ' ')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                {client.mobile || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <ClientStatusBadge isActive={client.is_active} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/clients/${client.id}`);
                                        }}
                                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        title="View Details"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(client);
                                        }}
                                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        title="Edit Client"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    {isAdmin && (
                                        <>
                                            {client.is_active ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDeactivate(client);
                                                    }}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Deactivate"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onReactivate(client);
                                                    }}
                                                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                    title="Reactivate"
                                                >
                                                    <RefreshCw className="w-4 h-4" />
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="group-hover:hidden">
                                    <MoreHorizontal className="w-4 h-4 text-slate-400 ml-auto" />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
