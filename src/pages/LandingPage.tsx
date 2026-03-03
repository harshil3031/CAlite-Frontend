import React from 'react';
import { Navigation } from '../components/Navigation';
import { ArrowRight, ShieldCheck, Zap, BarChart3, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
            {/* Animated background blobs */}
            <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-600/25 rounded-full blur-[80px] animate-float -z-10" />
            <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[80px] animate-float -z-10" style={{ animationDelay: '-5s' }} />

            <Navigation />

            <main className="pt-32 pb-20">
                {/* HERO */}
                <div className="max-w-4xl mx-auto px-6 text-center mt-12 animate-fade-up">
                    <div className="inline-block py-1 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium text-sm mb-6">
                        Built for Chartered Accountants
                    </div>

                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                        Cut Compliance Time by 40% — <br />
                        <span className="text-gradient">Without Hiring More Staff</span>
                    </h1>

                    <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Automate audits, track deadlines, and manage clients in one secure workspace.
                        Stop juggling Excel sheets and never miss a filing again.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/30">
                            Start Free Trial – No Credit Card
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>

                        <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5">
                            Watch 2-Min Demo
                        </Button>
                    </div>

                    <p className="text-slate-500 text-sm mt-6">
                        Setup in under 5 minutes • Cancel anytime
                    </p>
                </div>

                {/* PRODUCT PREVIEW */}
                <div className="max-w-7xl mx-auto px-6 mt-20">
                    <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                        <img
                            src="/dashboard-preview.png"
                            alt="CAlite Dashboard Preview"
                            className="w-full"
                        />
                    </div>
                </div>

                {/* FEATURES */}
                <div className="max-w-7xl mx-auto px-6 mt-32 grid md:grid-cols-3 gap-10">
                    <Card 
                        className="bg-slate-900 border-slate-800 hover:border-blue-500/30 transition-all duration-300 animate-fade-up"
                        style={{ animationDelay: '100ms' }}
                    >
                        <CardHeader>
                            <Zap className="w-8 h-8 text-blue-400 mb-4" />
                            <CardTitle className="text-white">Process 500+ Documents in Seconds</CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-400">
                            Upload bulk files and auto-generate compliance reports instantly.
                            Reduce manual effort and increase turnaround speed.
                        </CardContent>
                    </Card>

                    <Card 
                        className="bg-slate-900 border-slate-800 hover:border-emerald-500/30 transition-all duration-300 animate-fade-up"
                        style={{ animationDelay: '200ms' }}
                    >
                        <CardHeader>
                            <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4" />
                            <CardTitle className="text-white">Enterprise-Level Security</CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-400">
                            AES-256 encryption, role-based access, and secure cloud storage
                            to protect sensitive client data.
                        </CardContent>
                    </Card>

                    <Card 
                        className="bg-slate-900 border-slate-800 hover:border-purple-500/30 transition-all duration-300 animate-fade-up"
                        style={{ animationDelay: '300ms' }}
                    >
                        <CardHeader>
                            <BarChart3 className="w-8 h-8 text-purple-400 mb-4" />
                            <CardTitle className="text-white">Real-Time Firm Analytics</CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-400">
                            Track billable hours, overdue filings, and revenue insights
                            from one intuitive dashboard.
                        </CardContent>
                    </Card>
                </div>

                {/* PROBLEM VS SOLUTION */}
                <section className="max-w-7xl mx-auto px-6 mt-32">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                        Still Managing Compliance in Excel?
                    </h2>

                    <div className="grid md:grid-cols-2 gap-10">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-red-400">The Old Way</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4 text-slate-400">
                                    <li>• Manual deadline tracking</li>
                                    <li>• Scattered client documents</li>
                                    <li>• Risk of missed filings</li>
                                    <li>• No performance visibility</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-emerald-400">With CAlite</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4 text-slate-300">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                                        Automated deadline alerts
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                                        Centralized secure dashboard
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                                        Zero missed compliance filings
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                                        Real-time team performance tracking
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* STATS */}
                <section className="mt-32 py-20 border-t border-slate-800 bg-slate-900/40">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-around items-center gap-12 text-center">
                        <div>
                            <h4 className="text-5xl font-extrabold text-emerald-400 mb-2">
                                99.9%
                            </h4>
                            <p className="text-slate-400">Uptime Guarantee</p>
                        </div>

                        <div>
                            <h4 className="text-5xl font-extrabold text-blue-400 mb-2 flex items-center justify-center gap-3">
                                <Users className="w-10 h-10" />
                                5k+
                            </h4>
                            <p className="text-slate-400">Active CA Professionals</p>
                        </div>

                        <div>
                            <h4 className="text-5xl font-extrabold text-purple-400 mb-2">
                                Zero
                            </h4>
                            <p className="text-slate-400">Data Breaches</p>
                        </div>
                    </div>
                </section>

                {/* FINAL CTA */}
                <section className="max-w-7xl mx-auto px-6 text-center mt-32 mb-20">
                    <h2 className="text-4xl font-bold mb-6">
                        Ready to Modernize Your CA Firm?
                    </h2>

                    <p className="text-slate-400 mb-8">
                        Join thousands of professionals who've streamlined compliance and scaled operations.
                    </p>

                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/30">
                        Start Free Trial
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </section>
            </main>

            <footer className="border-t border-slate-800 py-10 bg-slate-950 text-center text-slate-500 text-sm">
                <p>&copy; {new Date().getFullYear()} CAlite. All rights reserved.</p>
            </footer>
        </div>
    );
};
