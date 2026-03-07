import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Database as LibraryIcon, ShieldCheck, Info } from 'lucide-react';
import * as complianceService from '../../../services/complianceService';

const ComplianceLibraryPage: React.FC = () => {
    const queryClient = useQueryClient();

    const { data: globalTemplates, isLoading, isError } = useQuery({
        queryKey: ['compliance', 'library'],
        queryFn: complianceService.getLibrary,
    });

    const subscribeMutation = useMutation({
        mutationFn: complianceService.subscribe,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['compliance', 'library'] });
            queryClient.invalidateQueries({ queryKey: ['compliance', 'templates'] });
        },
    });

    const unsubscribeMutation = useMutation({
        mutationFn: complianceService.unsubscribe,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['compliance', 'library'] });
            queryClient.invalidateQueries({ queryKey: ['compliance', 'templates'] });
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-8 text-center text-red-600 bg-red-50 rounded-2xl border border-red-100">
                Failed to load global compliance library.
            </div>
        );
    }

    const templates = globalTemplates?.data || [];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center sm:flex-row flex-col gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                        <LibraryIcon className="w-6 h-6 text-indigo-600" />
                        Compliance Library
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Global library of statutory laws. Subscribe to templates to track compliance for your clients.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template: any) => (
                    <div key={template.id} className="bg-white border text-sm border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                        <div className="p-5 flex-1 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-slate-900 text-lg">{template.name}</h3>
                                    <p className="text-xs font-mono text-indigo-600 font-bold uppercase tracking-wider">{template.shortCode || template.short_code}</p>
                                </div>
                                {template.isSubscribed ? (
                                    <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-emerald-600/20">
                                        <ShieldCheck className="w-3.5 h-3.5" /> Subscribed
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-slate-200">
                                        Available
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="space-y-1">
                                    <p className="text-slate-400 uppercase tracking-tighter">Authority</p>
                                    <p className="text-slate-700">{template.authority}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-400 uppercase tracking-tighter">Frequency</p>
                                    <p className="text-slate-700 capitalize">{template.frequency}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-400 uppercase tracking-tighter">Due On</p>
                                    <p className="text-slate-700">Day {template.dueDay || template.due_day}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-400 uppercase tracking-tighter">Country</p>
                                    <p className="text-slate-700">{template.countryCode || template.country_code || 'IN'}</p>
                                </div>
                            </div>

                            {template.notes && (
                                <div className="flex gap-2 text-[11px] text-slate-500 bg-blue-50/50 p-2 rounded-lg border border-blue-100/50">
                                    <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                                    <p className="italic">{template.notes}</p>
                                </div>
                            )}
                        </div>

                        <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50">
                            {template.isSubscribed ? (
                                <button
                                    onClick={() => {
                                        if (window.confirm(`Unsubscribe from ${template.name}? Future automated records for this template will NOT be generated.`)) {
                                            unsubscribeMutation.mutate(template.id);
                                        }
                                    }}
                                    className="w-full py-2 text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 border border-slate-200 rounded-lg transition"
                                    disabled={unsubscribeMutation.isPending}
                                >
                                    {unsubscribeMutation.isPending ? 'Processing...' : 'Unsubscribe'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => subscribeMutation.mutate(template.id)}
                                    className="w-full py-2 text-sm font-bold text-white bg-indigo-600 shadow-sm shadow-indigo-200 hover:bg-indigo-700 rounded-lg transition"
                                    disabled={subscribeMutation.isPending}
                                >
                                    {subscribeMutation.isPending ? 'Processing...' : 'Subscribe Firm'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {templates.length === 0 && (
                <div className="py-20 text-center bg-white border border-dashed border-slate-200 rounded-2xl">
                    <LibraryIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No master templates available in the library yet.</p>
                </div>
            )}
        </div>
    );
};

export default ComplianceLibraryPage;
