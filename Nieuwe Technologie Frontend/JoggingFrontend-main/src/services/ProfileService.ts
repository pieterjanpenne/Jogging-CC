// ProfileService.ts
import apiClient from './apiClient';

interface UpdateRoleParams {
	id: number;
	role: 'Admin' | 'User';
}

// Update a person's role
export const updateRole = async ({
	id,
	role,
}: UpdateRoleParams): Promise<void> => {
	try {
		await apiClient.put(
			``,
			{
				role: role,
			},
			{
				headers: {
					accept: '*/*',
					'Content-Type': 'application/json',
				},
			}
		);
	} catch (error: any) {
		console.error(
			`Failed to update role for person with ID ${id}:`,
			error.message
		);
		throw new Error(
			`Could not update role for person with ID ${id}. Please try again later.`
		);
	}
};
