import React, { useEffect, useState, useCallback } from 'react';
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableCell,
} from '@/components/ui/table';
import { fetchCompetitions } from '@/services/CompetitionService';
import ContestRow from './ContestRow';
import { Competition } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const CompetitionsTable: React.FC<{
	onEdit: (contest: Competition) => void;
}> = ({ onEdit }) => {
	const [contests, setContests] = useState<Competition[]>([]);
	const [page, setPage] = useState<number>(1);
	const [pageSize] = useState<number>(6);
	const [totalPages, setTotalPages] = useState<number>(0);
	const [searchValue, setSearchValue] = useState<string>('');
	const [startDate, setStartDate] = useState<string>('');
	const [endDate, setEndDate] = useState<string>('');

	const loadCompetitions = useCallback(async () => {
		try {
			const { data, pagination } = await fetchCompetitions({
				PageSize: pageSize,
				PageNumber: page,
				searchValue: searchValue,
				startDate: startDate,
				endDate: endDate,
			});
			setContests(data);
			setTotalPages(pagination.TotalPages);
		} catch (error) {
			console.error('Failed to fetch competitions', error);
			setContests([]);
			setTotalPages(0);
		}
	}, [page, pageSize, searchValue, startDate, endDate]);

	useEffect(() => {
		loadCompetitions();
	}, [loadCompetitions]);

	const handlePrevPage = () => {
		if (page > 1) {
			setPage(page - 1);
		}
	};

	const handleNextPage = () => {
		if (page < totalPages) {
			setPage(page + 1);
		}
	};

	const debounce = (func: (...args: any[]) => void, wait: number) => {
		let timeout: ReturnType<typeof setTimeout>;
		return (...args: any[]) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => func(...args), wait);
		};
	};

	const debouncedSearch = useCallback(
		debounce((value: string) => {
			setSearchValue(value);
			setPage(1); // Reset to first page on search
		}, 500),
		[]
	);

	const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setStartDate(e.target.value);
		setPage(1); // Reset to first page on date change
	};

	const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEndDate(e.target.value);
		setPage(1); // Reset to first page on date change
	};

	return (
		<>
			<div className='flex flex-col items-center justify-between gap-3 pb-3 lg:flex-row'>
				<Input
					placeholder='Zoek wedstrijden...'
					onChange={(e) => debouncedSearch(e.target.value)}
				/>
				<div className='flex items-center justify-between w-full gap-2'>
					<label className='w-[50px] font-semibold'>Start: </label>
					<Input
						className='w-full'
						type='date'
						max='9999-12-31'
						placeholder='Start Date '
						onChange={handleStartDateChange}
					/>
				</div>
				<div className='flex items-center justify-around w-full gap-2'>
					<label className='w-[50px] font-semibold'>Eind: </label>
					<Input
						className='w-full'
						type='date'
						max='9999-12-31'
						placeholder='End Date'
						onChange={handleEndDateChange}
					/>
				</div>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableCell>Naam</TableCell>
						<TableCell>Datum</TableCell>
						<TableCell>Status</TableCell>
						<TableCell>Ranking</TableCell>
						<TableCell>Actions</TableCell>
					</TableRow>
				</TableHeader>
				<TableBody className='w-full'>
					{contests.map((contest) => (
						<ContestRow
							key={contest.id}
							contest={contest}
							refreshContests={loadCompetitions}
							onEdit={onEdit}
						/>
					))}
				</TableBody>
			</Table>
			<div className='flex items-center justify-between gap-2 mt-4'>
				<Button onClick={handlePrevPage} disabled={page === 1}>
					Vorige
				</Button>
				<p>
					{page} / {totalPages}
				</p>
				<Button onClick={handleNextPage} disabled={page >= totalPages}>
					Volgende
				</Button>
			</div>
		</>
	);
};

export default CompetitionsTable;
