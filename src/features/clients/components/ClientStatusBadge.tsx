// Simple active/inactive status pill

interface ClientStatusBadgeProps {
    isActive: boolean;
}

export const ClientStatusBadge = ({ isActive }: ClientStatusBadgeProps) => (
    <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${isActive
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-600'
            }`}
    >
        {isActive ? 'Active' : 'Inactive'}
    </span>
);
