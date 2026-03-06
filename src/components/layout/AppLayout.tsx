import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';

export const AppLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
            <TopNav />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <Outlet />
            </main>
        </div>
    );
};
