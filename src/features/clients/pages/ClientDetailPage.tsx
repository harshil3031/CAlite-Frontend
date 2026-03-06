import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Hash,
    Calendar,
    Edit2,
    ShieldAlert,
    ShieldCheck,
    Info,
    ExternalLink,
    ChevronRight
} from 'lucide-react';
import { useClientById, useDeactivateClient, useReactivateClient } from '../hooks/useClients';
import { ClientStatusBadge } from '../components/ClientStatusBadge';
import { useState } from 'react';
import { EditClientModal } from '../components/EditClientModal';
import { useAppSelector } from '../../../store';

export const ClientDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);
    const isAdmin = user?.role === 'admin';

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { data: client, isLoading, isError, error } = useClientById(id!);
    const deactivateMutation = useDeactivateClient();
    const reactivateMutation = useReactivateClient();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (isError || !client) {
        return (
            <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center">
                <p className="text-red-600 font-bold mb-4">Error loading client details</p>
                <p className="text-red-500 text-sm mb-6">{error?.message || 'Client not found'}</p>
                <button
                    onClick={() => navigate('/clients')}
                    className="px-4 py-2 bg-white border border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors"
                >
                    Back to List
                </button>
            </div>
        );
    }

    const handleToggleStatus = () => {
        if (client.is_active) {
            if (window.confirm(`Deactivate ${client.full_name}?`)) {
                deactivateMutation.mutate(client.id);
            }
        } else {
            reactivateMutation.mutate(client.id);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Back button and breadcrumb */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => navigate('/clients')}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium text-slate-400">Clients</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-sm font-bold text-slate-800">{client.full_name}</span>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="h-24 bg-gradient-to-r from-indigo-600/10 to-blue-600/10 border-b border-slate-100 flex items-end px-8 pb-4">
                            <ClientStatusBadge isActive={client.is_active} />
                        </div>

                        <div className="px-8 py-6 relative">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 leading-tight">{client.full_name}</h1>
                                    <p className="text-slate-500 font-medium capitalize mt-1">{client.entity_type.replace('_', ' ')}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                    {isAdmin && (
                                        <button
                                            onClick={handleToggleStatus}
                                            disabled={deactivateMutation.isPending || reactivateMutation.isPending}
                                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-colors border ${client.is_active
                                                    ? 'text-red-600 bg-red-50/50 border-red-100 hover:bg-red-50'
                                                    : 'text-emerald-700 bg-emerald-50/50 border-emerald-100 hover:bg-emerald-50'
                                                }`}
                                        >
                                            {client.is_active ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                                            {client.is_active ? 'Deactivate' : 'Reactivate'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Info Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-100">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Hash className="w-3 h-3" />
                                        PAN
                                    </p>
                                    <p className="text-sm font-bold text-slate-700 font-mono tracking-tight">{client.pan}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Hash className="w-3 h-3" />
                                        GSTIN
                                    </p>
                                    <p className="text-sm font-bold text-slate-700 font-mono tracking-tight">
                                        {client.gstin || (
                                            <span className="text-slate-300 font-normal italic">Not Registered</span>
                                        )}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" />
                                        Added On
                                    </p>
                                    <p className="text-sm font-bold text-slate-700">
                                        {new Date(client.created_at).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Placeholder Sections (Layer 3 & 5) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60 grayscale pointer-events-none">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200">
                            <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" />
                                Compliance Status
                            </h3>
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-10 bg-slate-50 rounded-lg"></div>
                                ))}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-4 text-center">Coming in Layer 3</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200">
                            <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Recent Activity
                            </h3>
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-10 bg-slate-50 rounded-lg"></div>
                                ))}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-4 text-center">Coming in Layer 5</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Cards */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h3 className="text-base font-bold text-slate-900 mb-5">Contact Details</h3>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Mobile Number</p>
                                    <p className="text-sm font-bold text-slate-800">{client.mobile || '-'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email Address</p>
                                    <p className="text-sm font-bold text-slate-800 truncate">{client.email || '-'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Office Address</p>
                                    <p className="text-sm font-bold text-slate-800 leading-relaxed">
                                        {client.address || 'Address not provided'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button className="w-full mt-8 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                            Show on Map
                            <ExternalLink className="w-3 h-3" />
                        </button>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-6 shadow-xl shadow-slate-200/50">
                        <div className="flex items-center gap-2 text-indigo-400 mb-4">
                            <Info className="w-4 h-4" />
                            <h4 className="text-xs font-bold uppercase tracking-widest">Client Insights</h4>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed italic">
                            "No notes yet. Start by generating a compliance review or uploading documents in the next phase."
                        </p>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <EditClientModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                client={client}
            />
        </div>
    );
};
