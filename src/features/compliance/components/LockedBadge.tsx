import React from 'react';
import { Lock } from 'lucide-react';

const LockedBadge: React.FC = () => {
    return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border border-red-200 text-red-600 bg-red-50" title="Record Locked">
            <Lock className="w-3 h-3 mr-1" />
            Record Locked
        </span>
    );
};

export default LockedBadge;
