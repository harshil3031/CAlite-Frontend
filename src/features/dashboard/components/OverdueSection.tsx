import React from 'react';
import { Link } from 'react-router-dom';
import { useDashboardOverdue } from '../hooks/useDashboard';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const OverdueSection: React.FC = () => {
    const { data, isLoading, isError, error } = useDashboardOverdue({ limit: 10 });

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-pulse">
                <div className="h-6 w-48 bg-slate-200 rounded mb-4" />
                <div className="h-40 bg-slate-100 rounded" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
                <p className="font-medium text-sm">Failed to load overdue records</p>
                <p className="text-xs mt-1">{(error as any)?.message}</p>
            </div>
        );
    }

    const records = data || [];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        ⚠️ Critical — Action Required
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Ordered by most overdue first</p>
                </div>
                {records.length > 0 && (
                    <Link to="/compliance?risk_level=critical" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                        View all critical records →
                    </Link>
                )}
            </div>

            <div className="p-0">
                {records.length === 0 ? (
                    <div className="p-10 text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <p className="text-slate-800 font-bold mb-1">🎉 No overdue compliance records.</p>
                        <p className="text-slate-500 text-sm">You're all caught up on critical filings.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y text-sm divide-slate-100">
                            <thead className="bg-slate-50 text-slate-500">
                                <tr>
                                    <th className="px-6 py-3 text-left font-semibold">Client Name</th>
                                    <th className="px-6 py-3 text-left font-semibold">Compliance Type</th>
                                    <th className="px-6 py-3 text-left font-semibold">Period</th>
                                    <th className="px-6 py-3 text-left font-semibold">Due Date</th>
                                    <th className="px-6 py-3 text-left font-semibold">Days Overdue</th>
                                    <th className="px-6 py-3 text-left font-semibold">Assigned To</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 bg-white">
                                {records.map((record: any) => (
                                    <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-3 font-medium text-blue-600">
                                            <Link to={`/clients/${record.client_id}`}>{record.client_name}</Link>
                                        </td>
                                        <td className="px-6 py-3 text-slate-700">{record.template_name}</td>
                                        <td className="px-6 py-3 text-slate-700">{record.period_label}</td>
                                        <td className="px-6 py-3 text-slate-700">
                                            {new Date(record.due_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-3 font-bold text-red-600">
                                            {Math.abs(record.days_remaining)} days
                                        </td>
                                        <td className="px-6 py-3 text-slate-500">{record.assigned_to_name || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OverdueSection;
