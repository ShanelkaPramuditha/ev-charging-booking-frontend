import { isAxiosError } from 'axios';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	useCreateUser,
	useDeleteUser,
	useToggleUserStatus,
	useUpdateUser,
	useUsers,
} from '@/queries/user.queries';
import type {
	CreateUserFormData,
	UpdateUserFormData,
} from '@/schemas/user.schema';
import type { IUserProfile, UserRole } from '@/types/user';

import { ConfirmDialog } from './confirm-dialog';
import { UserFormDialog } from './user-form-dialog';
import { UserTable } from './user-table';

export function UserManagement() {
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<IUserProfile | null>(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState<IUserProfile | null>(null);
	const [userToToggle, setUserToToggle] = useState<IUserProfile | null>(null);

	// Filters
	const [searchTerm, setSearchTerm] = useState('');
	const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
	const [statusFilter, setStatusFilter] = useState<
		'active' | 'inactive' | 'all'
	>('all');

	// Queries
	const { data: usersData, isLoading } = useUsers({
		search: searchTerm || undefined,
		role: roleFilter !== 'all' ? roleFilter : undefined,
		status: statusFilter !== 'all' ? statusFilter : undefined,
	});

	const createUserMutation = useCreateUser();
	const updateUserMutation = useUpdateUser();
	const deleteUserMutation = useDeleteUser();
	const toggleStatusMutation = useToggleUserStatus();

	// Handlers
	const handleCreateUser = () => {
		setSelectedUser(null);
		setIsFormOpen(true);
	};

	const handleEditUser = (user: IUserProfile) => {
		setSelectedUser(user);
		setIsFormOpen(true);
	};

	const handleDeleteUser = (user: IUserProfile) => {
		setUserToDelete(user);
		setIsDeleteDialogOpen(true);
	};

	const handleToggleStatus = (user: IUserProfile) => {
		setUserToToggle(user);
		setIsStatusDialogOpen(true);
	};

	const handleFormSubmit = async (
		data: CreateUserFormData | UpdateUserFormData,
	) => {
		try {
			if (selectedUser) {
				// Update existing user
				const updateData = data as UpdateUserFormData;
				await updateUserMutation.mutateAsync({
					id: selectedUser.id,
					userData: {
						username: updateData.username,
						email: updateData.email,
						role: updateData.role,
						phoneNumber: updateData.phoneNumber,
						address: updateData.address,
						nic: updateData.nic,
					},
				});
				toast.success('User updated successfully');
			} else {
				// Create new user
				const createData = data as CreateUserFormData;
				await createUserMutation.mutateAsync(createData);
				toast.success('User created successfully');
			}
			// Only close and reset on success
			setIsFormOpen(false);
			setSelectedUser(null);
		} catch (error: unknown) {
			// Handle 400 Bad Request error (user already exists)
			if (isAxiosError(error) && error.response?.status === 400) {
				toast.error('User Already Exists!', {
					description:
						'A user with this email/ NIC already exists in the system.',
				});
			} else {
				const errorMessage =
					error instanceof Error ? error.message : 'An error occurred';
				toast.error(
					selectedUser ? 'Failed to update user' : 'Failed to create user',
					{
						description: errorMessage,
					},
				);
			}
			// Re-throw to prevent form from closing
			throw error;
		}
	};

	const confirmDelete = async () => {
		if (!userToDelete) return;

		try {
			await deleteUserMutation.mutateAsync(userToDelete.id);
			toast.success('User deleted successfully');
			setIsDeleteDialogOpen(false);
			setUserToDelete(null);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'An error occurred';
			toast.error('Failed to delete user', {
				description: errorMessage,
			});
		}
	};

	const confirmToggleStatus = async () => {
		if (!userToToggle) return;

		try {
			await toggleStatusMutation.mutateAsync({
				id: userToToggle.id,
				isActive: userToToggle.isActive,
			});
			toast.success(
				`User ${userToToggle.isActive ? 'deactivated' : 'activated'} successfully`,
			);
			setIsStatusDialogOpen(false);
			setUserToToggle(null);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'An error occurred';
			toast.error('Failed to update user status', {
				description: errorMessage,
			});
		}
	};

	const handleSearch = (search: string) => {
		setSearchTerm(search);
	};

	const handleRoleFilter = (role: string) => {
		setRoleFilter(role as UserRole | 'all');
	};

	const handleStatusFilter = (status: string) => {
		setStatusFilter(status as 'active' | 'inactive' | 'all');
	};

	return (
		<>
			<Card className='border-0 shadow-none py-4'>
				<CardHeader className='flex flex-row items-center justify-between p-0'>
					<div>
						<CardTitle>User Management</CardTitle>
						<CardDescription>
							Manage all system users and EV owner profiles
						</CardDescription>
					</div>
					<Button onClick={handleCreateUser}>
						<UserPlus className='size-4' />
						Add User
					</Button>
				</CardHeader>
				<CardContent className='p-0'>
					<UserTable
						users={usersData || []}
						isLoading={isLoading}
						onEdit={handleEditUser}
						onDelete={handleDeleteUser}
						onToggleStatus={handleToggleStatus}
						onSearch={handleSearch}
						onRoleFilter={handleRoleFilter}
						onStatusFilter={handleStatusFilter}
					/>
				</CardContent>
			</Card>

			{/* User Form Dialog */}
			<UserFormDialog
				open={isFormOpen}
				onOpenChange={setIsFormOpen}
				onSubmit={handleFormSubmit}
				isLoading={createUserMutation.isPending || updateUserMutation.isPending}
				user={selectedUser}
			/>

			{/* Delete Confirmation Dialog */}
			<ConfirmDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
				onConfirm={confirmDelete}
				title='Delete User'
				description={`Are you sure you want to delete ${userToDelete?.username}? This action cannot be undone.`}
				confirmText='Delete'
				isDestructive={true}
			/>

			{/* Status Toggle Confirmation Dialog */}
			<ConfirmDialog
				open={isStatusDialogOpen}
				onOpenChange={setIsStatusDialogOpen}
				onConfirm={confirmToggleStatus}
				title={`${userToToggle?.isActive ? 'Deactivate' : 'Activate'} User`}
				description={`Are you sure you want to ${userToToggle?.isActive ? 'deactivate' : 'activate'} ${userToToggle?.username}?`}
				confirmText={userToToggle?.isActive ? 'Deactivate' : 'Activate'}
			/>
		</>
	);
}
