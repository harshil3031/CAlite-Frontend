import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const Navigation: React.FC = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path 
            ? 'text-blue-400' 
            : 'text-slate-400 hover:text-white transition-colors';
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center">
                    <img 
                        src="/brand/logo-rectangle-200-header:navbar.png" 
                        alt="CAlite Logo" 
                        className="h-10 w-auto"
                    />
                </Link>

                <div className="hidden md:flex items-center gap-8 font-medium">
                    <Link to="/" className={isActive('/')}>Home</Link>
                    <Link to="/about" className={isActive('/about')}>About Us</Link>
                    <Link to="/features" className={isActive('/features')}>Features</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Button 
                        asChild
                        variant="outline" 
                        size="sm"
                        className="border-white/10 text-white hover:bg-white/5"
                    >
                        <Link to="/login">Log In</Link>
                    </Button>
                    <Button 
                        asChild
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30"
                    >
                        <Link to="/register">Get Started</Link>
                    </Button>
                </div>
            </div>
        </nav>
    );
};
