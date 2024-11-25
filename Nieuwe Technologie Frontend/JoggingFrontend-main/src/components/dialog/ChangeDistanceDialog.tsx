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
import { updateCompetitionCategory } from '@/services/RegistrationService';
import {Icons} from "@/lib/Icons.tsx";

interface ChangeDistanceDialogProps {
	competition: Competition;
	registrationId: number;
	currentDistance?: string | null;
	onUpdate: () => void;
	isOpen: boolean;
	onClose: () => void;
}

const ChangeDistanceDialog: React.FC<ChangeDistanceDialogProps> = ({
	competition,
	registrationId,
	currentDistance,
	onUpdate,
	isOpen,
	onClose,
}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [selectedDistance, setSelectedDistance] = React.useState<
		string | undefined
	>(currentDistance || undefined);

	const handleSave = async () => {
		if (selectedDistance) {
			setIsLoading(true);
			try {
				await updateCompetitionCategory(registrationId, {
					distanceName: selectedDistance,
				});
				onUpdate();
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
				<Button disabled={isLoading || selectedDistance == currentDistance} onClick={handleSave}>
					{isLoading && <Icons.spinner className='w-4 h-4 mr-2 animate-spin'/>}Opslaan
				</Button>
			</DialogContent>
		</Dialog>
	);
};

export default ChangeDistanceDialog;
