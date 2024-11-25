import { FetchResultsParams, Result } from '@/types';
import apiClient from './apiClient';

export const fetchResults = async ({
	id,
	pageNumber,
	pageSize,
	orderBy,
}: FetchResultsParams): Promise<Result[] | null> => {
	try {
		let response;
		if (id !== undefined) {
			response = await apiClient.get(`Result/${id}`, {
				params: {
					PageSize: 3000,
				},
			});
		} else {
			response = await apiClient.get('Result', {
				params: {
					PageNumber: pageNumber,
					PageSize: pageSize,
					OrderBy: orderBy,
				},
			});
		}
		return response.data;
	} catch (error: any) {
		console.error(
			'Failed to fetch results:',
			error?.response?.data || error.message
		);
		return null;
	}
};

export const fetchAllResults = async (
	params: FetchResultsParams = { pageNumber: 1, pageSize: 10, orderBy: 'a' }
): Promise<Result[] | null> => {
	try {
		const response = await apiClient.get('Result', {
			params: {
				PageNumber: params.pageNumber,
				PageSize: params.pageSize,
				OrderBy: params.orderBy,
			},
		});
		return response.data;
	} catch (error: any) {
		console.error(
			'Failed to fetch results:',
			error?.response?.data || error.message
		);
		return null;
	}
};

export const uploadCsv = async (id: string, file: File): Promise<boolean> => {
	try {
		const formData = new FormData();
		formData.append('FormFile', file);

		const response = await apiClient.post(`Result/${id}`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		return response.status === 201;
	} catch (error: any) {
		if (error.response) {
			console.error('Failed to upload CSV file:', error.response.data);
		} else {
			console.error('Failed to upload CSV file:', error.message);
		}

		const errorData = error?.response?.data;
		const validationErrors = errorData?.errors?.FormFile;
		const errorMessage = error.response.data;

		throw new Error(errorMessage);
	}
};

export const updateResultRunTime = async (
	registrationId: string,
	runTime: { hours: number; minutes: number; seconds: number }
): Promise<boolean> => {
	try {
		const formattedRunTime = `${String(runTime.hours).padStart(
			2,
			'0'
		)}:${String(runTime.minutes).padStart(2, '0')}:${String(
			runTime.seconds
		).padStart(2, '0')}`;

		const response = await apiClient.put(`Result/runtime/${registrationId}`, {
			runTime: formattedRunTime,
		});

		return response.status === 201;
	} catch (error: any) {
		console.error(
			'Failed to update result:',
			error?.response?.data || error.message
		);
		return false;
	}
};

export const updateResultGunTime = async (
	competitionId: number,
	gunTime: Date
): Promise<boolean> => {
	try {
		const formattedGunTimeString = gunTime.toISOString();

		const response = await apiClient.put(`Result/guntime/${competitionId}`, {
			gunTime: formattedGunTimeString,
		});

		return response.status === 201;
	} catch (error: any) {
		console.error(
			'Failed to update result:',
			error?.response?.data || error.message
		);
		return false;
	}
};
