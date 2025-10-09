import {
	Edit,
	MoreVertical,
	Search,
	Trash2,
	UserCheck,
	UserX,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { IUserProfile, UserRole } from '@/types/user';

interface UserTableProps {
	users: IUserProfile[];
	isLoading?: boolean;
	onEdit?: (user: IUserProfile) => void;
	onDelete?: (user: IUserProfile) => void;
	onToggleStatus?: (user: IUserProfile) => void;
	onSearch?: (search: string) => void;
	onRoleFilter?: (role: UserRole | 'all') => void;
	onStatusFilter?: (status: 'active' | 'inactive' | 'all') => void;
}

export function UserTable({
	users,
	isLoading = false,
	onEdit,
	onDelete,
	onToggleStatus,
	onSearch,
	onRoleFilter,
	onStatusFilter,
}: UserTableProps) {
	const [searchTerm, setSearchTerm] = useState('');

	const handleSearch = (value: string) => {
		setSearchTerm(value);
		onSearch?.(value);
	};

	const getRoleLabel = (role: UserRole) => {
		switch (role) {
			case 'backOffice':
				return 'Back Office';
			case 'operator':
				return 'Operator';
			case 'evOwner':
				return 'EV Owner';
			default:
				return role;
		}
	};

	const formatDate = (date: Date | undefined) => {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	return (
		<div className='space-y-4'>
			{/* Filters */}
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				{/* Search */}
				<div className='relative flex-1 sm:max-w-sm'>
					<Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder='Search users...'
						value={searchTerm}
						onChange={(e) => handleSearch(e.target.value)}
						className='pl-9'
					/>
				</div>

				{/* Filters */}
				<div className='flex gap-2'>
					<Select onValueChange={onRoleFilter}>
						<SelectTrigger className='w-[150px]'>
							<SelectValue placeholder='All Roles' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All Roles</SelectItem>
							<SelectItem value='backOffice'>Back Office</SelectItem>
							<SelectItem value='operator'>Operator</SelectItem>
							<SelectItem value='evOwner'>EV Owner</SelectItem>
						</SelectContent>
					</Select>

					<Select onValueChange={onStatusFilter}>
						<SelectTrigger className='w-[150px]'>
							<SelectValue placeholder='All Status' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All Status</SelectItem>
							<SelectItem value='active'>Active</SelectItem>
							<SelectItem value='inactive'>Inactive</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Table */}
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Username</TableHead>
							<TableHead>Email</TableHead>
							<TableHead className='text-center'>NIC</TableHead>
							<TableHead className='text-center'>Role</TableHead>
							<TableHead className='text-center'>Status</TableHead>
							<TableHead>Phone</TableHead>
							<TableHead>Created At</TableHead>
							<TableHead className='text-right'>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={7} className='h-24 text-center'>
									Loading...
								</TableCell>
							</TableRow>
						) : users.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className='h-24 text-center'>
									No users found.
								</TableCell>
							</TableRow>
						) : (
							users.map((user) => (
								<TableRow key={user.id}>
									<TableCell className='font-medium'>{user.username}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell className='text-center'>
										{user.nic || 'N/A'}
									</TableCell>
									<TableCell className='text-center'>
										<Badge
											variant='outline'
											className={cn(
												user.role === 'backOffice'
													? 'bg-blue-100 text-blue-800'
													: user.role === 'operator'
														? 'bg-yellow-100 text-yellow-800'
														: 'bg-purple-100 text-purple-800',
											)}
										>
											{getRoleLabel(user.role)}
										</Badge>
									</TableCell>
									<TableCell className='text-center'>
										<Badge
											variant={user.isActive ? 'default' : 'secondary'}
											className={cn(
												user.isActive
													? 'bg-green-100 text-green-800'
													: 'bg-red-100 text-red-800',
											)}
										>
											{user.isActive ? (
												<UserCheck className='mr-1 size-3' />
											) : (
												<UserX className='mr-1 size-3' />
											)}
											{user.isActive ? 'Active' : 'Inactive'}
										</Badge>
									</TableCell>
									<TableCell>{user.phoneNumber || 'N/A'}</TableCell>
									<TableCell>{formatDate(user.createdAt)}</TableCell>
									<TableCell className='text-right'>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant='ghost' size='icon'>
													<MoreVertical className='size-4' />
													<span className='sr-only'>Actions</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align='end'>
												<DropdownMenuLabel>Actions</DropdownMenuLabel>
												<DropdownMenuSeparator />
												{onEdit && (
													<DropdownMenuItem onClick={() => onEdit(user)}>
														<Edit className='mr-2 size-4' />
														Edit
													</DropdownMenuItem>
												)}
												{onToggleStatus && (
													<DropdownMenuItem
														onClick={() => onToggleStatus(user)}
													>
														{user.isActive ? (
															<>
																<UserX className='mr-2 size-4' />
																Deactivate
															</>
														) : (
															<>
																<UserCheck className='mr-2 size-4' />
																Activate
															</>
														)}
													</DropdownMenuItem>
												)}
												<DropdownMenuSeparator />
												{onDelete && (
													<DropdownMenuItem
														onClick={() => onDelete(user)}
														className='text-destructive'
													>
														<Trash2 className='mr-2 size-4' />
														Delete
													</DropdownMenuItem>
												)}
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
