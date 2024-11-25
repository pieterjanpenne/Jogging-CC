import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { deleteRegistrationWithRegistrationID } from '@/services/RegistrationService';

interface VerwijderInschrijvingDialogProps {
	registrationId: string;
	onUpdate: () => void;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}

const VerwijderInschrijvingDialog: React.FC<
	VerwijderInschrijvingDialogProps
> = ({ registrationId, onUpdate, isOpen, onOpenChange }) => {
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		setIsDeleting(true);

		try {
			const registrationIdAsNumber = Number(registrationId);
			const success = await deleteRegistrationWithRegistrationID(
				registrationIdAsNumber
			);

			toast.success('Inschrijving succesvol verwijderd');
			onUpdate();
			onOpenChange(false);
		} catch (error: any) {
			toast.error(
				`Er is een fout opgetreden bij het verwijderen van de Inschrijving`
			);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Inschrijving Verwijderen</DialogTitle>
					<DialogDescription>
						Weet je zeker dat je deze inschrijving wilt verwijderen? Deze actie
						kan niet ongedaan worden gemaakt.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant='outline' onClick={() => onOpenChange(false)}>
						Annuleren
					</Button>
					<Button
						variant='destructive'
						onClick={handleDelete}
						disabled={isDeleting}
					>
						{isDeleting ? 'Bezig met verwijderen...' : 'Verwijder'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default VerwijderInschrijvingDialog;
