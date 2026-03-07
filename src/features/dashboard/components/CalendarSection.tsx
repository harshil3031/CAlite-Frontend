import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useDashboardCalendar } from '../hooks/useDashboard';

const CalendarSection: React.FC = () => {
    const [view, setView] = useState<'weekly' | 'monthly'>('weekly');
    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });

    const { data, isLoading } = useDashboardCalendar(view, date);

    const handlePrev = () => {
        const d = new Date(date);
        if (view === 'weekly') {
            d.setDate(d.getDate() - 7);
        } else {
            d.setMonth(d.getMonth() - 1);
        }
        setDate(d.toISOString().split('T')[0]);
    };

    const handleNext = () => {
        const d = new Date(date);
        if (view === 'weekly') {
            d.setDate(d.getDate() + 7);
        } else {
            d.setMonth(d.getMonth() + 1);
        }
        setDate(d.toISOString().split('T')[0]);
    };

    const getRiskColor = (level: string) => {
        switch (level?.toLowerCase()) {
            case 'critical': return 'bg-black text-white';
            case 'red': return 'bg-red-600 text-white';
            case 'yellow': return 'bg-amber-400 text-black';
            case 'green': return 'bg-green-600 text-white';
            default: return 'bg-gray-200 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-indigo-500" />
                        Compliance Calendar
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-slate-100 p-1 flex items-center rounded-lg border border-slate-200">
                        <button
                            onClick={() => setView('weekly')}
                            className={`px-3 py-1 text-sm font-medium rounded-md ${view === 'weekly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}`}
                        >
                            Weekly
                        </button>
                        <button
                            onClick={() => setView('monthly')}
                            className={`px-3 py-1 text-sm font-medium rounded-md ${view === 'monthly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}`}
                        >
                            Monthly
                        </button>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
                        <button onClick={handlePrev} className="p-1 hover:bg-slate-200 rounded text-slate-600">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium px-2 text-slate-800 min-w-[120px] text-center">
                            {new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={handleNext} className="p-1 hover:bg-slate-200 rounded text-slate-600">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6 min-h-[300px]">
                {isLoading ? (
                    <div className="flex flex-col gap-4 animate-pulse">
                        <div className="h-10 bg-slate-100 rounded"></div>
                        <div className="h-40 bg-slate-50 rounded"></div>
                    </div>
                ) : view === 'weekly' ? (
                    <div className="grid grid-cols-7 gap-4">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                            // To accurately match dates to days, we should look at data or generate date headers
                            const columnDate = new Date(data?.start_date || date);
                            columnDate.setDate(columnDate.getDate() + i);
                            const dateStr = columnDate.toISOString().split('T')[0];
                            const dayItems = data?.items?.[dateStr] || [];

                            return (
                                <div key={day} className="flex flex-col border border-slate-100 rounded-lg overflow-hidden h-64 bg-slate-50">
                                    <div className="bg-slate-100 p-2 text-center border-b border-slate-200">
                                        <p className="text-xs font-bold text-slate-500 uppercase">{day}</p>
                                        <p className="text-sm font-bold text-slate-800">{columnDate.getDate()}</p>
                                    </div>
                                    <div className="p-2 space-y-2 overflow-y-auto flex-1">
                                        {dayItems.map((item: any) => (
                                            <div key={item.id} className={`p-2 rounded text-[10px] leading-snug shadow-sm ${getRiskColor(item.risk_level)}`}>
                                                <p className="font-bold truncate">{item.client_name}</p>
                                                <p className="opacity-90 truncate">{item.template_name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="grid grid-cols-7 gap-2">
                        {/* Monthly grid rendering: this requires computing the month grid. 
                 For simplicity, we just list the dates returned in the calendar data. */}
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                            <div key={d} className="text-center text-xs font-bold text-slate-500 py-2">{d}</div>
                        ))}
                        {data?.grid?.map((dayObj: any, idx: number) => {
                            const isCurrentMonth = dayObj.is_current_month;
                            const dayItems = data?.items?.[dayObj.date] || [];

                            return (
                                <div key={idx} className={`border rounded-lg h-24 p-1 overflow-hidden flex flex-col ${isCurrentMonth ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 opacity-50 border-slate-100'}`}>
                                    <div className="text-right p-1 pb-0">
                                        <span className={`text-xs font-bold ${isCurrentMonth ? 'text-slate-800' : 'text-slate-400'}`}>
                                            {new Date(dayObj.date).getDate()}
                                        </span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto space-y-1 p-1">
                                        {dayItems.slice(0, 3).map((item: any) => (
                                            <div key={item.id} className={`px-1 py-0.5 rounded text-[9px] truncate ${getRiskColor(item.risk_level)}`} title={`${item.client_name} - ${item.template_name}`}>
                                                • {item.template_short || item.template_name}
                                            </div>
                                        ))}
                                        {dayItems.length > 3 && (
                                            <div className="text-[10px] text-slate-400 font-medium text-center hover:text-indigo-600 cursor-pointer">
                                                +{dayItems.length - 3} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarSection;
