import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ModeToggle } from './mode-toggle';

export const Navigation: React.FC = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path
            ? 'text-blue-500 dark:text-blue-400'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors';
    };

    return (
        <nav className="glass-nav border-slate-200 dark:border-white/10 w-full fixed top-0 z-50 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center">
                    <img
                        src="/brand/logo-rectangle-200-header:navbar.png"
                        alt="CAlite Logo"
                        className="h-10 w-auto object-contain dark:invert-0"
                    />
                </Link>

                <div className="hidden md:flex items-center gap-8 font-medium">
                    <Link to="/" className={isActive('/')}>Home</Link>
                    <Link to="/features" className={isActive('/features')}>Features</Link>
                    <Link to="/pricing" className={isActive('/pricing')}>Pricing</Link>
                    <Link to="/about" className={isActive('/about')}>About Us</Link>
                </div>

                <div className="flex items-center gap-4">
                    <ModeToggle />

                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="btn-secondary text-sm border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <Link to="/login">Log In</Link>
                    </Button>
                    <Button
                        asChild
                        size="sm"
                        className="btn-primary text-sm shadow-xl shadow-blue-500/20"
                    >
                        <Link to="/register">Get Started</Link>
                    </Button>
                </div>
            </div>
        </nav>
    );
};
