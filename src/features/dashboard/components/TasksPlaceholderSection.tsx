import { StatCard } from './StatCard';

export const TasksPlaceholderSection = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <StatCard
                title="Pending Tasks"
                value={null}
                isPlaceholder={true}
            />
            <StatCard
                title="Completed Tasks (30d)"
                value={null}
                isPlaceholder={true}
            />
        </div>
    );
};
