import React from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

export const ChangelogPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden relative transition-colors duration-300">
            <Navigation />

            <main className="pt-32 pb-20">
                <div className="max-w-3xl mx-auto px-6 mt-12 animate-fade-up">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white">
                        Product <span className="text-gradient">Changelog</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 mb-16 leading-relaxed">
                        Keep track of the newest features, improvements, and bug fixes added to the CAlite platform.
                    </p>

                    <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-800 before:to-transparent">
                        {/* Iteration 1 */}
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-blue-500/30 bg-white dark:bg-slate-900 text-blue-500 dark:text-blue-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                <div className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card bg-white/80 dark:bg-slate-900/40 p-6 border-slate-200 dark:border-slate-800/50 rounded-2xl shadow-sm dark:shadow-none">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="font-bold text-blue-600 dark:text-blue-400">v1.0.0</div>
                                    <div className="text-sm text-slate-500 dark:text-slate-500">March 03, 2026</div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Initial Release & Premium Redesign</h3>
                                <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
                                    <li>Complete platform redesign with Glassmorphism and dark mode aesthetics.</li>
                                    <li>Integration of robust Shadcn UI form components.</li>
                                    <li>Automated deadline tracking engine initialized.</li>
                                    <li>Bank-grade security schemas applied to database interactions.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
