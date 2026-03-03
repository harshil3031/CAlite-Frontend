import React, { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

export const PricingPage: React.FC = () => {
    const [isAnnual, setIsAnnual] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden relative transition-colors duration-300">
            {/* Animated background blobs */}
            <div className="absolute top-[-10%] left-[50%] w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[100px] animate-float -z-10" />

            <Navigation />

            <main className="pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-6 text-center mt-12 animate-fade-up">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white">
                        Simple, <span className="text-gradient-alt">transparent pricing</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                        No hidden fees. No surprise charges. Choose the plan that best fits the size and needs of your practice.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-3 mb-16">
                        <span className={`text-sm font-medium ${!isAnnual ? 'text-blue-500' : 'text-slate-500'}`}>Monthly</span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="relative w-14 h-7 rounded-full bg-slate-300 dark:bg-slate-700 p-1 transition-colors focus:outline-none"
                        >
                            <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${isAnnual ? 'translate-x-7' : 'translate-x-0'}`} />
                        </button>
                        <span className={`text-sm font-medium flex items-center gap-2 ${isAnnual ? 'text-blue-500' : 'text-slate-500'}`}>
                            Annually
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs shadow-sm">Save 20%</span>
                        </span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Starter Plan */}
                    <Card className="glass-card bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/50 hover:border-slate-400 dark:hover:border-slate-700 transition-all duration-300 animate-fade-up flex flex-col" style={{ animationDelay: '100ms' }}>
                        <CardHeader>
                            <CardTitle className="text-2xl text-slate-900 dark:text-white mb-2">Starter</CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400">Perfect for independent practitioners.</CardDescription>
                            <div className="mt-6">
                                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                                    {isAnnual ? '₹799' : '₹999'}
                                </span>
                                <span className="text-slate-500">/month</span>
                                {isAnnual && <div className="text-xs text-emerald-500 mt-1">Billed ₹9,590 yearly</div>}
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                                    <span><strong>50</strong> Clients</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                                    <span><strong>2</strong> Staff Members</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                                    <span><strong>5GB</strong> Secure Storage</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                                    Basic Deadline Tracking
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                                    100 Document Parses/month
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full btn-secondary text-base bg-slate-100 dark:bg-transparent border-slate-300 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:text-white" variant="ghost">Get Started</Button>
                        </CardFooter>
                    </Card>

                    {/* Professional Plan (Highlighted) */}
                    <Card className="glass-card bg-white/80 dark:bg-slate-900/60 border-blue-400 dark:border-blue-500/50 shadow-2xl shadow-blue-500/10 relative transform hover:-translate-y-2 transition-all duration-300 animate-fade-up flex flex-col" style={{ animationDelay: '200ms' }}>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-xs font-medium shadow-lg whitespace-nowrap">
                            Most Popular
                        </div>
                        <CardHeader>
                            <CardTitle className="text-2xl text-blue-600 dark:text-blue-400 mb-2">Professional</CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-300">Ideal for growing practices and small teams.</CardDescription>
                            <div className="mt-6">
                                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                                    {isAnnual ? '₹1,999' : '₹2,499'}
                                </span>
                                <span className="text-slate-500">/month</span>
                                {isAnnual && <div className="text-xs text-emerald-500 mt-1">Billed ₹23,990 yearly</div>}
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-slate-800 dark:text-slate-200 text-sm">
                                    <Check className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0" />
                                    <span><strong>200</strong> Clients</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-800 dark:text-slate-200 text-sm">
                                    <Check className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0" />
                                    <span><strong>10</strong> Staff Members</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-800 dark:text-slate-200 text-sm">
                                    <Check className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0" />
                                    <span><strong>20GB</strong> Secure Storage</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-800 dark:text-slate-200 text-sm">
                                    <Check className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0" />
                                    Unlimited Document Parsing
                                </li>
                                <li className="flex items-center gap-3 text-slate-800 dark:text-slate-200 text-sm">
                                    <Check className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0" />
                                    Basic SMS Reminders
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full btn-primary text-base shadow-lg shadow-blue-500/30">Start 14-Day Trial</Button>
                        </CardFooter>
                    </Card>

                    {/* Growth Plan */}
                    <Card className="glass-card bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/50 hover:border-slate-400 dark:hover:border-slate-700 transition-all duration-300 animate-fade-up flex flex-col" style={{ animationDelay: '300ms' }}>
                        <CardHeader>
                            <CardTitle className="text-2xl text-slate-900 dark:text-white mb-2">Growth</CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400">For established firms with larger teams.</CardDescription>
                            <div className="mt-6">
                                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                                    {isAnnual ? '₹3,999' : '₹4,999'}
                                </span>
                                <span className="text-slate-500">/month</span>
                                {isAnnual && <div className="text-xs text-emerald-500 mt-1">Billed ₹47,990 yearly</div>}
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                                    <Check className="w-5 h-5 text-purple-500 shrink-0" />
                                    <span><strong>750</strong> Clients</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                                    <Check className="w-5 h-5 text-purple-500 shrink-0" />
                                    <span><strong>25</strong> Staff Members</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                                    <Check className="w-5 h-5 text-purple-500 shrink-0" />
                                    <span><strong>50GB</strong> Secure Storage</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                                    <Check className="w-5 h-5 text-purple-500 shrink-0" />
                                    Advanced Custom Workflows
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                                    <Check className="w-5 h-5 text-purple-500 shrink-0" />
                                    Priority Chat Support
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full btn-secondary text-base bg-slate-100 dark:bg-transparent border-slate-300 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:text-white" variant="ghost">Get Started</Button>
                        </CardFooter>
                    </Card>

                    {/* Enterprise Plan */}
                    <Card className="glass-card bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/50 hover:border-slate-400 dark:hover:border-slate-700 transition-all duration-300 animate-fade-up flex flex-col" style={{ animationDelay: '400ms' }}>
                        <CardHeader>
                            <CardTitle className="text-2xl text-slate-900 dark:text-white mb-2">Enterprise</CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400">For scaled firms needing max capacity.</CardDescription>
                            <div className="mt-6">
                                <span className="text-4xl font-bold text-slate-900 dark:text-white">Custom</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                                    <Check className="w-5 h-5 text-slate-400 shrink-0" />
                                    Unlimited Clients & Users
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                                    <Check className="w-5 h-5 text-slate-400 shrink-0" />
                                    Custom API Integrations
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                                    <Check className="w-5 h-5 text-slate-400 shrink-0" />
                                    White-glove Migration
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                                    <Check className="w-5 h-5 text-slate-400 shrink-0" />
                                    Dedicated Account Manager
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full btn-secondary text-base bg-slate-100 dark:bg-transparent border-slate-300 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:text-white" variant="ghost">Contact Sales</Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* FAQ or Trust Section */}
                <div className="max-w-4xl mx-auto px-6 mt-32 text-center animate-fade-up border-t border-slate-200 dark:border-white/10 pt-16">
                    <h3 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white">Trusted by modern accounting practices across India</h3>
                    <div className="glass-card bg-white/80 dark:bg-slate-900/60 p-8 flex flex-col items-center justify-center border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl">
                        <p className="text-slate-600 dark:text-slate-400 mb-6 italic text-lg">
                            "Switching to CAlite cut our compliance processing time in half. The automated parsing alone paid for the Professional subscription in the first week."
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 font-bold overflow-hidden">
                                <img src="/brand/logo-icon-text.png" alt="" className="object-cover h-full opacity-60" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-slate-900 dark:text-white">Amit Sharma, FCA</p>
                                <p className="text-sm text-slate-500">Managing Partner, AS & Associates</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
