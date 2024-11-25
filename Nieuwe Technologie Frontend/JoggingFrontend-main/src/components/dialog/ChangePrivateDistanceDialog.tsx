import React, {useState} from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Competition } from '@/types';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from '@/components/ui/select';
import { updatePrivateCompetitionCategory } from '@/services/RegistrationService';
import {Icons} from "@/lib/Icons.tsx";

interface ChangePrivateDistanceDialogProps {
	competition: Competition;
	registrationId: number;
	personId: number; // Add personId prop here
	currentDistance?: string | null;
	onUpdate: () => void;
	isOpen: boolean;
	onClose: () => void;
	refreshData: () => void;
}

const ChangePrivateDistanceDialog: React.FC<
	ChangePrivateDistanceDialogProps
> = ({
	competition,
	registrationId,
	personId, // Destructure personId prop
	currentDistance,
	onUpdate,
	isOpen,
	onClose,
	refreshData,
}) => {
	const [selectedDistance, setSelectedDistance] = React.useState<string | undefined>(currentDistance || undefined);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSave = async () => {
		if (selectedDistance) {
			setIsLoading(true);
			try {
				await updatePrivateCompetitionCategory(registrationId, personId, {
					distanceName: selectedDistance,
				});
				onUpdate();
				refreshData();
				onClose();
			} catch (error) {
				console.error('Failed to update distance:', error);
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Afstand Wijzigen</DialogTitle>
					<DialogDescription>
						Selecteer een nieuwe afstand voor uw inschrijving.
					</DialogDescription>
				</DialogHeader>
				<Select
					onValueChange={(value) => setSelectedDistance(value)}
					value={selectedDistance}
				>
					<SelectTrigger>
						<SelectValue placeholder='Selecteer Afstand' />
					</SelectTrigger>
					<SelectContent>
						{Object.entries(competition.distances).map(([name, distance]) => (
							<SelectItem key={name} value={name}>
								{name} ({distance} km)
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Button disabled={isLoading || currentDistance == selectedDistance} onClick={handleSave}>
					{isLoading && <Icons.spinner className='w-4 h-4 mr-2 animate-spin'/>}Opslaan
				</Button>
			</DialogContent>
		</Dialog>
	);
};

export default ChangePrivateDistanceDialog;
