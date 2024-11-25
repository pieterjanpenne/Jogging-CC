import { Registration, Person } from '@/types';
import apiClient from './apiClient';

type DistanceType = string;

interface RegistrationData {
	distanceName: DistanceType;
	competitionId: number;
	email?: string;
	person?: Person;
}

// Adjusted Pagination type
interface Pagination {
	CurrentPage: number;
	TotalPages: number;
	PageSize: number;
	TotalCount: number;
	HasPrevious: boolean;
	HasNext: boolean;
}

interface ApiResponse<T> {
	data: T;
	pagination: Pagination;
}

export const fetchRegistrations = async (
	params: {
		personId?: number;
		competitionId?: number;
		PageNumber?: number;
		PageSize?: number;
		OrderBy?: string;
		withRunNumber?: boolean;
		searchValue?: string;
	} = {}
): Promise<ApiResponse<Registration[]>> => {
	try {
		const response = await apiClient.get('Registration/private', { params });
		const paginationHeader = response.headers['x-pagination'];

		if (paginationHeader) {
			const pagination: Pagination = JSON.parse(paginationHeader);
			return {
				data: response.data as Registration[],
				pagination,
			};
		} else {
			console.error('Pagination header is missing');
			return {
				data: response.data as Registration[],
				pagination: {} as Pagination,
			};
		}
	} catch (error) {
		console.error('Failed to fetch registrations:', error);
		throw new Error('Failed to fetch registrations');
	}
};

export const fetchPersonalRegistrations = async (
	params: {
		PageNumber?: number;
		PageSize?: number;
		OrderBy?: string;
		withRunNumber?: boolean;
	} = {}
): Promise<ApiResponse<Registration[]>> => {
	try {
		const response = await apiClient.get('Registration', { params });
		const paginationHeader = response.headers['x-pagination'];

		if (paginationHeader) {
			const pagination: Pagination = JSON.parse(paginationHeader);
			return {
				data: response.data as Registration[],
				pagination,
			};
		} else {
			console.error('Pagination header is missing');
			return {
				data: response.data as Registration[],
				pagination: {} as Pagination,
			};
		}
	} catch (error) {
		console.error('Failed to fetch personal registrations:', error);
		throw new Error('Failed to fetch personal registrations');
	}
};

export const createRegistration = async (
	registrationData: RegistrationData
): Promise<Registration> => {
	try {
		const response = await apiClient.post('Registration', registrationData);
		return response.data as Registration;
	} catch (error) {
		console.error('Failed to create registration:', error);
		throw error;
	}
};

export const createPrivateRegistration = async (
	registrationData: RegistrationData
): Promise<Registration> => {
	try {
		const response = await apiClient.post(
			'Registration/private',
			registrationData
		);
		return response.data as Registration;
	} catch (error) {
		console.error('Failed to create private registration:', error);
		throw error;
	}
};

export const updateRegistration = async (
	id: number,
	updateData: { runNumber: number }
): Promise<Registration> => {
	try {
		const response = await apiClient.put(
			`registration/runnumber/${id}`,
			updateData
		);
		return response.data as Registration;
	} catch (error) {
		console.error('Failed to update registration:', error);
		throw error;
	}
};

export const updatePaymentStatus = async (
	id: number,
	updateData: { paid: boolean }
): Promise<Registration> => {
	try {
		const response = await apiClient.put(`registration/paid/${id}`, updateData);
		return response.data as Registration;
	} catch (error) {
		console.error('Failed to update registration payment status:', error);
		throw new Error('Failed to update registration payment status');
	}
};

export const deleteRegistration = async (
	competitionId: number
): Promise<void> => {
	try {
		const url = `Registration/${competitionId}`;
		const response = await apiClient.delete(url);
		return response.data;
	} catch (error) {
		console.error('Failed to delete registration:', error);
		throw new Error('Failed to delete registration');
	}
};

export const deleteRegistrationWithRegistrationID = async (
	registrationId: number
): Promise<void> => {
	try {
		const url = `Registration/private/${registrationId}`;
		const response = await apiClient.delete(url);
		return response.data;
	} catch (error) {
		console.error('Failed to delete private registration:', error);
		throw new Error('Failed to delete private registration');
	}
};

export const updatePrivateCompetitionCategory = async (
	registrationId: number,
	personId: number,
	updateData: { distanceName: string }
): Promise<Registration> => {
	try {
		const response = await apiClient.put(
			`registration/private/competitionpercategory/${registrationId}?personId=${personId}`,
			updateData
		);
		return response.data as Registration;
	} catch (error) {
		console.error('Failed to update private competition category:', error);
		throw new Error('Failed to update private competition category');
	}
};

export const updateCompetitionCategory = async (
	registrationId: number,
	updateData: { distanceName: string }
): Promise<Registration> => {
	try {
		const response = await apiClient.put(
			`registration/competitionpercategory/${registrationId}`,
			updateData
		);
		return response.data as Registration;
	} catch (error) {
		console.error('Failed to update competition category:', error);
		throw new Error('Failed to update competition category');
	}
};
