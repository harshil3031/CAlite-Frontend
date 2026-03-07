import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useFileRecord } from '../hooks/useCompliance';
import type { RootState } from '../../../store';

interface FileRecordModalProps {
    record: any;
    onClose: () => void;
}

const FileRecordModal: React.FC<FileRecordModalProps> = ({ record, onClose }) => {
    const [filedOnDate, setFiledOnDate] = useState('');
    const [ackNumber, setAckNumber] = useState('');
    const [portalReference, setPortalReference] = useState('');
    const [evidencePdf, setEvidencePdf] = useState<File | null>(null);
    const [fileError, setFileError] = useState('');

    const user = useSelector((state: RootState) => state.auth.user);
    const fileRecordMutation = useFileRecord();

    if (record.status !== 'under_review') {
        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                    <div className="mt-3 text-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Cannot File Record</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Record must be In Review before filing. Update status to Under Review first.
                        </p>
                        <div className="flex justify-center">
                            <button
                                type="button"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                onClick={onClose}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFileError('');
        if (!file) {
            setEvidencePdf(null);
            return;
        }
        if (file.type !== 'application/pdf') {
            setFileError('Only PDF files are accepted');
            setEvidencePdf(null);
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setFileError('PDF must not exceed 10 MB');
            setEvidencePdf(null);
            return;
        }
        setEvidencePdf(file);
    };

    const getToday = () => {
        const today = new Date();
        // format as YYYY-MM-DD
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const todayStr = getToday();
    const minDate = record.period_start?.split('T')[0] || '';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!filedOnDate || filedOnDate > todayStr || (minDate && filedOnDate < minDate)) {
            setFileError('Invalid filed date.');
            return;
        }
        if (ackNumber.length < 5) {
            setFileError('Acknowledgement number must be at least 5 characters');
            return;
        }
        if (!evidencePdf) {
            setFileError('Filing Proof PDF is required');
            return;
        }

        const formData = new FormData();
        formData.append('filed_on_date', filedOnDate);
        formData.append('ack_number', ackNumber);
        if (portalReference) {
            formData.append('portal_reference', portalReference);
        }
        formData.append('evidence_pdf', evidencePdf);

        fileRecordMutation.mutate(
            { id: record.id, formData },
            {
                onSuccess: () => {
                    onClose(); // Parent/toast handles success message
                },
            }
        );
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
                <div className="mt-2">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Submit Filing Evidence</h3>
                    <div className="mb-4 text-xs text-gray-600 bg-gray-50 p-3 rounded">
                        <p><strong>Client:</strong> {record.client?.name}</p>
                        <p><strong>Compliance:</strong> {record.template?.name}</p>
                        <p><strong>Period:</strong> {record.period_label}</p>
                        <p><strong>Due Date:</strong> {record.due_date ? new Date(record.due_date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) : '—'}</p>
                    </div>

                    {fileError && (
                        <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                            {fileError}
                        </div>
                    )}

                    {fileRecordMutation.isError && (
                        <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                            {fileRecordMutation.error?.status === 409
                                ? 'This record is already filed and locked.'
                                : 'Upload failed. The record has NOT been locked. Please try again.'}
                        </div>
                    )}

                    {fileRecordMutation.isSuccess && (
                        <div className="mb-4 text-sm text-green-600 bg-green-50 p-2 rounded flex items-center">
                            <span className="mr-2">🔒</span> Record filed and locked successfully. Acknowledgement saved.
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Filed On Date *</label>
                            <input
                                type="date"
                                required
                                max={todayStr}
                                min={minDate}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                value={filedOnDate}
                                onChange={(e) => setFiledOnDate(e.target.value)}
                                disabled={fileRecordMutation.isPending}
                            />
                            <p className="text-[10px] text-gray-500 mt-1">Cannot precede {minDate} or be in the future.</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Filed By</label>
                            <input
                                type="text"
                                readOnly
                                className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                                value={user?.full_name || 'Loading...'}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Acknowledgement Number *</label>
                            <input
                                type="text"
                                required
                                minLength={5}
                                maxLength={100}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                value={ackNumber}
                                onChange={(e) => setAckNumber(e.target.value)}
                                disabled={fileRecordMutation.isPending}
                                placeholder="Enter ack number"
                            />
                            <p className="text-[10px] text-gray-500 mt-1">{ackNumber.length}/100 characters</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Portal Reference Number</label>
                            <input
                                type="text"
                                maxLength={200}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                value={portalReference}
                                onChange={(e) => setPortalReference(e.target.value)}
                                disabled={fileRecordMutation.isPending}
                                placeholder="Optional"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Filing Proof (PDF) *</label>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                disabled={fileRecordMutation.isPending}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {evidencePdf && (
                                <p className="mt-2 text-sm text-green-600">✓ PDF selected: {evidencePdf.name} ({(evidencePdf.size / 1024 / 1024).toFixed(2)} MB)</p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3 mt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
                                disabled={fileRecordMutation.isPending}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm flex items-center"
                                disabled={!filedOnDate || ackNumber.length < 5 || !evidencePdf || fileRecordMutation.isPending}
                            >
                                {fileRecordMutation.isPending ? 'Uploading evidence...' : 'Submit Filing Evidence'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FileRecordModal;
