import { useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const SearchBar = ({ value, onChange, placeholder = 'Search by name or PAN…' }: SearchBarProps) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => onChange(val), 300);
    };

    useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

    return (
        <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
                type="text"
                defaultValue={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400"
            />
        </div>
    );
};
