import CompetitionResultsTables from '@/components/tables/CompetitionResultsTables/CompetitionResultsTablesWithProps';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCompetition } from '@/services/CompetitionService';

type AgeCategory = '-35' | '-45' | '-55' | '55+' | '-16' | 'all';
type Gender = 'M' | 'V';

const AllResults: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [distances, setDistances] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	if (!id) {
		return <div>Error: No competition ID provided</div>;
	}

	const competitionId = parseInt(id, 10);
	const genders: Gender[] = ['M', 'V'];
	const ageCategories: AgeCategory[] = ['-35', '-45', '-55', '55+'];

	useEffect(() => {
		const fetchCompetitionData = async () => {
			setLoading(true);
			setError(null);
			try {
				const competitionData = await fetchCompetition(competitionId);
				const competitionDistances = Object.keys(competitionData.distances);
				setDistances(competitionDistances);
			} catch (error) {
				setError('Failed to fetch competition data');
			} finally {
				setLoading(false);
			}
		};

		fetchCompetitionData();
	}, [competitionId]);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<>
			{genders.map((gender) =>
				ageCategories.map((ageCategory) =>
					distances.map((distance) => (
						<CompetitionResultsTables
							key={`${gender}-${ageCategory}-${distance}`}
							competitionId={competitionId}
							gender={gender}
							ageCategory={ageCategory}
							distance={distance}
						/>
					))
				)
			)}
		</>
	);
};

export default AllResults;
