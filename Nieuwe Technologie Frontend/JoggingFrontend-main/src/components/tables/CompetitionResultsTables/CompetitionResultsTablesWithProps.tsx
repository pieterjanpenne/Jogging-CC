import React, { useState, useEffect } from 'react';
import { Result, Competition } from '@/types';
import ResultsTable from '../competitionRunsTable/ResultsTable2';
import { fetchResults } from '@/services/ResultsService';
import { fetchCompetition } from '@/services/CompetitionService';
import { formatTime } from '@/utils/dateUtils';

interface ResultByIdComponentProps {
	competitionId: number;
	ageCategory: AgeCategory;
	gender: 'M' | 'V' | 'all';
	distance: string;
}

type AgeCategory = '-35' | '-45' | '-55' | '55+' | '-16' | 'all';

const CompetitionResultsTables: React.FC<ResultByIdComponentProps> = ({
	competitionId,
	ageCategory,
	gender,
	distance,
}) => {
	const [competition, setCompetition] = useState<Competition | null>(null);
	const [allResults, setAllResults] = useState<Result[]>([]);
	const [filteredResults, setFilteredResults] = useState<Result[]>([]);
	const [distances, setDistances] = useState<string[]>([]);
	const [error, setError] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	const filterResults = (
		results: Result[],
		gender: 'M' | 'V' | 'all',
		ageCategory: AgeCategory,
		distance: string
	) => {
		return results.filter((item: Result) => {
			const ageCategoryName =
				item?.competitionPerCategory?.ageCategory?.name;
			const distanceName =
				item?.competitionPerCategory?.distanceName;

			return (
				(gender === 'all' || item.person.gender === gender) &&
				(ageCategory === 'all' || ageCategoryName === ageCategory) &&
				distanceName === distance
			);
		});
	};

	const applyFilters = () => {
		const filteredData = filterResults(
			allResults,
			gender,
			ageCategory,
			distance
		);
		setFilteredResults(filteredData);
	};

	useEffect(() => {
		const handleFetch = async () => {
			setLoading(true);
			setError('');
			try {
				const [data, competitionData] = await Promise.all([
					fetchResults({ id: competitionId }),
					fetchCompetition(competitionId),
				]);

				if (data && competitionData) {
					setAllResults(data);
					setCompetition(competitionData);
					const competitionDistances = Object.keys(competitionData.distances);
					setDistances(competitionDistances);
					const filteredData = filterResults(
						data,
						gender,
						ageCategory,
						distance
					);
					setFilteredResults(filteredData);
				} else {
					setAllResults([]);
					setFilteredResults([]);
					setCompetition(null);
					setError('No results found');
				}
			} catch (error) {
				setAllResults([]);
				setFilteredResults([]);
				setCompetition(null);
				setError('Failed to fetch results: ' + error);
			}
			setLoading(false);
		};

		handleFetch();
	}, [competitionId, gender, ageCategory, distance]);

	useEffect(() => {
		applyFilters();
	}, [gender, ageCategory, distance]);

	const formatGunTime = (gunTime: any): string => {
		if (!gunTime) {
			return 'N/A';
		}
		let date;
		if (typeof gunTime === 'string') {
			date = new Date(gunTime);
		} else if (gunTime instanceof Date) {
			date = gunTime;
		} else {
			return 'Invalid date';
		}

		return isNaN(date.getTime())
			? 'Invalid date'
			: formatTime(date.toISOString());
	};

	return (
		<div className='min-h-screen page-break' style={{ breakAfter: 'page' }}>
			{loading ? (
				<p>Loading...</p>
			) : error ? (
				<div className='flex justify-center p-6'>
					<p>{error}</p>
				</div>
			) : (
				<div>
					<div className='flex flex-col items-center p-3 shadow-sm bg-slate-300 dark:bg-inherit justify-evenly md:flex-row'>
						<div className='flex items-center justify-center'>
							<h2 className='text-3xl font-bold '>
								{competition ? competition.name : 'Competition'}
							</h2>
						</div>
						<div className='flex items-center justify-center gap-2'>
							<h2 className='text-base font-bold '>Gender:</h2>
							<div className='px-2 py-1 border rounded-md shadow-sm '>
								<p>
									{gender === 'M' ? 'Man' : gender === 'V' ? 'Vrouw' : 'All'}
								</p>
							</div>
						</div>
						<div className='flex items-center justify-center gap-2'>
							<h2 className='text-base font-bold '>Leeftijdsgroep:</h2>
							<div className='px-2 py-1 border rounded-md shadow-sm '>
								<p>
									{ageCategory === 'all' && 'All'}
									{ageCategory === '-16' && '-16'}
									{ageCategory === '-35' && '-35'}
									{ageCategory === '-45' && '-45'}
									{ageCategory === '-55' && '-55'}
									{ageCategory === '55+' && '55+'}
								</p>
							</div>
						</div>
						<div className='flex items-center justify-center gap-2'>
							<h2 className='text-base font-bold '>Afstand:</h2>
							<div className='px-2 py-1 border rounded-md shadow-sm '>
								<p>{distance}</p>
							</div>
						</div>
						<div className='flex items-center justify-center gap-2'>
							<h2 className='text-base font-bold'>Start tijd:</h2>
							<div className='px-2 py-1 border rounded-md shadow-sm '>
								<p>
									{competition?.competitionPerCategories[0]?.gunTime
										? formatGunTime(
												competition.competitionPerCategories[0].gunTime
										  )
										: 'N/A'}
								</p>
							</div>
						</div>
					</div>
					<div className='w-full text-center'>
						<ResultsTable results={filteredResults} title={distance} />
					</div>
				</div>
			)}
		</div>
	);
};

export default CompetitionResultsTables;
