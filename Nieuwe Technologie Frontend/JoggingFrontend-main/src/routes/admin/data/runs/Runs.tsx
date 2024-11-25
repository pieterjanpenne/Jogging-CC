// import ContestsTable from '@/components/tables/ContestsTable';
import MyCardHeader from '@/components/cards/cardHeaders/CardHeaderForTables';
import { Card, CardContent } from '@/components/ui/card';

export default function Runs() {
	const onAdd = () => {
		console.log('clicked add whatevs');
	};

	return (
		<Card>
			<MyCardHeader
				title='Looptijden'
				description='Voeg toe, pas aan of verwijder looptijden hier.'
				onClick={onAdd}
				toggleSign={"positive"}
			/>
			<CardContent>{/* <ContestsTable /> */}</CardContent>
		</Card>
	);
}
