import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MoreVertical, AlertTriangle } from 'lucide-react';
import StatusBadge from './StatusBadge';
import RiskBadge from './RiskBadge';
import LockedBadge from './LockedBadge';
import DueOverrideBadge from './DueOverrideBadge';
import type { RootState } from '../../../store';
import UpdateStatusModal from './UpdateStatusModal';
import FileRecordModal from './FileRecordModal';
import UnlockRecordModal from './UnlockRecordModal';
import WaiveRecordModal from './WaiveRecordModal';
import OverrideDueDateModal from './OverrideDueDateModal';
import EvidencePanel from './EvidencePanel';

interface ComplianceTableProps {
    records: any[];
    isLoading: boolean;
    clientScoped?: boolean;
}

const ComplianceTable: React.FC<ComplianceTableProps> = ({ records, isLoading, clientScoped = false }) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const isAdmin = user?.role === 'ADMIN';

    // Modal states
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const openModal = (modalName: string, record: any) => {
        setSelectedRecord(record);
        setActiveModal(modalName);
        setActiveDropdown(null);
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedRecord(null);
    };

    if (isLoading) {
        return (
            <div className="animate-pulse flex flex-col space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded"></div>
                ))}
            </div>
        );
    }

    if (!records || records.length === 0) {
        return (
            <div className="py-12 text-center text-gray-500 bg-white border rounded">
                {clientScoped ? "No compliance records yet. Records are auto-generated when clients are created and on the 1st of each month." : "No compliance records found."}
            </div>
        );
    }

    const getISTDate = (isoString?: string | null) => {
        if (!isoString) return '—';
        return new Date(isoString).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="overflow-x-auto bg-white border rounded-md shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 text-gray-500">
                    <tr>
                        {!clientScoped && <th className="px-4 py-3 text-left font-medium">Client Name</th>}
                        <th className="px-4 py-3 text-left font-medium">Template Name</th>
                        <th className="px-4 py-3 text-left font-medium">Category</th>
                        <th className="px-4 py-3 text-left font-medium">Period</th>
                        <th className="px-4 py-3 text-left font-medium">Due Date</th>
                        <th className="px-4 py-3 text-left font-medium">Risk Level</th>
                        <th className="px-4 py-3 text-left font-medium">Status</th>
                        <th className="px-4 py-3 text-left font-medium">Assigned To</th>
                        <th className="px-4 py-3 text-left font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {records.map((record) => {
                        const isRowWarning = record.risk_level === 'critical' && record.days_remaining !== null && record.days_remaining < 0 && !record.is_backfilled;

                        let rowClass = "hover:bg-gray-50 transition-colors relative";
                        let templateClass = "";
                        let dueDateClass = "text-gray-900";
                        let dueDateIcon = null;

                        if (record.is_backfilled) {
                            rowClass += " italic";
                        } else if (record.is_locked) {
                            rowClass += " bg-green-50/50";
                        } else if (isRowWarning) {
                            rowClass += " bg-red-50/50";
                        }

                        if (!record.is_locked && record.status !== 'filed') {
                            if (record.days_remaining !== null) {
                                if (record.days_remaining < 0) {
                                    dueDateClass = "text-red-600 font-medium";
                                    dueDateIcon = <AlertTriangle className="w-4 h-4 text-red-600 ml-1 inline" />;
                                } else if (record.days_remaining <= 7) {
                                    dueDateClass = "text-amber-600 font-medium";
                                }
                            }
                        }

                        return (
                            <tr key={record.id} className={rowClass}>
                                {!clientScoped && (
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <Link to={`/clients/${record.client_id}`} className="text-blue-600 hover:underline font-medium">
                                            {record.client?.name || 'Unknown'}
                                        </Link>
                                    </td>
                                )}
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div>
                                        <span className={templateClass}>{record.template?.short_code} - {record.template?.name}</span>
                                        {record.is_backfilled && <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded rounded-full font-medium not-italic">Historical</span>}
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                                    {record.template?.authority}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                                    {record.period_label}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <span className={dueDateClass}>{getISTDate(record.due_date)}</span>
                                        {dueDateIcon}
                                        {record.due_date_overridden && <DueOverrideBadge originalDate={getISTDate(record.original_due_date || record.due_date)} />}
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <RiskBadge
                                        riskLevel={record.risk_level}
                                        showDays={true}
                                        daysRemaining={record.days_remaining}
                                    />
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <StatusBadge status={record.status} />
                                    {record.is_locked && <div className="mt-1"><LockedBadge /></div>}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                                    {record.assigned_user?.name || '—'}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium relative">
                                    <div className="flex items-center space-x-2">
                                        {record.is_locked ? (
                                            <>
                                                <button
                                                    onClick={() => openModal('evidence', record)}
                                                    className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50"
                                                >
                                                    View Evidence
                                                </button>
                                                {isAdmin && (
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setActiveDropdown(activeDropdown === record.id ? null : record.id)}
                                                            className="p-1 rounded hover:bg-gray-200"
                                                        >
                                                            <MoreVertical className="w-4 h-4 text-gray-600" />
                                                        </button>
                                                        {activeDropdown === record.id && (
                                                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10 py-1">
                                                                <button
                                                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                                    onClick={() => { openModal('unlock', record); setActiveDropdown(null); }}
                                                                >
                                                                    Unlock Record
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => openModal('updateStatus', record)}
                                                    className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50"
                                                >
                                                    Update Status
                                                </button>
                                                {record.status === 'under_review' && (
                                                    <button
                                                        onClick={() => openModal('fileRecord', record)}
                                                        className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50 font-medium"
                                                    >
                                                        Mark as Filed
                                                    </button>
                                                )}
                                                {isAdmin && (
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setActiveDropdown(activeDropdown === record.id ? null : record.id)}
                                                            className="p-1 rounded hover:bg-gray-200"
                                                        >
                                                            <MoreVertical className="w-4 h-4 text-gray-600" />
                                                        </button>
                                                        {activeDropdown === record.id && (
                                                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10 py-1 text-left text-gray-700">
                                                                <button
                                                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                                    onClick={() => { openModal('waive', record); setActiveDropdown(null); }}
                                                                >
                                                                    Waive Record
                                                                </button>
                                                                <button
                                                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                                    onClick={() => { openModal('overrideDue', record); setActiveDropdown(null); }}
                                                                >
                                                                    Override Due Date
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {activeModal === 'updateStatus' && selectedRecord && (
                <UpdateStatusModal
                    record={selectedRecord}
                    clientId={clientScoped ? selectedRecord.client_id : undefined}
                    onClose={closeModal}
                />
            )}
            {activeModal === 'fileRecord' && selectedRecord && (
                <FileRecordModal
                    record={selectedRecord}
                    onClose={closeModal}
                />
            )}
            {activeModal === 'unlock' && selectedRecord && (
                <UnlockRecordModal
                    record={selectedRecord}
                    onClose={closeModal}
                />
            )}
            {activeModal === 'waive' && selectedRecord && (
                <WaiveRecordModal
                    record={selectedRecord}
                    onClose={closeModal}
                />
            )}
            {activeModal === 'overrideDue' && selectedRecord && (
                <OverrideDueDateModal
                    record={selectedRecord}
                    onClose={closeModal}
                />
            )}
            {activeModal === 'evidence' && selectedRecord && (
                <EvidencePanel
                    record={selectedRecord}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default ComplianceTable;
