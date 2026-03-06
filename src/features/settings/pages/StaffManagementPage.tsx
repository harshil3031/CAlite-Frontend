import { useState, useEffect } from 'react';
import { useStaff, useDeactivateUser, useReactivateUser } from '../hooks/useUsers';
import { InviteModal } from '../components/InviteModal';
import { UserPlus, ShieldCheck, Shield, Users, Loader2 } from 'lucide-react';
import { useAppSelector } from '../../../store';
import { useNavigate } from 'react-router-dom';

export const StaffManagementPage = () => {
    const navigate = useNavigate();
    const currentUser = useAppSelector((state) => state.auth.user);
    const { data: staffMembers, isLoading, error } = useStaff();
    const deactivateMutation = useDeactivateUser();
    const reactivateMutation = useReactivateUser();

    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    // Redirect staff away from admin area
    useEffect(() => {
        if (currentUser?.role !== 'admin') {
            navigate('/dashboard', { replace: true });
        }
    }, [currentUser, navigate]);

    if (currentUser?.role !== 'admin') return null;

    return (
        <div className="animate-fade-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <Users className="w-8 h-8 text-blue-600 dark:text-blue-500" />
                        Staff Management
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Manage roles, invitations, and access across your firm.
                    </p>
                </div>

                <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="btn-primary flex items-center gap-2 whitespace-nowrap"
                >
                    <UserPlus className="w-5 h-5" />
                    Invite Staff
                </button>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-slate-900/60 glass-card rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20 text-slate-500 dark:text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500 bg-red-50 dark:bg-red-900/10">
                        Failed to load staff list. Please refresh the page.
                    </div>
                ) : staffMembers?.length === 0 ? (
                    <div className="p-16 text-center text-slate-500 dark:text-slate-400">
                        No team members found. Start by inviting some staff!
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50">
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Name</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Email</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Role</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                                {staffMembers?.map((member) => (
                                    <tr
                                        key={member.id}
                                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                            {member.fullName}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                            {member.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {member.role === 'admin' ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">
                                                    <ShieldCheck className="w-3.5 h-3.5" />
                                                    Admin
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                                                    <Shield className="w-3.5 h-3.5" />
                                                    Staff
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {member.isActive ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-500/20 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-500/20">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {member.id !== currentUser?.id && (
                                                <button
                                                    onClick={() => {
                                                        if (member.isActive) {
                                                            if (window.confirm(`Are you sure you want to deactivate ${member.fullName}?`)) {
                                                                deactivateMutation.mutate(member.id);
                                                            }
                                                        } else {
                                                            reactivateMutation.mutate(member.id);
                                                        }
                                                    }}
                                                    disabled={deactivateMutation.isPending || reactivateMutation.isPending}
                                                    className={`px-4 py-1.5 text-sm font-medium rounded-lg border transition-colors ${member.isActive
                                                            ? 'border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10'
                                                            : 'border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                                                        }`}
                                                >
                                                    {member.isActive ? 'Deactivate' : 'Reactivate'}
                                                </button>
                                            )}
                                            {member.id === currentUser?.id && (
                                                <span className="text-xs text-slate-400 italic px-2">You</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Invite Modal Overlay */}
            {isInviteModalOpen && (
                <InviteModal
                    isOpen={isInviteModalOpen}
                    onClose={() => setIsInviteModalOpen(false)}
                />
            )}
        </div>
    );
};
