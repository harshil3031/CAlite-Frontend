import React from 'react';
import { useNavigate } from 'react-router-dom';

interface RiskSummarySectionProps {
    summary: any;
    isLoading: boolean;
}

const RiskSummarySection: React.FC<RiskSummarySectionProps> = ({ summary, isLoading }) => {
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded-xl" />
                ))}
            </div>
        );
    }

    const riskData = summary?.compliance?.risk_summary || { critical: 0, red: 0, yellow: 0, green: 0 };

    const cards = [
        {
            label: '⚫ CRITICAL',
            count: riskData.critical,
            bg: 'bg-black',
            text: 'text-white',
            border: 'border-black',
            riskKey: 'critical'
        },
        {
            label: '🔴 Urgent',
            count: riskData.red,
            bg: 'bg-red-600',
            text: 'text-white',
            border: 'border-red-600',
            riskKey: 'red'
        },
        {
            label: '🟡 Attention',
            count: riskData.yellow,
            bg: 'bg-amber-400',
            text: 'text-gray-900',
            border: 'border-amber-400',
            riskKey: 'yellow'
        },
        {
            label: '🟢 Safe',
            count: riskData.green,
            bg: 'bg-green-600',
            text: 'text-white',
            border: 'border-green-600',
            riskKey: 'green'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {cards.map((card) => (
                <div
                    key={card.label}
                    onClick={() => navigate(`/compliance?risk_level=${card.riskKey}`)}
                    className={`relative overflow-hidden cursor-pointer shadow-sm rounded-2xl p-5 hover:shadow-md transition-shadow ${card.bg} ${card.text} ${card.border}`}
                >
                    {card.riskKey === 'critical' && card.count > 0 && (
                        <span className="absolute top-4 right-4 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    )}
                    <h3 className="text-sm font-bold opacity-90">{card.label}</h3>
                    <p className="text-3xl font-black mt-2">{card.count}</p>
                </div>
            ))}
        </div>
    );
};

export default RiskSummarySection;
