'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { updateRole } from '@/services/ProfileService';
import RoleSelect from '../comboxes/RoleSelect';

interface ChangeRoleDialogProps {
	personId: number;
	personName: string;
	initialRole: 'Admin' | 'User';
	isDialogOpen: boolean;
	setDialogOpen: (open: boolean) => void;
	onRoleUpdated: () => void;
}

const ChangeRoleDialog: React.FC<ChangeRoleDialogProps> = ({
	personId,
	personName,
	initialRole,
	isDialogOpen,
	setDialogOpen,
	onRoleUpdated,
}) => {
	const [selectedRole, setSelectedRole] = useState<'Admin' | 'User'>(
		initialRole
	);

	const handleRoleChange = async () => {
		try {
			await updateRole({ id: personId, role: selectedRole });
			toast.success('Rol succesvol bijgewerkt');
			setDialogOpen(false);
			onRoleUpdated();
		} catch (error) {
			toast.error('Fout bij het bijwerken van de rol');
			console.error(error);
		}
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Verander rol</DialogTitle>
					<DialogDescription>
						Selecteer een nieuwe rol voor {personName}.
					</DialogDescription>
				</DialogHeader>
				<div className='flex justify-center gap-4 py-4'>
					<RoleSelect value={selectedRole} onChange={setSelectedRole} />
				</div>
				<DialogFooter>
					<Button variant='outline' onClick={() => setDialogOpen(false)}>
						Annuleer
					</Button>
					<Button type='submit' onClick={handleRoleChange}>
						Opslaan
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ChangeRoleDialog;
