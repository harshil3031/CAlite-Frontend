import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store';

export const TrialBanner = () => {
    const firm = useAppSelector((state) => state.auth.firm);
    const navigate = useNavigate();

    if (firm?.subscription_tier !== 'trial') return null;

    // Compute days remaining in IST (AD-09)
    const nowIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const endIST = firm.trial_ends_at
        ? new Date(new Date(firm.trial_ends_at).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
        : null;

    const diffTime = endIST ? endIST.getTime() - nowIST.getTime() : -1;
    const daysRemaining = endIST ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
    const isExpired = daysRemaining <= 0;
    const isCritical = daysRemaining <= 3;

    const bgClass = isExpired || isCritical ? 'bg-red-600' : 'bg-amber-500';
    const message = isExpired
        ? 'Your trial has expired. Upgrade to continue using CAlite.'
        : `Your trial expires in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}. Upgrade to continue after trial.`;

    return (
        <div className={`${bgClass} text-white text-xs font-medium px-4 py-2 flex items-center justify-center gap-4`}>
            <span>{message}</span>
            <button
                onClick={() => navigate('/settings')}
                className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1 rounded-full transition-colors"
            >
                Upgrade
            </button>
        </div>
    );
};
