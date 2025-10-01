import type { IUser } from './user';

export interface IAuthContext {
	isLoading: boolean;
	isAuthenticated: boolean;
	user: IUser | null;
}
