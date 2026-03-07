import React from 'react';

interface RiskBadgeProps {
    riskLevel: string;
    showDays?: boolean;
    daysRemaining?: number | null;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ riskLevel, showDays, daysRemaining }) => {
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-800';
    let label = '⬜ Filed/Waived';

    switch (riskLevel?.toLowerCase()) {
        case 'critical':
            bgColor = 'bg-black';
            textColor = 'text-white';
            label = '⚫ CRITICAL';
            break;
        case 'red':
            bgColor = 'bg-red-600';
            textColor = 'text-white';
            label = '🔴 Urgent';
            break;
        case 'yellow':
            bgColor = 'bg-amber-400';
            textColor = 'text-gray-900';
            label = '🟡 Attention';
            break;
        case 'green':
            bgColor = 'bg-green-600';
            textColor = 'text-white';
            label = '🟢 Safe';
            break;
        case 'none':
        default:
            bgColor = 'bg-gray-200';
            textColor = 'text-gray-700';
            label = '⬜ Filed/Waived';
            break;
    }

    let daysText = null;
    if (showDays && daysRemaining !== undefined && daysRemaining !== null) {
        if (daysRemaining > 0) {
            daysText = <span className="text-green-600 ml-2 text-xs font-medium">+ {daysRemaining} days</span>;
        } else if (daysRemaining === 0) {
            daysText = <span className="text-red-600 ml-2 text-xs font-medium">Due today</span>;
        } else {
            daysText = <span className="text-red-700 font-bold ml-2 text-xs">Overdue by {Math.abs(daysRemaining)} days</span>;
        }
    }

    return (
        <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
                {label}
            </span>
            {daysText}
        </div>
    );
};

export default RiskBadge;
