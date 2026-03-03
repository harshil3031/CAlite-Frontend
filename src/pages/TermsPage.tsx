import React from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

export const TermsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden relative transition-colors duration-300">
            <Navigation />

            <main className="pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-6 mt-12 animate-fade-up">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-8 text-slate-900 dark:text-white">
                        Terms of <span className="text-gradient">Service</span>
                    </h1>

                    <div className="glass-card bg-white/80 dark:bg-slate-900/40 p-8 border-slate-200 dark:border-slate-800/50 rounded-2xl space-y-8 text-slate-600 dark:text-slate-300 shadow-sm dark:shadow-none">
                        <p className="text-lg">Last Updated: March 2026</p>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                            <p className="mb-4">By accessing or using the CAlite platform, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service. These terms constitute a legally binding agreement.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. License to Use</h2>
                            <p className="mb-4">Subject to these Terms, we grant you a non-transferable, non-exclusive, revocable, limited license to use and access the Site solely for your own personal or business compliance administration.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. User Responsibilities</h2>
                            <p className="mb-4">You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or device. You agree to accept responsibility for all activities that occur under your account or password. CAlite holds no liability for penalties incurred due to user input error or missed deadlines resulting from improper use of the software.</p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
