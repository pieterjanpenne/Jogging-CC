import React from 'react';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Result } from '@/types';
import { removeMilliseconds } from '@/utils/dateUtils';

interface ResultsTableProps {
	results: Result[];
	title: string;
}

const ageCategoryMapping = (ageCategory?: string) => {
	switch (ageCategory) {
		case 'all':
			return 'All';
		case '-16':
			return '-16';
		case '-35':
			return '-35';
		case '-45':
			return '-45';
		case '-55':
			return '-55';
		case '55+':
			return '55+';
		default:
			return 'N/A'; // default case to handle any unexpected or undefined values
	}
};

const ResultsTable: React.FC<ResultsTableProps> = ({ results, title }) => {
	return (
		<div className='h-full p-3 border'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className='text-center'>Positie</TableHead>
						<TableHead className='text-center'>Loopnummer</TableHead>
						<TableHead className='text-center'>Deelnemer</TableHead>
						<TableHead className='text-center'>Leeftijdsgroep</TableHead>
						<TableHead className='text-center'>Gender</TableHead>
						<TableHead className='text-center'>Woonplaats</TableHead>
						<TableHead className='text-center'>Looptijd</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{results.length > 0 ? (
						results.map((result, index) => (
							<TableRow key={result.personId} className='h-fit'>
								<TableCell>{index + 1}</TableCell>
								<TableCell>{result.runNumber}</TableCell>
								<TableCell>
									{result.person.firstName} {result.person.lastName}
								</TableCell>
								<TableCell>
									{ageCategoryMapping(
										result.competitionPerCategory?.ageCategory.name
									)}
								</TableCell>
								<TableCell>{result.person.gender.toUpperCase()}</TableCell>
								<TableCell>{result.person.address?.city}</TableCell>
								<TableCell>
									{removeMilliseconds(
										result.runTime ?? '00:00:00'
									)}
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell rowSpan={10} colSpan={7} className='text-center '>
								Er zijn nog geen resultaten.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
};

export default ResultsTable;
