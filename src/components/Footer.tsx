import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="relative border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 pt-16 pb-8 overflow-hidden z-20 transition-colors duration-300">
            {/* Background glow for footer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <img src="/brand/logo-rectangle-200-header:navbar.png" alt="CAlite Logo" className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity dark:invert-0" />
                        </Link>
                        <p className="text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
                            Empowering Chartered Accountants with modern tools to automate compliance, streamline document processing, and drive practice growth.
                        </p>
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium pt-2">
                            <ShieldCheck className="w-5 h-5" />
                            <span>Bank-Grade Security</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-slate-900 dark:text-white font-semibold mb-6">Product</h4>
                        <ul className="space-y-3">
                            <li><Link to="/features" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</Link></li>
                            <li><Link to="/pricing" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</Link></li>
                            <li><Link to="/security" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Security</Link></li>
                            <li><Link to="/changelog" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Changelog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-slate-900 dark:text-white font-semibold mb-6">Company</h4>
                        <ul className="space-y-3">
                            <li><Link to="/about" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link></li>
                            <li><Link to="/privacy" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-500">
                    <p>&copy; {new Date().getFullYear()} CAlite. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <span className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors cursor-pointer">Twitter</span>
                        <span className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors cursor-pointer">LinkedIn</span>
                        <span className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors cursor-pointer">YouTube</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
