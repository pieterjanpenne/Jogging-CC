// CompetitionResultsPage.tsx
import CompetitionResultsTables from '@/components/tables/CompetitionResultsTables/CompetitionResultsTables';
import React from 'react';
import { useParams } from 'react-router-dom';

const Results: React.FC = () => {
	const { id } = useParams<{ id: string }>();

	if (!id) {
		return <div>Error: No competition ID provided</div>;
	}

	return (
		<>
			<CompetitionResultsTables competitionId={parseInt(id, 10)} />
		</>
	);
};

export default Results;
