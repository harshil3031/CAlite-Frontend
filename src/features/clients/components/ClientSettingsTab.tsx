import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldAlert, ShieldCheck, AlertCircle, Save, Trash2 } from 'lucide-react';
import { axiosInstance } from '../../../services/axiosInstance';

interface ClientSettingsTabProps {
    client: any;
    isAdmin: boolean;
}

const ClientSettingsTab: React.FC<ClientSettingsTabProps> = ({ client, isAdmin }) => {
    const queryClient = useQueryClient();
    const [isSaving, setIsSaving] = useState(false);

    // Mutation for toggling active status
    const toggleStatusMutation = useMutation({
        mutationFn: async () => {
            const endpoint = client.is_active
                ? `/api/v1/clients/${client.id}/deactivate`
                : `/api/v1/clients/${client.id}/reactivate`;
            const response = await axiosInstance.post(endpoint);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients', client.id] });
        }
    });

    const handleToggleStatus = () => {
        if (client.is_active) {
            if (window.confirm(`Deactivate ${client.full_name}? This client will no longer appear in active compliance lists.`)) {
                toggleStatusMutation.mutate();
            }
        } else {
            toggleStatusMutation.mutate();
        }
    };

    return (
        <div className="space-y-8 animate-fade-up max-w-4xl">
            {/* Status Management */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-slate-900">Platform Access</h3>
                        <p className="text-sm text-slate-500">Temporarily deactivate client without deleting their data.</p>
                    </div>
                    {isAdmin && (
                        <button
                            onClick={handleToggleStatus}
                            disabled={toggleStatusMutation.isPending}
                            className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all border ${client.is_active
                                ? 'text-red-700 bg-red-50 border-red-100 hover:bg-red-100'
                                : 'text-emerald-700 bg-emerald-50 border-emerald-100 hover:bg-emerald-100'
                                }`}
                        >
                            {toggleStatusMutation.isPending ? 'Processing...' : client.is_active ? 'Deactivate Client' : 'Reactivate Client'}
                        </button>
                    )}
                </div>

                <div className={`p-4 rounded-xl flex items-center gap-3 ${client.is_active ? 'bg-indigo-50/50 text-indigo-700' : 'bg-red-50/50 text-red-700'}`}>
                    {client.is_active ? <ShieldCheck className="w-5 h-5 flex-shrink-0" /> : <ShieldAlert className="w-5 h-5 flex-shrink-0" />}
                    <p className="text-sm font-medium">
                        {client.is_active
                            ? 'Client is currently active and can have compliance records generated.'
                            : 'Client is currently inactive. No new compliance records will be generated.'}
                    </p>
                </div>
            </div>

            {/* Categorization (Placeholder for M03 feature) */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">Categorization & Groups</h3>
                    <p className="text-sm text-slate-500">Assign client to specific groups or categories for easier filtering.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">Client Group</label>
                        <select
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={!isAdmin}
                            defaultValue="individual"
                        >
                            <option value="individual">Individual</option>
                            <option value="retail">Retail Group</option>
                            <option value="manufacturing">Manufacturing</option>
                            <option value="service_sector">Service Sector</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">Risk Profile Override</label>
                        <select
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={!isAdmin}
                            defaultValue="auto"
                        >
                            <option value="auto">Automatic (Dynamic)</option>
                            <option value="always_high">Always High Risk</option>
                            <option value="always_low">Always Low Risk</option>
                        </select>
                    </div>
                </div>

                {isAdmin && (
                    <div className="flex justify-end pt-4">
                        <button
                            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-sm"
                            onClick={() => {
                                setIsSaving(true);
                                setTimeout(() => setIsSaving(false), 800);
                            }}
                        >
                            {isSaving ? (
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Danger Zone */}
            {isAdmin && (
                <div className="bg-red-50/50 p-8 rounded-2xl border border-red-100 space-y-4">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-red-900 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" /> Danger Zone
                        </h3>
                        <p className="text-sm text-red-700/70">Careful! Permanently deleting a client will also delete all their compliance records, documents, and invoices.</p>
                    </div>
                    <button
                        className="flex items-center gap-2 px-6 py-2.5 bg-white text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-100 transition shadow-sm"
                        onClick={() => {
                            if (window.confirm(`PERMANENTLY DELETE ${client.full_name}? This action CANNOT be undone.`)) {
                                alert("Soft delete not yet implemented for Client details. Contact developer.");
                            }
                        }}
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Permanently
                    </button>
                </div>
            )}
        </div>
    );
};

export default ClientSettingsTab;
