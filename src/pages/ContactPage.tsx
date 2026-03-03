import React from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const ContactPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden relative transition-colors duration-300">
            <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[100px] animate-float -z-10" />

            <Navigation />

            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 mt-12 animate-fade-up">
                    <div>
                        <h1 className="text-5xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white">
                            Let's Talk <span className="text-gradient">CAlite</span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                            Have questions about pricing, features, or how our software can scale your specific practice setup? Our team is ready to help.
                        </p>

                        <div className="space-y-6">
                            <div className="glass-card bg-white/80 dark:bg-slate-900/40 p-6 border-slate-200 dark:border-slate-800/50 shadow-sm dark:shadow-none">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Support</h3>
                                <p className="text-slate-600 dark:text-slate-400">support@calite.com</p>
                            </div>
                            <div className="glass-card bg-white/80 dark:bg-slate-900/40 p-6 border-slate-200 dark:border-slate-800/50 shadow-sm dark:shadow-none">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Sales</h3>
                                <p className="text-slate-600 dark:text-slate-400">sales@calite.com</p>
                            </div>
                            <div className="glass-card bg-white/80 dark:bg-slate-900/40 p-6 border-slate-200 dark:border-slate-800/50 shadow-sm dark:shadow-none">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Office</h3>
                                <p className="text-slate-600 dark:text-slate-400">Mumbai, Maharashtra, India</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card bg-white/80 dark:bg-slate-900/60 p-8 border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl rounded-2xl relative z-10">
                        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Send us a message</h2>
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                                <Input className="bg-slate-50 dark:bg-slate-900/50 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white h-12" placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                                <Input type="email" className="bg-slate-50 dark:bg-slate-900/50 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white h-12" placeholder="john@firm.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
                                <textarea className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-white/10 rounded-md p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[120px]" placeholder="How can we help?" />
                            </div>
                            <Button className="w-full btn-primary h-12 text-base mt-4 shadow-lg shadow-blue-500/30">
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
