import React from 'react';
import { Hash, Mail, Phone, Building2, User } from 'lucide-react';

interface ClientOverviewTabProps {
    client: any;
}

const ClientOverviewTab: React.FC<ClientOverviewTabProps> = ({ client }) => {
    return (
        <div className="space-y-6 animate-fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Core Identifiers */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Hash className="w-4 h-4" /> Core Identifiers
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">PAN</p>
                            <p className="text-sm font-bold text-slate-800">{client.pan}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">GSTIN</p>
                            <p className="text-sm font-bold text-slate-800">{client.gstin || 'Not Registered'}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">TAN</p>
                            <p className="text-sm font-bold text-slate-800">{client.tan || '—'}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Entity Type</p>
                            <p className="text-sm font-bold text-slate-800 capitalize">{client.entity_type?.replace('_', ' ')}</p>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <User className="w-4 h-4" /> Contact Details
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                            <Mail className="w-5 h-5 text-indigo-500" />
                            <div>
                                <p className="text-[10px] font-bold text-indigo-400 uppercase">Email Address</p>
                                <p className="text-sm font-medium text-slate-700">{client.email || '—'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                            <Phone className="w-5 h-5 text-emerald-500" />
                            <div>
                                <p className="text-[10px] font-bold text-emerald-400 uppercase">Mobile Number</p>
                                <p className="text-sm font-medium text-slate-700">{client.mobile || '—'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Address & Others */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> Business Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Residential/Registered Address</p>
                        <p className="text-sm text-slate-700 leading-relaxed">
                            {client.address || <span className="text-slate-400 italic">No address provided</span>}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Date of Registration</p>
                            <p className="text-sm text-slate-700">{client.registration_date ? new Date(client.registration_date).toLocaleDateString() : '—'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Added To Platform</p>
                            <p className="text-sm text-slate-700">{new Date(client.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientOverviewTab;
