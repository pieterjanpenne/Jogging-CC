import { Person } from '@/types';
import apiClient from './apiClient';

interface FetchPersonsParams {
	pageNumber?: number;
	pageSize?: number;
	orderBy?: string;
	searchValue?: string;
}

export const fetchPersons = async ({
	pageNumber,
	pageSize,
	orderBy,
	searchValue,
}: FetchPersonsParams = {}): Promise<{ data: Person[]; total: number }> => {
	try {
		const response = await apiClient.get('Person', {
			params: {
				PageNumber: pageNumber,
				PageSize: pageSize,
				OrderBy: orderBy,
				searchValue: searchValue,
			},
		});
		return {
			data: response.data,
			total: JSON.parse(response.headers['x-pagination']).TotalCount,
		};
	} catch (error: any) {
		console.error('Failed to fetch persons:', error.message);
		throw error;
	}
};

// Create a new person
export const createPerson = async (personData: Person): Promise<Person> => {
	try {
		const response = await apiClient.post('Person', personData);
		return response.data as Person;
	} catch (error: any) {
		console.error('Failed to create person:', error.message);
		throw new Error('Could not create person. Please try again later.');
	}
};

// Update an existing person
export const updatePerson = async (
	id: number,
	personData: Person
): Promise<Person> => {
	try {
		const response = await apiClient.put(`Person/${id}`, personData);
		return response.data as Person;
	} catch (error: any) {
		console.error(`Failed to update person with ID ${id}:`, error.message);
		throw new Error(
			`Could not update person with ID ${id}. Please try again later.`
		);
	}
};

// Delete an existing person
export const adminChangePersonEmail = async (id: number, email:string | undefined): Promise<boolean> => {
	try {
		const response = await apiClient.put(`Person/email/${id}`, {email:email});

		return response.status === 201;
	} catch (error: any) {
		console.error(`Failed to change email for person with ID ${id}:`, error.message);
		throw error
	}
};
// Delete an existing person
export const adminDeletePerson = async (id: number): Promise<void> => {
	try {
		await apiClient.delete(`Person/private/${id}`);
	} catch (error: any) {
		console.error(`Failed to delete person with ID ${id}:`, error.message);
		throw new Error(
			`Could not delete person with ID ${id}. Please try again later.`
		);
	}
};

// Delete an existing person
export const deletePerson = async (): Promise<void> => {
	try {
		await apiClient.delete(`Person`);
	} catch (error: any) {
		console.error(`Failed to delete person:`, error.message);
		throw new Error(
			`Could not delete person. Please try again later.`
		);
	}
};

// Fetch a single person by ID
export const fetchPerson = async (id: number): Promise<Person> => {
	try {
		const response = await apiClient.get(`Person/${id}`);
		return response.data as Person;
	} catch (error: any) {
		if (error.response?.status === 404) {
			console.error(`Person with ID ${id} not found.`);
			throw new Error(`Person with ID ${id} not found.`);
		}
		console.error(`Failed to fetch person with ID ${id}:`, error.message);
		throw new Error(
			`Could not fetch person with ID ${id}. Please try again later.`
		);
	}
};
