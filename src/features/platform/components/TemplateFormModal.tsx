import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

interface TemplateFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: any;
    isLoading?: boolean;
}

export const TemplateFormModal: React.FC<TemplateFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        short_code: '',
        authority: '',
        frequency: 'monthly',
        due_day: 15,
        due_month_offset: 0,
        applicable_entity_types: ['pvt_ltd', 'llp', 'individual', 'huf', 'proprietorship', 'partnership'],
        country_code: 'IN',
        notes: '',
        is_active: true,
    });

    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData && isOpen) {
            setFormData({
                name: initialData.name || '',
                short_code: initialData.shortCode || '',
                authority: initialData.authority || '',
                frequency: initialData.frequency || 'monthly',
                due_day: initialData.dueDay || 15,
                due_month_offset: initialData.dueMonthOffset || 0,
                applicable_entity_types: initialData.applicableEntityTypes || ['pvt_ltd', 'llp'],
                country_code: initialData.countryCode || 'IN',
                notes: initialData.notes || '',
                is_active: initialData.isActive ?? true,
            });
        } else if (isOpen) {
            // Reset to defaults on open for create
            setFormData({
                name: '',
                short_code: '',
                authority: '',
                frequency: 'monthly',
                due_day: 15,
                due_month_offset: 0,
                applicable_entity_types: ['pvt_ltd', 'llp', 'individual', 'huf', 'proprietorship', 'partnership'],
                country_code: 'IN',
                notes: '',
                is_active: true,
            });
            setError('');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.short_code || !formData.authority) {
            setError('Please fill in all required fields');
            return;
        }

        // Prepare payload exactly as expected by backend
        const payload = {
            ...formData,
        };

        onSubmit(payload);
    };

    const isEditMode = !!initialData;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-900">
                        {isEditMode ? 'Edit Master Template' : 'Add Master Template'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100 p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <form id="templateForm" onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-100">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1 block col-span-2">
                                <label className="text-sm font-medium text-slate-700">Template Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm placeholder:text-slate-400"
                                    placeholder="e.g. GSTR-3B Monthly Return"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Short Code *</label>
                                <input
                                    type="text"
                                    value={formData.short_code}
                                    onChange={(e) => setFormData({ ...formData, short_code: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm uppercase placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-500"
                                    placeholder="e.g. GSTR-3B"
                                    disabled={isLoading || isEditMode}
                                />
                                {isEditMode && <p className="text-[10px] text-slate-500">Short code immutable.</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Authority *</label>
                                <input
                                    type="text"
                                    value={formData.authority}
                                    onChange={(e) => setFormData({ ...formData, authority: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm placeholder:text-slate-400"
                                    placeholder="e.g. GSTN"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Frequency *</label>
                                <select
                                    value={formData.frequency}
                                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm disabled:bg-slate-50 disabled:text-slate-500"
                                    disabled={isLoading || isEditMode}
                                >
                                    <option value="monthly">Monthly</option>
                                    <option value="quarterly">Quarterly</option>
                                    <option value="half-yearly">Half-Yearly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                                {isEditMode && <p className="text-[10px] text-slate-500">Frequency immutable.</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Due Day *</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="31"
                                    value={formData.due_day}
                                    onChange={(e) => setFormData({ ...formData, due_day: parseInt(e.target.value) || 15 })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-1 block col-span-2">
                                <label className="text-sm font-medium text-slate-700">Applicable Entities (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.applicable_entity_types.join(', ')}
                                    onChange={(e) => {
                                        const values = e.target.value.split(',').map(v => v.trim()).filter(Boolean);
                                        setFormData({ ...formData, applicable_entity_types: values.length ? values : ['pvt_ltd'] });
                                    }}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                    placeholder="pvt_ltd, llp, individual"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-1 block col-span-2">
                                <label className="text-sm font-medium text-slate-700">Notes (Optional)</label>
                                <textarea
                                    value={formData.notes || ''}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
                                    rows={3}
                                    placeholder="Any additional notes or instructions"
                                    disabled={isLoading}
                                    maxLength={1000}
                                />
                            </div>

                            {isEditMode && (
                                <div className="space-y-1 col-span-2 mt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                                            disabled={isLoading}
                                        />
                                        <span className="text-sm font-medium text-slate-700">Is Active</span>
                                    </label>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 rounded-b-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-800 focus:outline-none transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="templateForm"
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 border border-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50 flex items-center justify-center min-w-[100px]"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
