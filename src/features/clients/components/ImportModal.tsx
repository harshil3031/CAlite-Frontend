import { useState } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, Loader2, Download } from 'lucide-react';
import { useValidateImport, useConfirmImport } from '../hooks/useImport';
import { importService, type ImportPreviewDTO } from '../../../services/importService';

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'upload' | 'preview' | 'result';

export const ImportModal = ({ isOpen, onClose }: ImportModalProps) => {
    const [step, setStep] = useState<Step>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<ImportPreviewDTO | null>(null);
    const [importResult, setImportResult] = useState<{ imported: number; async: boolean } | null>(null);

    const validateMutation = useValidateImport();
    const confirmMutation = useConfirmImport();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const onValidate = () => {
        if (!file) return;
        validateMutation.mutate(file, {
            onSuccess: (data) => {
                setPreview(data);
                setStep('preview');
            },
        });
    };

    const onConfirm = () => {
        if (!preview) return;
        confirmMutation.mutate(preview.import_session_id, {
            onSuccess: (data) => {
                setImportResult({
                    imported: data.result.imported,
                    async: data.status === 202,
                });
                setStep('result');
            },
        });
    };

    const handleClose = () => {
        setStep('upload');
        setFile(null);
        setPreview(null);
        setImportResult(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Import Clients</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Bulk upload clients via CSV file</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {step === 'upload' && (
                        <div className="space-y-6">
                            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
                                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                    <Download className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-indigo-900">Step 1: Download Template</h4>
                                    <p className="text-xs text-indigo-700 mt-1 mb-3">Use our standardized CSV format to ensure your data is processed correctly.</p>
                                    <button
                                        onClick={() => importService.getTemplate()}
                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline flex items-center gap-1"
                                    >
                                        Download .CSV Template
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-800">Step 2: Upload Files</h4>
                                <div className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors ${file ? 'border-indigo-400 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                                    <div className={`p-4 rounded-full mb-4 ${file ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    {file ? (
                                        <div className="text-center">
                                            <p className="text-sm font-semibold text-slate-900">{file.name}</p>
                                            <p className="text-xs text-slate-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                                            <button
                                                onClick={() => setFile(null)}
                                                className="text-xs text-red-500 font-bold mt-4 hover:underline"
                                            >
                                                Remove file
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <p className="text-sm font-semibold text-slate-900">Drop your CSV file here</p>
                                            <p className="text-xs text-slate-500 mt-1">or click to browse from computer</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        disabled={validateMutation.isPending}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onValidate}
                                    disabled={!file || validateMutation.isPending}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 border border-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {validateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                    {validateMutation.isPending ? 'Validating...' : 'Validate CSV'}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'preview' && preview && (
                        <div className="space-y-6">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Total Rows</p>
                                    <p className="text-lg font-bold text-slate-900">{preview.total_rows}</p>
                                </div>
                                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-emerald-700">
                                    <p className="text-[10px] uppercase tracking-wider font-bold opacity-70">Valid Rows</p>
                                    <p className="text-lg font-bold">{preview.valid_rows}</p>
                                </div>
                                <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-red-700">
                                    <p className="text-[10px] uppercase tracking-wider font-bold opacity-70">Errors</p>
                                    <p className="text-lg font-bold">{preview.errors.length}</p>
                                </div>
                                <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-amber-700">
                                    <p className="text-[10px] uppercase tracking-wider font-bold opacity-70">Warnings</p>
                                    <p className="text-lg font-bold">{preview.warnings.length}</p>
                                </div>
                            </div>

                            {/* Errors Table */}
                            {preview.errors.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-red-700">
                                        <AlertCircle className="w-4 h-4" />
                                        Critical Errors ({preview.errors.length})
                                    </h4>
                                    <div className="max-h-40 overflow-y-auto rounded-lg border border-red-100">
                                        <table className="min-w-full divide-y divide-red-50">
                                            <thead className="bg-red-50/50 sticky top-0">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-[10px] font-bold text-red-800 uppercase">Row</th>
                                                    <th className="px-3 py-2 text-left text-[10px] font-bold text-red-800 uppercase">Field</th>
                                                    <th className="px-3 py-2 text-left text-[10px] font-bold text-red-800 uppercase">Message</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-red-50">
                                                {preview.errors.map((err, i) => (
                                                    <tr key={i}>
                                                        <td className="px-3 py-2 text-xs text-red-600 font-mono">{err.row}</td>
                                                        <td className="px-3 py-2 text-xs text-red-800 font-bold capitalize">{err.field.replace('_', ' ')}</td>
                                                        <td className="px-3 py-2 text-xs text-red-600">{err.message}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setStep('upload')}
                                    disabled={confirmMutation.isPending}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Re-upload
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={preview.valid_rows === 0 || confirmMutation.isPending}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 border border-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {confirmMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                    {confirmMutation.isPending ? 'Importing...' : `Confirm Import (${preview.valid_rows} rows)`}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'result' && importResult && (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4">
                            <div className="p-4 bg-emerald-100 text-emerald-600 rounded-full">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold text-slate-900">
                                    {importResult.async ? 'Import Started!' : 'Import Successful!'}
                                </h3>
                                <p className="text-sm text-slate-500 max-w-sm">
                                    {importResult.async
                                        ? 'Your large CSV file is being processed in the background. New clients will appear in the list shortly.'
                                        : `Successfully imported ${importResult.imported} new clients to your firm.`}
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="mt-6 px-10 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
