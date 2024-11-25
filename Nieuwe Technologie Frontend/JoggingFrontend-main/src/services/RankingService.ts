import apiClient from './apiClient';
import { RankingCategory } from '@/types';

interface FetchRankingsParams {
    pageNumber?: number;
    pageSize?: number;
    orderBy?: string;
}

export const fetchRankings = async ({
                                        pageNumber,
                                        pageSize,
                                        orderBy,
                                    }: FetchRankingsParams = {}): Promise<{ data: RankingCategory[]; total: number }> => {
    try {
        const response = await apiClient.get('ranking', {
            params: { PageNumber: pageNumber, PageSize: pageSize, OrderBy: orderBy },
        });
        const pagination = response.headers['x-pagination'];
        const total = pagination ? JSON.parse(pagination).TotalCount : 0;

        return {
            data: response.data,
            total,
        };
    } catch (error: any) {
        console.error('Failed to fetch rankings:', error.message);
        throw new Error('Could not fetch rankings. Please try again later.');
    }
};
