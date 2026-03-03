import React from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

export const PrivacyPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden relative transition-colors duration-300">
            <Navigation />

            <main className="pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-6 mt-12 animate-fade-up">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-8 text-slate-900 dark:text-white">
                        Privacy <span className="text-gradient">Policy</span>
                    </h1>

                    <div className="glass-card bg-white/80 dark:bg-slate-900/40 p-8 border-slate-200 dark:border-slate-800/50 rounded-2xl space-y-8 text-slate-600 dark:text-slate-300 shadow-sm dark:shadow-none">
                        <p className="text-lg">Last Updated: March 2026</p>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Information We Collect</h2>
                            <p className="mb-4">When you use CAlite, we collect several types of information from and about users, including information:</p>
                            <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-400">
                                <li>By which you may be personally identified, such as name, firm affiliation, e-mail address, and telephone number.</li>
                                <li>That is about you but individually does not identify you, such as anonymous usage data.</li>
                                <li>About your internet connection, the equipment you use to access our Platform, and usage details.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Client Data</h2>
                            <p className="mb-4">As an accounting platform, you will input your clients' sensitive financial data. We act as a data processor for this information. We do not sell, rent, or lease this data to third parties. It is strictly used to provide out services to you as outlined in our Terms of Service.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Security Measures</h2>
                            <p className="mb-4">We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on our secure servers behind firewalls using encryption.</p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
