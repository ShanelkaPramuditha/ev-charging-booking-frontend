export interface IUser {
	id: string;
	email: string;
	username: string;
	image?: string | null;
	createdAt: Date;
	updatedAt: Date;
}
