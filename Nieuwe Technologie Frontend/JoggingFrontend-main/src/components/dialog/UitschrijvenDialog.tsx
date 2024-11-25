import React, { useState, useEffect } from 'react';
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
import { deleteRegistration } from '@/services/RegistrationService';

interface UitschrijvenDialogProps {
	competitionID: number;
	onUpdate: () => void;
	onOpenChange?: (isOpen: boolean) => void;
	isOpen?: boolean; // Accepts isOpen prop to control dialog from parent
}

const UitschrijvenDialog: React.FC<UitschrijvenDialogProps> = ({
	competitionID,
	onUpdate,
	onOpenChange,
	isOpen: isOpenProp = false, // Default to false if not provided
}) => {
	const [isDeleting, setIsDeleting] = useState(false);
	const [isOpen, setIsOpen] = useState(isOpenProp);

	useEffect(() => {
		setIsOpen(isOpenProp);
	}, [isOpenProp]);

	const handleDelete = async () => {
		setIsDeleting(true);

		try {
			const success = await deleteRegistration(competitionID);

			toast.success('Uitschrijven succesvol');
			onUpdate();
			setIsOpen(false);
			if (onOpenChange) {
				onOpenChange(false);
			}
		} catch (error: any) {
			toast.error(`Er is een fout opgetreden bij het uitschrijven`);
		} finally {
			setIsDeleting(false);
		}
	};

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (onOpenChange) {
			onOpenChange(open);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Uitschrijven</DialogTitle>
					<DialogDescription>
						Weet je zeker dat je jezelf wilt uitschrijven?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant='outline' onClick={() => handleOpenChange(false)}>
						Annuleren
					</Button>
					<Button
						variant='destructive'
						onClick={handleDelete}
						disabled={isDeleting}
					>
						{isDeleting ? 'Bezig met Uitschrijven...' : 'Uitschrijven'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default UitschrijvenDialog;
