import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { type UserQueryParams, userService } from '@/services/user.service';
import type { ICreateUserRequest, IUpdateUserRequest } from '@/types/user';

/**
 * Query keys for user-related queries
 */
export const userQueryKeys = {
	all: ['users'] as const,
	lists: () => [...userQueryKeys.all, 'list'] as const,
	list: (params?: UserQueryParams) =>
		[...userQueryKeys.lists(), params] as const,
	details: () => [...userQueryKeys.all, 'detail'] as const,
	detail: (id: string) => [...userQueryKeys.details(), id] as const,
	byRole: (role: string) => [...userQueryKeys.all, 'role', role] as const,
};

/**
 * Hook to fetch users with optional filtering and pagination
 */
export function useUsers(params?: UserQueryParams) {
	return useQuery({
		queryKey: userQueryKeys.list(params),
		queryFn: () => userService.getUsers(params),
	});
}

/**
 * Hook to fetch a single user by ID
 */
export function useUser(id: string, enabled = true) {
	return useQuery({
		queryKey: userQueryKeys.detail(id),
		queryFn: () => userService.getUserById(id),
		enabled: enabled && !!id,
	});
}

/**
 * Hook to fetch users by role
 */
export function useUsersByRole(role: 'backOffice' | 'operator' | 'evOwner') {
	return useQuery({
		queryKey: userQueryKeys.byRole(role),
		queryFn: () => userService.getUsersByRole(role),
		enabled: !!role,
	});
}

/**
 * Hook to create a new user
 */
export function useCreateUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (userData: ICreateUserRequest) =>
			userService.createUser(userData),
		onSuccess: () => {
			// Invalidate and refetch user lists
			queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
		},
	});
}

/**
 * Hook to update a user
 */
export function useUpdateUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			userData,
		}: {
			id: string;
			userData: IUpdateUserRequest;
		}) => userService.updateUser(id, userData),
		onSuccess: (data) => {
			// Invalidate and refetch user lists and specific user
			queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
			queryClient.invalidateQueries({
				queryKey: userQueryKeys.detail(data.id),
			});
		},
	});
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => userService.deleteUser(id),
		onSuccess: () => {
			// Invalidate and refetch user lists
			queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
		},
	});
}

/**
 * Hook to activate a user
 */
export function useActivateUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => userService.activateUser(id),
		onSuccess: (data) => {
			// Invalidate and refetch user lists and specific user
			queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
			queryClient.invalidateQueries({
				queryKey: userQueryKeys.detail(data.id),
			});
		},
	});
}

/**
 * Hook to deactivate a user
 */
export function useDeactivateUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => userService.deactivateUser(id),
		onSuccess: (data) => {
			// Invalidate and refetch user lists and specific user
			queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
			queryClient.invalidateQueries({
				queryKey: userQueryKeys.detail(data.id),
			});
		},
	});
}

/**
 * Hook to toggle user status (activate/deactivate)
 */
export function useToggleUserStatus() {
	const activateUser = useActivateUser();
	const deactivateUser = useDeactivateUser();

	return useMutation({
		mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => {
			if (isActive) {
				return deactivateUser.mutateAsync(id);
			}
			return activateUser.mutateAsync(id);
		},
	});
}
