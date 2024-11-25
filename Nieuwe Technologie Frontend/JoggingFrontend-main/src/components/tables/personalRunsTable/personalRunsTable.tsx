import React, { useState, useEffect } from 'react';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHeader,
	TableHead,
	TableRow,
} from '@/components/ui/table';
import { fetchAllResults } from '@/services/ResultsService';
import { Result, Competition } from '@/types';
import { fetchCompetition } from '@/services/CompetitionService';
import { formatDate } from '@/utils/dateUtils';

const formatTime = (timeString: string) => {
	const date = new Date(timeString);
	return date.toLocaleTimeString('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	});
};

const PersonalRunsTable: React.FC = () => {
	const [participations, setParticipations] = useState<Result[]>([]);
	const [competitions, setCompetitions] = useState<Record<number, Competition>>(
		{}
	);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadParticipationsAndCompetitions = async () => {
			setLoading(true);
			setError(null);
			try {
				const resultsData = await fetchAllResults();
				if (resultsData) {
					const filteredResults = resultsData.filter(
						(p) =>
							p.competitionPerCategory?.gunTime &&
							p.runTime
					);

					setParticipations(filteredResults);

					const competitionIds = Array.from(
						new Set(
							filteredResults
								.map(
									(p) => p.competitionPerCategory?.competitionId
								)
								.filter(Boolean)
						)
					) as number[];

					const competitionDataPromises = competitionIds.map((id) =>
						fetchCompetition(id)
					);
					const competitionsData = await Promise.all(competitionDataPromises);

					const competitionsMap = competitionsData.reduce(
						(acc, competition) => {
							if (competition?.id) {
								acc[competition.id] = competition;
							}
							return acc;
						},
						{} as Record<number, Competition>
					);

					setCompetitions(competitionsMap);
				} else {
					setError('Er zijn nog geen participaties.');
				}
			} catch (error) {
				setError('Failed to fetch participations.');
				console.error(error);
			}
			setLoading(false);
		};

		loadParticipationsAndCompetitions();
	}, []);

	const getCompetitionDetails = (
		competitionId?: number
	): Competition | null => {
		if (!competitionId) return null;
		return competitions[competitionId] ?? null;
	};

	return (
		<div>
			{loading ? (
				<p>Loading...</p>
			) : error ? (
				<p className='flex justify-center w-full text-base font-normal'>
					{error}
				</p>
			) : (
				<Table>
					<TableCaption>Een lijst van jouw deelnames</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Competitie</TableHead>
							<TableHead className='hidden md:table-cell'>Datum</TableHead>
							<TableHead>Afstand</TableHead>
							<TableHead className='hidden md:table-cell'>
								Afstands Categorie
							</TableHead>
							<TableHead>Start Tijd</TableHead>
							<TableHead>Looptijd</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{participations.map((participation) => {
							const competition = getCompetitionDetails(
								participation.competitionPerCategory?.competitionId
							);
							return (
								<TableRow key={participation.id}>
									<TableCell>{competition?.name ?? 'N/A'}</TableCell>
									<TableCell className='hidden md:table-cell'>
										{competition ? formatDate(competition.date) : 'N/A'}
									</TableCell>
									<TableCell>
										{participation.competitionPerCategory
											?.distanceInKm != null
											? `${participation.competitionPerCategory.distanceInKm} km`
											: 'N/A'}
									</TableCell>
									<TableCell className='hidden md:table-cell'>
										{participation.competitionPerCategory
											?.distanceName ?? 'N/A'}
									</TableCell>
									<TableCell>
										{participation.competitionPerCategory?.gunTime
											? formatTime(
													participation.competitionPerCategory
														.gunTime
											  )
											: 'N/A'}
									</TableCell>
									<TableCell>
										{participation.runTime
											? participation.runTime
											: 'N/A'}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			)}
		</div>
	);
};

export default PersonalRunsTable;
