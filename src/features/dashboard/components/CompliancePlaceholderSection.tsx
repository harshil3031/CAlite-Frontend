import { StatCard } from './StatCard';

export const CompliancePlaceholderSection = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
                title="Compliance Due This Week"
                value={null}
                isPlaceholder={true}
            />
            <StatCard
                title="Overdue Compliance"
                value={null}
                isPlaceholder={true}
            />
            <StatCard
                title="Risk Summary"
                value={null}
                isPlaceholder={true}
            />
        </div>
    );
};
