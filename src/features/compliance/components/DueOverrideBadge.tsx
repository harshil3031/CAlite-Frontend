import React from 'react';
import { AlertCircle } from 'lucide-react';

interface DueOverrideBadgeProps {
    originalDate: string;
}

const DueOverrideBadge: React.FC<DueOverrideBadgeProps> = ({ originalDate }) => {
    return (
        <span
            className="inline-flex items-center px-1.5 py-0.5 ml-2 rounded text-[10px] font-medium border border-orange-200 text-orange-600 bg-orange-50 cursor-help"
            title={`Original: ${originalDate}`}
        >
            <AlertCircle className="w-3 h-3 mr-1" />
            Due date overridden
        </span>
    );
};

export default DueOverrideBadge;
