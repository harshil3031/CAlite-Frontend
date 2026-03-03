import React from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { ShieldCheck, Zap, BarChart3, Database, Users, FileText, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const FeaturesPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden relative transition-colors duration-300">
            {/* Animated background blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[100px] animate-float -z-10" />
            <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[100px] animate-float -z-10" style={{ animationDelay: '-5s' }} />

            <Navigation />

            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-6 text-center mt-12 animate-fade-up">
                    <div className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-medium text-sm mb-6">
                        Powerful Capabilities
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900 dark:text-white">
                        Everything you need to <br />
                        <span className="text-gradient">scale your CA firm</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 mb-16 max-w-2xl mx-auto leading-relaxed">
                        CAlite provides a comprehensive suite of tools designed specifically for modern accounting professionals to automate workflows and manage clients efficiently.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <Card className="glass-card bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/50 hover:border-blue-400 dark:hover:border-blue-500/30 transition-all duration-300 animate-fade-up" style={{ animationDelay: '100ms' }}>
                        <CardHeader>
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 border border-blue-500/20">
                                <FileText className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                            </div>
                            <CardTitle className="text-xl text-slate-900 dark:text-white">Automated Document Parsing</CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-600 dark:text-slate-400">
                            Upload bank statements, invoices, and receipts in bulk. Our intelligent OCR extracts data accurately in seconds, eliminating manual data entry completely.
                        </CardContent>
                    </Card>

                    {/* Feature 2 */}
                    <Card className="glass-card bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/50 hover:border-emerald-400 dark:hover:border-emerald-500/30 transition-all duration-300 animate-fade-up" style={{ animationDelay: '200ms' }}>
                        <CardHeader>
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/20">
                                <Database className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                            </div>
                            <CardTitle className="text-xl text-slate-900 dark:text-white">Centralized Client Hub</CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-600 dark:text-slate-400">
                            Manage all your clients from a single, organized dashboard. Track their compliance status, pending documents, and historical filings with ease.
                        </CardContent>
                    </Card>

                    {/* Feature 3 */}
                    <Card className="glass-card bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/50 hover:border-purple-400 dark:hover:border-purple-500/30 transition-all duration-300 animate-fade-up" style={{ animationDelay: '300ms' }}>
                        <CardHeader>
                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 border border-purple-500/20">
                                <BarChart3 className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                            </div>
                            <CardTitle className="text-xl text-slate-900 dark:text-white">Advanced Analytics & Reporting</CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-600 dark:text-slate-400">
                            Generate visual insights into your firm's performance. Monitor billable limits, team productivity, and revenue growth with real-time dashboards.
                        </CardContent>
                    </Card>

                    {/* Feature 4 */}
                    <Card className="glass-card bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/50 hover:border-yellow-400 dark:hover:border-yellow-500/30 transition-all duration-300 animate-fade-up" style={{ animationDelay: '400ms' }}>
                        <CardHeader>
                            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-4 border border-yellow-500/20">
                                <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
                            </div>
                            <CardTitle className="text-xl text-slate-900 dark:text-white">Smart Deadline Tracking</CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-600 dark:text-slate-400">
                            Never miss a statutory deadline again. Get automated alerts for GST, Income Tax, and ROC filings via email and dashboard notifications.
                        </CardContent>
                    </Card>

                    {/* Feature 5 */}
                    <Card className="glass-card bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/50 hover:border-pink-400 dark:hover:border-pink-500/30 transition-all duration-300 animate-fade-up" style={{ animationDelay: '500ms' }}>
                        <CardHeader>
                            <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-4 border border-pink-500/20">
                                <ShieldCheck className="w-6 h-6 text-pink-500 dark:text-pink-400" />
                            </div>
                            <CardTitle className="text-xl text-slate-900 dark:text-white">Bank-Grade Security</CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-600 dark:text-slate-400">
                            Your clients' data is protected with 256-bit AES encryption. Role-based access control ensures only authorized staff can view sensitive information.
                        </CardContent>
                    </Card>

                    {/* Feature 6 */}
                    <Card className="glass-card bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/50 hover:border-indigo-400 dark:hover:border-indigo-500/30 transition-all duration-300 animate-fade-up" style={{ animationDelay: '600ms' }}>
                        <CardHeader>
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/20">
                                <Users className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                            </div>
                            <CardTitle className="text-xl text-slate-900 dark:text-white">Team Collaboration</CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-600 dark:text-slate-400">
                            Assign tasks, communicate internally, and track the progress of every assignment. Keep your team aligned and productive, regardless of their location.
                        </CardContent>
                    </Card>
                </div>

                {/* Integration Section */}
                <div className="max-w-7xl mx-auto px-6 mt-32 relative z-10 p-12 glass-card bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/50 shadow-2xl animate-fade-up">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Integrates perfectly with your current stack</h2>
                            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
                                CAlite plays nice with the tools you already use. Import data seamlessly and keep your workflows connected without disruption.
                            </p>
                            <ul className="space-y-4 text-slate-700 dark:text-slate-300">
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                                    Tally Prime & ERP9 Integration
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                                    Direct Government Portal Sync
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                                    Cloud Storage Connectors (Drive, Dropbox)
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 flex justify-center">
                            <div className="relative w-full max-w-sm aspect-square">
                                {/* Dummy placeholder for integration graphic */}
                                <div className="absolute inset-0 border-2 border-dashed border-blue-400/60 dark:border-slate-700 rounded-full animate-spin-slow flex items-center justify-center"></div>
                                <div className="absolute inset-4 border-2 border-dashed border-emerald-400/60 dark:border-blue-500/30 rounded-full animate-spin-reverse-slow"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <img src="/brand/logo-icon-text.png" alt="CAlite" className="w-32 h-32 object-contain" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
