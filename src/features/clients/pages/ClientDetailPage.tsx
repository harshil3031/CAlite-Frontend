import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Mail, Phone, Hash, Calendar, Edit2, ShieldAlert,
    ShieldCheck, CloudUpload, Clock, ChevronRight
} from 'lucide-react';
import { useClientById, useDeactivateClient, useReactivateClient } from '../hooks/useClients';
import { ClientStatusBadge } from '../components/ClientStatusBadge';
import { EditClientModal } from '../components/EditClientModal';
import { useAppSelector } from '../../../store';
import ComplianceTab from '../../compliance/components/ComplianceTab';
import RiskBadge from '../../compliance/components/RiskBadge';
import ClientOverviewTab from '../components/ClientOverviewTab';
import ClientSettingsTab from '../components/ClientSettingsTab';

export const ClientDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);
    const isAdmin = user?.role === 'admin' || user?.role === 'ADMIN';

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

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

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'compliance', label: 'Compliance' },
        { id: 'worklogs', label: 'Worklogs' },
        { id: 'documents', label: 'Documents' },
        { id: 'settings', label: 'Settings' }
    ];

    return (
        <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-10">
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

            {/* Client Overview Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="h-16 bg-gradient-to-r from-indigo-600/10 to-blue-600/10 border-b border-slate-100 flex items-center px-8 justify-between">
                    <ClientStatusBadge isActive={client.is_active} />
                    {client.risk_level && (
                        <RiskBadge riskLevel={client.risk_level} />
                    )}
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
                                Edit Form
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

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6 pt-6 border-t border-slate-100">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 text-xs flex items-center gap-1.5">
                                <Hash className="w-3.5 h-3.5" /> PAN
                            </p>
                            <p className="text-sm font-medium text-slate-700">{client.pan}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 text-xs flex items-center gap-1.5">
                                <Hash className="w-3.5 h-3.5" /> GSTIN
                            </p>
                            <p className="text-sm font-medium text-slate-700">
                                {client.gstin || <span className="text-slate-400 italic">Not Registered</span>}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 text-xs flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5" /> Mobile
                            </p>
                            <p className="text-sm font-medium text-slate-700">{client.mobile || '-'}</p>
                        </div>
                        <div className="space-y-1 truncate">
                            <p className="text-[10px] font-bold text-slate-400 text-xs flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5" /> Email
                            </p>
                            <p className="text-sm font-medium text-slate-700 truncate" title={client.email || ''}>{client.email || '-'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 text-xs flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" /> Added On
                            </p>
                            <p className="text-sm font-medium text-slate-700">
                                {new Date(client.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5 Tabs Section */}
            <div className="mt-8">
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                                    ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }
                                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-4">
                    {activeTab === 'overview' && (
                        <ClientOverviewTab client={client} />
                    )}
                    {activeTab === 'compliance' && (
                        <ComplianceTab
                            clientId={client.id}
                            entityType={client.entity_type}
                            isActive={client.is_active}
                        />
                    )}
                    {activeTab === 'worklogs' && (
                        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center animate-fade-up">
                            <Clock className="mx-auto h-12 w-12 text-blue-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Worklogs coming in next layer update.</h3>
                            <p className="mt-1 text-sm text-gray-500">Track billable hours per client. Module implementation in progress.</p>
                        </div>
                    )}
                    {activeTab === 'documents' && (
                        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center animate-fade-up">
                            <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Document management coming soon.</h3>
                            <p className="mt-1 text-sm text-gray-500">Upload, organize, and manage client documents in Layer 5.</p>
                        </div>
                    )}
                    {activeTab === 'settings' && (
                        <ClientSettingsTab client={client} isAdmin={isAdmin} />
                    )}
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

export default ClientDetailPage;
