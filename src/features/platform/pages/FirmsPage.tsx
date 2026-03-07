import { useQuery } from '@tanstack/react-query';
import { platformService } from '../../../services/platformService';
import { Building2, Plus, Calendar, Mail, Phone, ExternalLink } from 'lucide-react';
import StatusBadge from '../../compliance/components/StatusBadge';

export const FirmsPage = () => {
    const { data: firms, isLoading, error } = useQuery({
        queryKey: ['platform', 'firms'],
        queryFn: platformService.getAllFirms
    });

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl m-8">
                Failed to load CA Firms. Please try again later.
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center sm:flex-row flex-col gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                        <Building2 className="w-6 h-6 text-indigo-600" />
                        Platform CA Firms
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Global view of all registered CA Firms on the CAlite Platform.
                    </p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition flex gap-2 items-center">
                    <Plus className="w-4 h-4" />
                    Manually Add Firm
                </button>
            </div>

            <div className="bg-white border text-sm border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="py-3 px-4 font-semibold">Firm Name</th>
                            <th className="py-3 px-4 font-semibold">Contact</th>
                            <th className="py-3 px-4 font-semibold">Plan</th>
                            <th className="py-3 px-4 font-semibold">Status</th>
                            <th className="py-3 px-4 font-semibold">Joined At</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {firms?.map((firm) => (
                            <tr key={firm.id} className="hover:bg-slate-50/50 transition">
                                <td className="py-3 px-4">
                                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                                        {firm.name}
                                        <ExternalLink className="w-3 h-3 text-slate-400 cursor-pointer hover:text-indigo-600" />
                                    </div>
                                    <div className="text-xs text-slate-500 font-mono mt-0.5" title={firm.id}>
                                        {firm.id.slice(0, 8)}...
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex flex-col gap-1">
                                        {firm.contactEmail && (
                                            <span className="flex items-center gap-1.5 text-slate-600">
                                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                {firm.contactEmail}
                                            </span>
                                        )}
                                        {firm.phone && (
                                            <span className="flex items-center gap-1.5 text-slate-600">
                                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                {firm.phone}
                                            </span>
                                        )}
                                        {!firm.contactEmail && !firm.phone && (
                                            <span className="text-slate-400 italic">No contact info</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3 px-4 font-medium text-slate-700 capitalize">
                                    {firm.subscriptionTier}
                                </td>
                                <td className="py-3 px-4">
                                    <StatusBadge status={firm.status as any} />
                                </td>
                                <td className="py-3 px-4 text-slate-600 flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    {new Date(firm.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        {(!firms || firms.length === 0) && (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-slate-500">
                                    No CA Firms registered yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FirmsPage;
