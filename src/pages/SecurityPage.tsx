import React from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Shield, Lock, Server, FileCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const SecurityPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden relative transition-colors duration-300">
            {/* Animated background blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px] animate-float -z-10" />

            <Navigation />

            <main className="pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-6 text-center mt-12 animate-fade-up">
                    <Shield className="w-16 h-16 text-emerald-500 dark:text-emerald-400 mx-auto mb-6" />
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white">
                        Enterprise-Grade <span className="text-gradient">Security</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 mb-16 leading-relaxed">
                        We understand that Chartered Accountants handle the most sensitive financial data. Our infrastructure is built from the ground up to protect your clients' privacy.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
                    <Card className="glass-card bg-white/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/50 hover:border-emerald-400 dark:hover:border-emerald-500/30 transition-all duration-300 animate-fade-up border-t-2 border-t-emerald-400 dark:border-t-emerald-500 shadow-xl shadow-emerald-500/5 dark:shadow-none" style={{ animationDelay: '100ms' }}>
                        <CardHeader>
                            <Lock className="w-8 h-8 text-emerald-500 dark:text-emerald-400 mb-4" />
                            <CardTitle className="text-2xl text-slate-900 dark:text-white">Data Encryption</CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-600 dark:text-slate-400">
                            All data is encrypted both in transit (using TLS 1.3) and at rest (using AES-256). We never store plaintext passwords, utilizing strict hashing protocols (bcrypt/Argon2).
                        </CardContent>
                    </Card>

                    <Card className="glass-card bg-white/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/50 hover:border-blue-400 dark:hover:border-blue-500/30 transition-all duration-300 animate-fade-up border-t-2 border-t-blue-400 dark:border-t-blue-500 shadow-xl shadow-blue-500/5 dark:shadow-none" style={{ animationDelay: '200ms' }}>
                        <CardHeader>
                            <Server className="w-8 h-8 text-blue-500 dark:text-blue-400 mb-4" />
                            <CardTitle className="text-2xl text-slate-900 dark:text-white">Secure Infrastructure</CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-600 dark:text-slate-400">
                            Hosted on tightly controlled VPCs within SOC 2 Type II certified data centers. Our infrastructure utilizes robust WAFs (Web Application Firewalls) and DDoS protection.
                        </CardContent>
                    </Card>

                    <Card className="glass-card bg-white/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/50 hover:border-purple-400 dark:hover:border-purple-500/30 transition-all duration-300 animate-fade-up border-t-2 border-t-purple-400 dark:border-t-purple-500 shadow-xl shadow-purple-500/5 dark:shadow-none" style={{ animationDelay: '300ms' }}>
                        <CardHeader>
                            <Shield className="w-8 h-8 text-purple-500 dark:text-purple-400 mb-4" />
                            <CardTitle className="text-2xl text-slate-900 dark:text-white">Access Control</CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-600 dark:text-slate-400">
                            Strict Role-Based Access Control (RBAC) ensures your team members only see what they need to. Support for Multi-Factor Authentication (MFA) across all accounts.
                        </CardContent>
                    </Card>

                    <Card className="glass-card bg-white/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/50 hover:border-pink-400 dark:hover:border-pink-500/30 transition-all duration-300 animate-fade-up border-t-2 border-t-pink-400 dark:border-t-pink-500 shadow-xl shadow-pink-500/5 dark:shadow-none" style={{ animationDelay: '400ms' }}>
                        <CardHeader>
                            <FileCheck className="w-8 h-8 text-pink-500 dark:text-pink-400 mb-4" />
                            <CardTitle className="text-2xl text-slate-900 dark:text-white">Compliance & Auditing</CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-600 dark:text-slate-400">
                            Comprehensive audit logs record every action taken within the platform. Regular third-party penetration testing and vulnerability scanning guarantee continuous protection.
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
};
