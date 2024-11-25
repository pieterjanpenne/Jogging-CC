import React, { useEffect, useState, useCallback } from 'react';
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableCell,
} from '@/components/ui/table';
import { fetchPersons } from '@/services/PersonService';
import PersonRow from './PersonRow';
import { Person } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PersonTableProps {
	onEdit: (person: Person) => void;
}

const PersonsTable: React.FC<PersonTableProps> = ({ onEdit }) => {
	const [persons, setPersons] = useState<Person[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(0);
	const [pageSize, setPageSize] = useState(6);
	const [totalPages, setTotalPages] = useState(0);
	const [searchValue, setSearchValue] = useState<string>('');

	const loadPersons = useCallback(async () => {
		try {
			const response = await fetchPersons({
				pageNumber: currentPage + 1,
				pageSize,
				searchValue,
			});
			setPersons(response.data);
			setTotalPages(Math.ceil(response.total / pageSize));
			setError(null);
		} catch (error: any) {
			if(error.response.status === 404) {
				setPersons([]);
				setTotalPages(0);
				setError(`Geen personen gevonden met naam ${searchValue}.`);
			} else {
				setError('Failed to load persons. Please try again.');
			}
			console.error('Failed to fetch persons', error);
		}
	}, [currentPage, pageSize, searchValue]);

	useEffect(() => {
		loadPersons();
	}, [loadPersons]);

	const handlePreviousPage = () => {
		setCurrentPage((currentPage) => Math.max(0, currentPage - 1));
	};

	const handleNextPage = () => {
		setCurrentPage((currentPage) => Math.min(totalPages - 1, currentPage + 1));
	};

	const debounce = (func: (...args: any[]) => void, wait: number) => {
		let timeout: ReturnType<typeof setTimeout>;
		return (...args: any[]) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => func(...args), wait);
		};
	};

	const debouncedSearch = useCallback(
		debounce((value: string) => {
			setSearchValue(value);
			setCurrentPage(0); // Reset to first page on search
		}, 500),
		[]
	);

	return (
		<>
			<div className='flex flex-col items-center justify-between gap-3 pb-3 md:flex-row'>
				<Input
					placeholder='Zoek personen...'
					onChange={(e) => debouncedSearch(e.target.value)}
				/>
			</div>
			{error && (
				<div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
			)}
			<Table>
				<TableHeader>
					<TableRow>
						<TableCell>Voornaam</TableCell>
						<TableCell>Achternaam</TableCell>
						<TableCell>E-mail</TableCell>
						<TableCell>Geboortedatum</TableCell>
						<TableCell>Acties</TableCell>
					</TableRow>
				</TableHeader>
				<TableBody>
					{persons.map((person) => (
						<PersonRow
							key={person.id}
							person={person}
							refreshPersons={loadPersons}
							onEdit={onEdit}
						/>
					))}
				</TableBody>
			</Table>
			<div className='flex items-center justify-between gap-2 mt-4'>
				<Button disabled={currentPage <= 0} onClick={handlePreviousPage}>
					Vorige
				</Button>
				<span>
					{persons.length > 0 ? currentPage + 1 : 0} / {totalPages}
				</span>
				<Button
					disabled={currentPage >= totalPages - 1}
					onClick={handleNextPage}
				>
					Volgende
				</Button>
			</div>
		</>
	);
};

export default PersonsTable;
