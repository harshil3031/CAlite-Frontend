import React, { useState, useRef } from 'react';
import { useValidateImport, useConfirmImport } from '../hooks/useImport';
import { importService, type ImportPreviewDTO } from '../../../services/importService';
import { toastSuccess, toastError } from '../../../lib/toast';
import { useNavigate } from 'react-router-dom';

type ImportStep = 'upload' | 'preview' | 'progress';

export default function ImportPage() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [step, setStep] = useState<ImportStep>('upload');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<ImportPreviewDTO | null>(null);
    const [progress, setProgress] = useState(0);

    const validateMutation = useValidateImport();
    const confirmMutation = useConfirmImport();

    const handleDownloadTemplate = async () => {
        try {
            await importService.getTemplate();
            toastSuccess('Template downloaded successfully');
        } catch (error: any) {
            toastError(error.message || 'Failed to download template');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.name.endsWith('.csv')) {
                toastError('Please select a CSV file');
                return;
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                toastError('File size must be less than 10MB');
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        validateMutation.mutate(selectedFile, {
            onSuccess: (data) => {
                setPreview(data);
                setStep('preview');
            },
        });
    };

    const handleConfirm = async () => {
        if (!preview) return;

        setStep('progress');
        setProgress(0);

        confirmMutation.mutate(preview.import_session_id, {
            onSuccess: (response) => {
                // Simulate progress for async imports
                if (response.status === 202) {
                    simulateProgress();
                } else {
                    setProgress(100);
                    toastSuccess(`Successfully imported ${response.result.imported} clients`);
                    setTimeout(() => {
                        navigate('/clients');
                    }, 2000);
                }
            },
        });
    };

    const simulateProgress = () => {
        let current = 0;
        const interval = setInterval(() => {
            current += 10;
            setProgress(current);
            if (current >= 100) {
                clearInterval(interval);
                toastSuccess('Import completed successfully');
                setTimeout(() => {
                    navigate('/clients');
                }, 2000);
            }
        }, 500);
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setPreview(null);
        setStep('upload');
        setProgress(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Import Clients</h1>
                <p className="text-gray-600 mt-1">Upload a CSV file to bulk import client records</p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step === 'upload' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                            }`}>
                            {step === 'upload' ? '1' : '✓'}
                        </div>
                        <span className={`ml-2 font-medium ${step === 'upload' ? 'text-blue-600' : 'text-green-600'}`}>
                            Upload
                        </span>
                    </div>
                    <div className={`flex-1 h-1 mx-4 ${step !== 'upload' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                    <div className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step === 'preview' ? 'bg-blue-600 text-white' :
                                step === 'progress' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                            }`}>
                            {step === 'progress' ? '✓' : '2'}
                        </div>
                        <span className={`ml-2 font-medium ${step === 'preview' ? 'text-blue-600' :
                                step === 'progress' ? 'text-green-600' : 'text-gray-600'
                            }`}>
                            Preview
                        </span>
                    </div>
                    <div className={`flex-1 h-1 mx-4 ${step === 'progress' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                    <div className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step === 'progress' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                            }`}>
                            3
                        </div>
                        <span className={`ml-2 font-medium ${step === 'progress' ? 'text-blue-600' : 'text-gray-600'}`}>
                            Import
                        </span>
                    </div>
                </div>
            </div>

            {/* Step 1: Upload */}
            {step === 'upload' && (
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Step 1: Upload CSV File</h2>
                        <p className="text-gray-600 text-sm">
                            Download the template below and fill it with your client data. Then upload the completed CSV file.
                        </p>
                    </div>

                    <button
                        onClick={handleDownloadTemplate}
                        className="mb-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download CSV Template
                    </button>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        {!selectedFile ? (
                            <>
                                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-gray-700 font-medium mb-1">Click to upload or drag and drop</p>
                                <p className="text-gray-500 text-sm mb-4">CSV file (max 10MB)</p>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                >
                                    Select File
                                </button>
                            </>
                        ) : (
                            <>
                                <svg className="w-12 h-12 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-gray-700 font-medium mb-1">{selectedFile.name}</p>
                                <p className="text-gray-500 text-sm mb-4">
                                    {(selectedFile.size / 1024).toFixed(2)} KB
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                                    >
                                        Change File
                                    </button>
                                    <button
                                        onClick={handleUpload}
                                        disabled={validateMutation.isPending}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        {validateMutation.isPending ? 'Validating...' : 'Continue'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-900 mb-2">CSV Format Requirements:</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Required columns: client_name, email, entity_type, pan, mobile</li>
                            <li>• Optional columns: gstin, address</li>
                            <li>• Entity type must be one of: Individual, Proprietorship, etc.</li>
                            <li>• PAN must be in valid format (e.g., ABCDE1234F)</li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Step 2: Preview */}
            {step === 'preview' && preview && (
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Step 2: Review and Confirm</h2>
                        <p className="text-gray-600 text-sm">
                            Review the validation results below and confirm to proceed with the import.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="text-2xl font-bold text-green-700">{preview.valid_rows}</div>
                            <div className="text-sm text-green-600">Valid Rows</div>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="text-2xl font-bold text-gray-700">{preview.total_rows}</div>
                            <div className="text-sm text-gray-600">Total Rows</div>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="text-2xl font-bold text-yellow-700">{preview.skipped_rows}</div>
                            <div className="text-sm text-yellow-600">Will Be Skipped</div>
                        </div>
                    </div>

                    {(preview?.errors?.length ?? 0) > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-red-900 mb-3">Validation Errors ({preview?.errors?.length ?? 0})</h3>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-red-900 border-b border-red-200">
                                            <th className="pb-2">Row</th>
                                            <th className="pb-2">Field</th>
                                            <th className="pb-2">Message</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-red-800">
                                        {preview.errors.map((error, idx) => (
                                            <tr key={idx} className="border-b border-red-100">
                                                <td className="py-2">{error.row}</td>
                                                <td className="py-2">{error.field}</td>
                                                <td className="py-2">{error.message}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {(preview?.warnings?.length ?? 0) > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-yellow-900 mb-3">Warnings ({preview?.warnings?.length ?? 0})</h3>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-yellow-900 border-b border-yellow-200">
                                            <th className="pb-2">Row</th>
                                            <th className="pb-2">Field</th>
                                            <th className="pb-2">Message</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-yellow-800">
                                        {preview.warnings.map((warning, idx) => (
                                            <tr key={idx} className="border-b border-yellow-100">
                                                <td className="py-2">{warning.row}</td>
                                                <td className="py-2">{warning.field}</td>
                                                <td className="py-2">{warning.message}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={preview.valid_rows === 0}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Confirm Import ({preview.valid_rows} clients)
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Progress */}
            {step === 'progress' && (
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Step 3: Importing Clients</h2>
                        <p className="text-gray-600 text-sm">
                            Please wait while we import your clients. This may take a few moments.
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Progress</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>

                    {progress === 100 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="text-green-900 font-medium">Import Completed Successfully</p>
                                <p className="text-green-700 text-sm">Redirecting to clients page...</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
