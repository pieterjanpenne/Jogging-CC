import React, { useState, useEffect } from 'react';
import { Result, Competition } from '@/types';
import ResultsTable from '../competitionRunsTable/ResultsTable2';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { fetchResults } from '@/services/ResultsService';
import { fetchCompetition } from '@/services/CompetitionService';
import { formatTime } from '@/utils/dateUtils';

interface ResultByIdComponentProps {
	competitionId: number;
}

type AgeCategory = 'all' | '-16' | '-35' | '-45' | '-55' | '55+';

const CompetitionResultsTables: React.FC<ResultByIdComponentProps> = ({
	competitionId,
}) => {
	const [competition, setCompetition] = useState<Competition | null>(null);
	const [allResults, setAllResults] = useState<Result[]>([]);
	const [filteredResults, setFilteredResults] = useState<Result[]>([]);
	const [selectedGender, setSelectedGender] = useState<'M' | 'V' | 'all'>(
		'all'
	);
	const [selectedAgeCategory, setSelectedAgeCategory] =
		useState<AgeCategory>('all');
	const [selectedDistance, setSelectedDistance] = useState<string>('');
	const [distances, setDistances] = useState<string[]>([]);
	const [error, setError] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	const handleGenderChange = (value: 'M' | 'V' | 'all') => {
		setSelectedGender(value);
	};

	const handleAgeCategoryChange = (value: AgeCategory) => {
		setSelectedAgeCategory(value);
	};

	const handleDistanceChange = (value: string) => {
		setSelectedDistance(value);
	};

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
			selectedGender,
			selectedAgeCategory,
			selectedDistance
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
					setSelectedDistance(competitionDistances[0] || ''); // Set default distance
					const filteredData = filterResults(
						data,
						selectedGender,
						selectedAgeCategory,
						competitionDistances[0] || ''
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
	}, [competitionId]);

	useEffect(() => {
		applyFilters();
	}, [selectedGender, selectedAgeCategory, selectedDistance]);

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
		<div>
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
							<Select onValueChange={handleGenderChange} value={selectedGender}>
								<SelectTrigger className='w-[100px]'>
									<SelectValue placeholder='Select Gender' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='all'>All</SelectItem>
									<SelectItem value='M'>Man</SelectItem>
									<SelectItem value='V'>Vrouw</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className='flex items-center justify-center gap-2'>
							<h2 className='text-base font-bold '>Leeftijdsgroep:</h2>
							<Select
								onValueChange={handleAgeCategoryChange}
								value={selectedAgeCategory}
							>
								<SelectTrigger className='w-[100px]'>
									<SelectValue placeholder='Kies leeftijdsgroep' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='all'>All</SelectItem>
									<SelectItem value='-16'>-16</SelectItem>
									<SelectItem value='-35'>-35</SelectItem>
									<SelectItem value='-45'>-45</SelectItem>
									<SelectItem value='-55'>-55</SelectItem>
									<SelectItem value='55+'>55+</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className='flex items-center justify-center gap-2 justify-items-center'>
							<h2 className='text-base font-bold '>Afstand:</h2>
							<Select
								onValueChange={handleDistanceChange}
								value={selectedDistance}
							>
								<SelectTrigger className='w-[125px]'>
									<SelectValue placeholder='Select Distance' />
								</SelectTrigger>
								<SelectContent>
									{distances.map((distance) => (
										<SelectItem key={distance} value={distance}>
											{distance}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className='flex items-center justify-center gap-2 justify-items-center'>
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
						<ResultsTable results={filteredResults} title={selectedDistance} />
					</div>
				</div>
			)}
		</div>
	);
};

export default CompetitionResultsTables;
