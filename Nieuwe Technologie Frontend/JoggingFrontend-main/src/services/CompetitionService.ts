import { Competition } from '@/types';
import apiClient from './apiClient';

export const fetchPublicCompetitions = async (): Promise<any> => {
	try {
		const response = await apiClient.get('Competition');
		return { data: response.data };
	} catch (error) {
		console.error('Error fetching public competitions:', error);
		throw error;
	}
};

export const fetchCompetitions = async (
	params: {
		PageNumber?: number;
		PageSize?: number;
		OrderBy?: string;
		searchValue?: string;
		startDate?: string;
		endDate?: string;
	} = {}
): Promise<any> => {
	try {
		const response = await apiClient.get('Competition/private', { params });
		const paginationHeader = response.headers['x-pagination'];
		if (paginationHeader) {
			const pagination = JSON.parse(paginationHeader);
			return {
				data: response.data,
				pagination: pagination,
			};
		} else {
			console.error('Pagination header is missing');
			return {
				data: response.data,
				pagination: {},
			};
		}
	} catch (error) {
		console.error('Error fetching competitions:', error);
		throw error;
	}
};

export const createCompetition = async (competitionData: any): Promise<any> => {
	const formattedData = {
		...competitionData,
		date: new Date(competitionData.date).toISOString(),
		distances: competitionData.afstanden.reduce(
			(
				acc: Record<string, number>,
				afstand: { name: string; distance: number }
			) => {
				acc[afstand.name] = afstand.distance;
				return acc;
			},
			{}
		),
	};
	return apiClient.post('Competition', formattedData);
};

export const updateCompetition = async (
	id: number,
	competitionData: any
): Promise<any> => {
	const formattedData = {
		...competitionData,
		date: new Date(competitionData.date).toISOString(),
		distances: competitionData.afstanden.reduce(
			(
				acc: Record<string, number>,
				afstand: { name: string; distance: number }
			) => {
				acc[afstand.name] = afstand.distance;
				return acc;
			},
			{}
		),
	};
	return apiClient.put(`Competition/${id}`, formattedData);
};

export const deleteCompetition = async (id: number): Promise<any> => {
	return apiClient.delete(`Competition/${id}`);
};

export const fetchCompetition = async (id: number): Promise<Competition> => {
	return apiClient.get(`Competition/${id}`).then((response) => response.data);
};
