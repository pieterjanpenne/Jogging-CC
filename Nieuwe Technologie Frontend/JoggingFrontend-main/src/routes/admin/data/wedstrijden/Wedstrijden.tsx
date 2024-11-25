import { useState, useCallback } from 'react';
import MyCardHeader from '@/components/cards/cardHeaders/CardHeaderForTables';
import { Card, CardContent } from '@/components/ui/card';
import CompetitionsTable from '@/components/tables/competitionTable/CompetitionsTable';
import CompetitionForm from '@/components/forms/competitionForm/CompetitionForm';
import { Competition } from '@/types';

export default function Wedstrijden() {
	const [open, setOpen] = useState(false);
	const [competition, setCompetition] = useState<Competition | null>(null);

	const handleEditOpen = useCallback((contest: Competition) => {
		setCompetition(contest);
		setOpen(true);
	}, []);

	const toggleOpen = useCallback(() => setOpen((o) => !o), []);

	return (
		<Card>
			{open ? (
				<>
					<MyCardHeader
						title={competition?.id ? 'Bewerk' : 'Voeg toe'}
						onClick={toggleOpen}
						toggleSign='negative'
					/>
					<CardContent>
						<CompetitionForm
							competitionId={competition?.id}
							onClick={toggleOpen}
						/>
					</CardContent>
				</>
			) : (
				<>
					<MyCardHeader
						title='Wedstrijden'
						description='Voeg toe, pas aan of verwijder wedstrijden hier.'
						onClick={() => {
							setOpen(true);
							setCompetition(null);
						}}
						toggleSign='positive'
					/>
					<CardContent>
						<CompetitionsTable onEdit={handleEditOpen} />
					</CardContent>
				</>
			)}
		</Card>
	);
}
