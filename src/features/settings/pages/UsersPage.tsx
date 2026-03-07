import { useState } from 'react';
import { useStaff, useDeactivateUser, useReactivateUser, useInviteUser } from '../hooks/useUsers';
import InviteUserModal from '../components/InviteUserModal';
import RoleBadge from '../components/RoleBadge';
import { useAppSelector } from '../../../store';

export default function UsersPage() {
    const currentUser = useAppSelector((state) => state.auth.user);
    const { data: users, isLoading } = useStaff();
    const deactivate = useDeactivateUser();
    const reactivate = useReactivateUser();
    const invite = useInviteUser();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Only admin can access this page
    if (currentUser?.role !== 'admin') {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-medium">Access Denied</p>
                    <p className="text-red-600 text-sm mt-1">Only administrators can manage team members.</p>
                </div>
            </div>
        );
    }

    const handleInvite = (data: { email: string; fullName: string; role: 'admin' | 'staff' | 'client' }) => {
        invite.mutate(data, {
            onSuccess: () => {
                setIsModalOpen(false);
            }
        });
    };

    const handleToggleStatus = (userId: string, isActive: boolean) => {
        if (userId === currentUser?.id) {
            return; // Can't deactivate self
        }

        if (isActive) {
            if (window.confirm('Are you sure you want to deactivate this user? They will be logged out immediately.')) {
                deactivate.mutate(userId);
            }
        } else {
            reactivate.mutate(userId);
        }
    };

    return (
        <div className="p-8">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
                    <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Invite User
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : !users || users.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
                    <p className="text-gray-600 mb-4">Get started by inviting your first team member</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                        Invite User
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                <span className="text-gray-600 font-medium text-sm">
                                                    {user.fullName.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.fullName}
                                                    {user.id === currentUser?.id && (
                                                        <span className="ml-2 text-xs text-gray-500">(You)</span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <RoleBadge role={user.role as 'admin' | 'staff' | 'client'} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.isActive ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                                Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {user.id !== currentUser?.id && (
                                            <button
                                                onClick={() => handleToggleStatus(user.id, user.isActive)}
                                                className={`${
                                                    user.isActive
                                                        ? 'text-red-600 hover:text-red-900'
                                                        : 'text-green-600 hover:text-green-900'
                                                } font-medium`}
                                                disabled={deactivate.isPending || reactivate.isPending}
                                            >
                                                {user.isActive ? 'Deactivate' : 'Reactivate'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <InviteUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleInvite}
                loading={invite.isPending}
            />
        </div>
    );
}
