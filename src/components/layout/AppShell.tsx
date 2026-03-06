import { Outlet } from 'react-router-dom';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { TrialBanner } from './TrialBanner';

export const AppShell = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-[Inter]">
            {/* Trial Banner above topbar */}
            <div className="fixed top-0 left-0 right-0 z-[60]" id="trial-banner-container">
                <TrialBanner />
            </div>

            {/* Topbar — offset by trial banner height via CSS var trick; simpler: just let it sit below */}
            <div id="app-topbar">
                <Topbar />
            </div>

            {/* Sidebar + Content */}
            <div className="flex pt-16">
                <Sidebar />

                {/* Scrollable content area */}
                <main
                    id="app-content"
                    className="flex-1 ml-64 min-h-[calc(100vh-4rem)] bg-slate-50 p-6 overflow-auto"
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
