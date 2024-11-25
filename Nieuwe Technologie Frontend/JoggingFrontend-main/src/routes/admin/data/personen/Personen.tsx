import MyCardHeader from '@/components/cards/cardHeaders/CardHeaderForTables';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useCallback, useState } from 'react';
import PersonForm from '@/components/forms/personForm/PersonForm';
import PersonsTable from '@/components/tables/personTable/PersonsTable';
import { Person } from '@/types';

export default function Personen() {
	const [open, setOpen] = useState(false);
	const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

	const handleEditOpen = useCallback((person: Person) => {
		setSelectedPerson(person);
		setOpen(true);
	}, []);

	const toggleOpen = useCallback(() => setOpen((o) => !o), []);

	return (
		<Card>
			{open ? (
				<>
					<MyCardHeader
						title={selectedPerson?.id ? 'Bewerk' : 'Voeg toe'}
						onClick={toggleOpen}
						toggleSign='negative'
					/>
					<CardContent>
						<PersonForm id={selectedPerson?.id} />
					</CardContent>
				</>
			) : (
				<>
					<MyCardHeader
						title='Personen'
						description='Pas aan of verwijder personen hier.'
						onClick={() => {
							setOpen(true);
							setSelectedPerson(null);
						}}
						toggleSign='positive'
						showButton={false}
					/>
					<CardContent>
						<PersonsTable onEdit={handleEditOpen} />
					</CardContent>
				</>
			)}
		</Card>
	);
}
