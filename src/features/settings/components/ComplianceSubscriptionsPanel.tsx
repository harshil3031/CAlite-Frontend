import React from 'react';
import { useSelector } from 'react-redux';
import { useComplianceTemplates, useComplianceSubscriptions, useSubscribe, useUnsubscribe } from '../../compliance/hooks/useCompliance';
import type { RootState } from '../../../store';

const ComplianceSubscriptionsPanel: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const isAdmin = user?.role === 'admin' || user?.role === 'ADMIN';

    const templatesQuery = useComplianceTemplates();
    const subscriptionsQuery = useComplianceSubscriptions();
    const subscribeMutation = useSubscribe();
    const unsubscribeMutation = useUnsubscribe();

    const isLoading = templatesQuery.isLoading || subscriptionsQuery.isLoading;

    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse p-6">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-40 bg-gray-100 rounded mt-4"></div>
            </div>
        );
    }

    const templates = templatesQuery.data?.data || [];
    const subscriptions = subscriptionsQuery.data?.data || [];

    // Actually, back-end returns current firm subscriptions. 
    // Let's match by template_id. Let's look at getSubscriptions: it returns subscriptions for the firm.
    // Each subscription usually has `template_id`.
    const subscribedTemplateIds = new Set(subscriptions.map((s: any) => s.template_id || (s.template && s.template.id)));

    const handleToggle = (template: any, isSubscribed: boolean) => {
        if (!isAdmin) return;

        if (isSubscribed) {
            if (window.confirm('Unsubscribing stops future record generation. Existing records are not affected. Continue?')) {
                unsubscribeMutation.mutate(template.id);
            }
        } else {
            subscribeMutation.mutate(template.id);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">Compliance Template Subscriptions</h3>
                <p className="text-sm text-slate-500 mt-1">
                    Only subscribed templates generate compliance records for your clients. Changes take effect from the next monthly generation cycle.
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider text-xs">Template Name</th>
                            <th className="px-6 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider text-xs">Short Code</th>
                            <th className="px-6 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider text-xs">Authority</th>
                            <th className="px-6 py-3 text-left font-semibold text-slate-500 uppercase tracking-wider text-xs">Frequency</th>
                            <th className="px-6 py-3 text-right font-semibold text-slate-500 uppercase tracking-wider text-xs">Subscribed</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {templates.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No templates available.</td></tr>
                        ) : (
                            templates.map((t: any) => {
                                const isSubscribed = subscribedTemplateIds.has(t.id);

                                return (
                                    <tr key={t.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{t.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-mono">{t.short_code}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-600">{t.authority}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-600 capitalize">{t.frequency?.replace('_', ' ')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {isAdmin ? (
                                                <button
                                                    onClick={() => handleToggle(t, isSubscribed)}
                                                    disabled={subscribeMutation.isPending || unsubscribeMutation.isPending}
                                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSubscribed ? 'bg-green-500' : 'bg-gray-200'}`}
                                                    role="switch"
                                                    aria-checked={isSubscribed}
                                                >
                                                    <span
                                                        aria-hidden="true"
                                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isSubscribed ? 'translate-x-5' : 'translate-x-0'}`}
                                                    />
                                                </button>
                                            ) : (
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${isSubscribed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {isSubscribed ? 'Yes' : 'No'}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComplianceSubscriptionsPanel;
