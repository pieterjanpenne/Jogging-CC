import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface SearchParticipantsProps {
	onSearch: (name: string, lastName: string) => void;
}

const SearchParticipants: React.FC<SearchParticipantsProps> = ({
	onSearch,
}) => {
	const [name, setName] = useState('');
	const [lastName, setLastName] = useState('');

	useEffect(() => {
		onSearch(name, lastName);
	}, [name, lastName, onSearch]);

	return (
		<div className='flex items-center w-full max-w-sm space-x-2'>
			<Input
				type='text'
				placeholder='Voornaam'
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<Input
				type='text'
				placeholder='Achternaam'
				value={lastName}
				onChange={(e) => setLastName(e.target.value)}
			/>
		</div>
	);
};

export default SearchParticipants;
