import React from 'react';
import { Navigation } from '../components/Navigation';
import { Target, Users, Code, PenTool, Lightbulb, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AboutUsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
            {/* Animated background blobs */}
            <div className="absolute top-[-10%] left-[50%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[80px] animate-float -z-10" />
            <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] bg-blue-600/25 rounded-full blur-[80px] animate-float -z-10" style={{ animationDelay: '-5s' }} />

            <Navigation />

            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-6 text-center mt-16 animate-fade-up">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Our <span className="text-gradient-alt">Mission</span>
                    </h1>
                    <p className="text-xl text-slate-300 mb-16 max-w-3xl mx-auto leading-relaxed">
                        We built CAlite because we believed that compliance professionals deserved
                        the same level of modern, intuitive, and beautiful software that exists
                        in other industries. No more clunky, outdated spreadsheets.
                        Just pure focus on what matters most.
                    </p>
                </div>

                {/* Values Grid */}
                <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
                    <Card 
                        className="bg-slate-900 border-slate-800 border-t-2 border-t-purple-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 animate-fade-up"
                        style={{ animationDelay: '100ms' }}
                    >
                        <CardHeader>
                            <Compass className="w-8 h-8 text-purple-400 mb-2" />
                            <CardTitle className="text-white">Visionary</CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-400 text-sm">
                            We anticipate the future of accounting software, constantly pushing boundaries and setting new industry standards.
                        </CardContent>
                    </Card>

                    <Card 
                        className="bg-slate-900 border-slate-800 border-t-2 border-t-blue-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 animate-fade-up"
                        style={{ animationDelay: '200ms' }}
                    >
                        <CardHeader>
                            <Target className="w-8 h-8 text-blue-400 mb-2" />
                            <CardTitle className="text-white">Precision</CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-400 text-sm">
                            In the compliance world, every number counts. Our tools are engineered with zero tolerance for data errors.
                        </CardContent>
                    </Card>

                    <Card 
                        className="bg-slate-900 border-slate-800 border-t-2 border-t-emerald-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 animate-fade-up"
                        style={{ animationDelay: '300ms' }}
                    >
                        <CardHeader>
                            <Users className="w-8 h-8 text-emerald-400 mb-2" />
                            <CardTitle className="text-white">User-Centric</CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-400 text-sm">
                            Every feature is designed by actively listening to practicing Chartered Accountants and adapting to their workflow.
                        </CardContent>
                    </Card>

                    <Card 
                        className="bg-slate-900 border-slate-800 border-t-2 border-t-yellow-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-yellow-500/20 transition-all duration-300 animate-fade-up"
                        style={{ animationDelay: '100ms' }}
                    >
                        <CardHeader>
                            <Lightbulb className="w-8 h-8 text-yellow-500 mb-2" />
                            <CardTitle className="text-white">Innovation</CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-400 text-sm">
                            We harness the power of modern web technologies to automate manual bookkeeping steps.
                        </CardContent>
                    </Card>

                    <Card 
                        className="bg-slate-900 border-slate-800 border-t-2 border-t-pink-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 animate-fade-up"
                        style={{ animationDelay: '200ms' }}
                    >
                        <CardHeader>
                            <PenTool className="w-8 h-8 text-pink-400 mb-2" />
                            <CardTitle className="text-white">Craftsmanship</CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-400 text-sm">
                            Aesthetic excellence. The interface should feel like premium, crafted software at your fingertips.
                        </CardContent>
                    </Card>

                    <Card 
                        className="bg-slate-900 border-slate-800 border-t-2 border-t-indigo-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 animate-fade-up"
                        style={{ animationDelay: '300ms' }}
                    >
                        <CardHeader>
                            <Code className="w-8 h-8 text-indigo-400 mb-2" />
                            <CardTitle className="text-white">Open Architecture</CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-400 text-sm">
                            Built robustly utilizing REST APIs, allowing integrations with third-party invoicing securely.
                        </CardContent>
                    </Card>
                </section>

                {/* Founders / Team Note */}
                <div className="max-w-7xl mx-auto px-6 mt-32 text-center animate-fade-up relative z-10 p-12 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
                    <h2 className="text-3xl font-bold mb-6 text-gradient">Join the CAlite Network</h2>
                    <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                        Whether you're an independent practitioner or a large firm, CAlite scales with your ambitions.
                        Stop letting clunky software hold back your professional growth.
                    </p>
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30">
                        Speak with our Team
                    </Button>
                </div>
            </main>

            <footer className="border-t border-slate-800 py-10 bg-slate-950 relative z-10 text-center text-slate-500 text-sm">
                <p>&copy; {new Date().getFullYear()} CAlite. All rights reserved.</p>
            </footer>
        </div>
    );
};
