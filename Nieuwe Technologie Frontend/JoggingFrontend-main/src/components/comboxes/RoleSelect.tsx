'use client';

import * as React from 'react';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

const roles = [
	{
		value: 'Admin',
		label: 'Admin',
	},
	{
		value: 'User',
		label: 'Gebruiker',
	},
];

interface RoleSelectProps {
	value: 'Admin' | 'User';
	onChange: (value: 'Admin' | 'User') => void;
}

const RoleSelect: React.FC<RoleSelectProps> = ({ value, onChange }) => {
	return (
		<Select
			onValueChange={(value) => onChange(value as 'Admin' | 'User')}
			value={value}
		>
			<SelectTrigger className='w-[200px]'>
				<SelectValue placeholder='Selecteer rol' />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Rollen</SelectLabel>
					{roles.map((role) => (
						<SelectItem key={role.value} value={role.value}>
							{role.label}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};

export default RoleSelect;
