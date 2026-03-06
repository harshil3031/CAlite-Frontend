import { useLocation, Link, useParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

// Static route → label map
const ROUTE_LABELS: Record<string, string> = {
    dashboard: 'Dashboard',
    clients: 'Clients',
    settings: 'Settings',
    staff: 'Staff',
    compliance: 'Compliance',
    tasks: 'Tasks',
    documents: 'Documents',
    billing: 'Billing',
};

interface CrumbItem {
    label: string;
    to: string | null;
}

export const Breadcrumb = () => {
    const location = useLocation();
    const { id } = useParams<{ id?: string }>();

    const segments = location.pathname.split('/').filter(Boolean);

    const crumbs: CrumbItem[] = segments.map((seg, idx) => {
        const path = '/' + segments.slice(0, idx + 1).join('/');
        // If segment is a UUID/ID, use a short label
        const isId = /^[0-9a-f-]{8,}$/i.test(seg) || (!ROUTE_LABELS[seg] && idx > 0);
        const label = isId ? (id ? `#${id.slice(0, 8)}` : 'Detail') : (ROUTE_LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1));
        return { label, to: idx < segments.length - 1 ? path : null };
    });

    return (
        <nav className="flex items-center gap-1.5 text-sm text-slate-500" aria-label="Breadcrumb">
            <Link to="/dashboard" className="flex items-center text-slate-400 hover:text-indigo-600 transition-colors">
                <Home className="w-4 h-4" />
            </Link>
            {crumbs.map((crumb, idx) => (
                <span key={idx} className="flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    {crumb.to ? (
                        <Link to={crumb.to} className="hover:text-indigo-600 transition-colors">
                            {crumb.label}
                        </Link>
                    ) : (
                        <span className="text-slate-800 font-medium">{crumb.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
};
