import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as complianceService from '../../../services/complianceService';
import { Database, Plus, CheckCircle, XCircle, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { TemplateFormModal } from '../components/TemplateFormModal';

export const TemplatesPage = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

    const { data: templatesData, isLoading, error } = useQuery({
        queryKey: ['platform', 'templates'],
        queryFn: complianceService.listTemplates
    });

    const templates = templatesData?.data;

    const createMutation = useMutation({
        mutationFn: complianceService.createTemplate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['platform', 'templates'] });
            setIsModalOpen(false);
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => complianceService.updateTemplate(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['platform', 'templates'] });
            setIsModalOpen(false);
        }
    });

    const handleOpenCreate = () => {
        setSelectedTemplate(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (template: any) => {
        setSelectedTemplate(template);
        setIsModalOpen(true);
    };

    const handleSubmit = (data: any) => {
        if (selectedTemplate) {
            updateMutation.mutate({ id: selectedTemplate.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

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
                Failed to load Compliance Templates. Please try again later.
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center sm:flex-row flex-col gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                        <Database className="w-6 h-6 text-indigo-600" />
                        Compliance Master Templates
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Global library of statutory laws dynamically propagating to all subscribed firms.
                    </p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition flex gap-2 items-center"
                >
                    <Plus className="w-4 h-4" />
                    Add Master Template
                </button>
            </div>

            <div className="bg-white border text-sm border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="py-3 px-4 font-semibold">Short Code</th>
                            <th className="py-3 px-4 font-semibold">Name</th>
                            <th className="py-3 px-4 font-semibold">Authority</th>
                            <th className="py-3 px-4 font-semibold">Frequency</th>
                            <th className="py-3 px-4 font-semibold">Due Day</th>
                            <th className="py-3 px-4 font-semibold">Status</th>
                            <th className="py-3 px-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {templates?.map((t: any) => (
                            <tr key={t.id} className="hover:bg-slate-50/50 transition">
                                <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                                    {t.shortCode}
                                </td>
                                <td className="py-3 px-4 font-medium text-slate-900">
                                    {t.name}
                                    <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">
                                        Version {t.version}
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-slate-600">
                                    {t.authority}
                                </td>
                                <td className="py-3 px-4 text-slate-600 capitalize">
                                    {t.frequency.replace('_', '-')}
                                </td>
                                <td className="py-3 px-4 font-mono text-slate-900">
                                    {t.dueDay || 'N/A'}
                                </td>
                                <td className="py-3 px-4">
                                    {t.isActive ? (
                                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded text-xs font-semibold">
                                            <CheckCircle className="w-3 h-3" /> Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-1 rounded text-xs font-semibold">
                                            <XCircle className="w-3 h-3" /> Inactive
                                        </span>
                                    )}
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <button
                                        onClick={() => handleOpenEdit(t)}
                                        className="text-slate-400 hover:text-indigo-600 p-1 rounded transition"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {(!templates || templates.length === 0) && (
                            <tr>
                                <td colSpan={7} className="py-8 text-center text-slate-500">
                                    No master templates defined.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <TemplateFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={selectedTemplate}
                isLoading={createMutation.isPending || updateMutation.isPending}
            />
        </div>
    );
};

export default TemplatesPage;
