import React, { useState } from 'react';
import { getEvidenceUrl } from '../../../services/complianceService';

interface EvidencePanelProps {
    record: any;
    onClose: () => void;
}

const EvidencePanel: React.FC<EvidencePanelProps> = ({ record, onClose }) => {
    const [downloading, setDownloading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleDownload = async () => {
        setDownloading(true);
        setErrorMsg('');
        try {
            const response = await getEvidenceUrl(record.id);
            if (response && response.signed_url) {
                window.open(response.signed_url, '_blank');
            } else {
                setErrorMsg('Could not generate download link.');
            }
        } catch (err: any) {
            setErrorMsg(err.message || 'Error fetching url');
        } finally {
            setDownloading(false);
        }
    };

    const getISTDate = (isoString?: string | null, includeTime: boolean = false) => {
        if (!isoString) return '—';
        const options: Intl.DateTimeFormatOptions = {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {})
        };
        return new Date(isoString).toLocaleString('en-IN', options);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="text-lg font-medium text-gray-900">View Evidence</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>

                <div className="mb-4 text-sm text-gray-700 space-y-3">
                    <p><strong>Compliance:</strong> {record.template?.name}</p>
                    <p><strong>Period:</strong> {record.period_label}</p>
                    <p><strong>Filed On:</strong> {getISTDate(record.filed_on_date)}</p>
                    <p><strong>Filed By:</strong> {record.filed_by_user?.name || '—'}</p>
                    <p><strong>Acknowledgement #:</strong> {record.ack_number}</p>
                    <p><strong>Portal Reference:</strong> {record.portal_reference || "—"}</p>
                    <p><strong>Filed At:</strong> {record.status === 'filed' ? getISTDate(record.updated_at, true) : '—'}</p>

                    {record.is_locked && (
                        <p className="flex items-center text-red-600 font-medium bg-red-50 w-max px-2 py-1 rounded">
                            <span className="mr-2">🔒</span> Record Locked
                        </p>
                    )}
                </div>

                {errorMsg && (
                    <div className="mb-4 text-xs text-red-600 bg-red-50 p-2 rounded">
                        {errorMsg}
                    </div>
                )}

                <div className="flex flex-col mt-6 pt-4 border-t space-y-2">
                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm flex justify-center items-center"
                    >
                        {downloading ? 'Generating download link...' : 'Download Filing Proof'}
                    </button>
                    <p className="text-center text-[10px] text-gray-500">Link valid for 1 hour</p>
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EvidencePanel;
