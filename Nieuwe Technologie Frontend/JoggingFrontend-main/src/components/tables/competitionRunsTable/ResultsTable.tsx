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
	addTimes: (runTime: string, gunTime: string | null) => string;
}

const ResultsTable: React.FC<ResultsTableProps> = ({
	results,
	title
}) => {
	return (
		<div className='p-3 border shadow-md rounded-xl'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className='text-center'>Positie</TableHead>
						<TableHead className='text-center'>Deelnemer</TableHead>
						<TableHead className='text-center'>Woonplaats</TableHead>
						<TableHead className='text-center'>Tijd</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{results.length > 0 ? (
						results.map((result, index) => (
							<TableRow key={result.personId}>
								<TableCell>{index + 1}</TableCell>
								<TableCell>
									{result.person.firstName} {result.person.lastName}
								</TableCell>
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
							<TableCell colSpan={4} className='text-center '>
								Er zijn nog geen resultaten.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
				<TableCaption>{title.toLowerCase()}</TableCaption>
			</Table>
		</div>
	);
};

export default ResultsTable;
