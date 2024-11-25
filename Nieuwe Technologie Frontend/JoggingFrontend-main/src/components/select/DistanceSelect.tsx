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

interface CategorySelectProps {
	distances: Record<string, number>;
	onChange: (value: string) => void;
	selectedValue?: string;
}

export function DistanceSelect({ distances, onChange, selectedValue }: CategorySelectProps) {
	const [selected, setSelected] = React.useState<string | undefined>(selectedValue);
	const distanceNames = Object.keys(distances);

	const handleSelectionChange = (value: string) => {
		setSelected(value);
		onChange(value);
	};

	return (
		<Select value={selected} onValueChange={handleSelectionChange}>
			<SelectTrigger className='w-[160px]'>
				<SelectValue placeholder='Selecteer afstand' />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Afstanden</SelectLabel>
					{distanceNames.map((distanceName) => (
						<SelectItem key={distanceName} value={distanceName}>
							{distanceName} ({distances[distanceName]} km)
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
