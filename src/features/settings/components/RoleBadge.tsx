interface RoleBadgeProps {
    role: 'admin' | 'staff' | 'client';
}

const roleConfig = {
    admin: {
        label: 'Admin',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-200',
    },
    staff: {
        label: 'Staff',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        borderColor: 'border-gray-200',
    },
    client: {
        label: 'Client',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
    },
};

export default function RoleBadge({ role }: RoleBadgeProps) {
    const config = roleConfig[role];

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
        >
            {config.label}
        </span>
    );
}
