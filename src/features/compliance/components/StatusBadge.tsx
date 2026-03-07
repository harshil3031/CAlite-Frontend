import React from 'react';

interface StatusBadgeProps {
    status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-800';
    let label = status;

    switch (status) {
        case 'not_started':
            bgColor = 'bg-gray-100';
            textColor = 'text-gray-800';
            label = 'Not Started';
            break;
        case 'in_progress':
            bgColor = 'bg-blue-100';
            textColor = 'text-blue-800';
            label = 'In Progress';
            break;
        case 'pending_client_data':
            bgColor = 'bg-amber-100';
            textColor = 'text-amber-800';
            label = 'Pending Data';
            break;
        case 'under_review':
            bgColor = 'bg-purple-100';
            textColor = 'text-purple-800';
            label = 'Under Review';
            break;
        case 'filed':
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
            label = 'Filed';
            break;
        case 'on_hold':
            bgColor = 'bg-orange-100';
            textColor = 'text-orange-800';
            label = 'On Hold';
            break;
        case 'waived':
            bgColor = 'bg-slate-100';
            textColor = 'text-slate-800';
            label = 'Waived';
            break;
        default:
            bgColor = 'bg-gray-100';
            textColor = 'text-gray-800';
            label = status;
            break;
    }

    return (
        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
            {label}
        </span>
    );
};

export default StatusBadge;
