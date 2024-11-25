import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import PersonForm from '../forms/personForm/PersonForm';

interface ChangePersonInformationDialogProps {
	personId?: number;
	onUpdate: () => void;
	isOpen: boolean;
	onClose: () => void;
	refreshData: () => void;
}

const ChangePersonInformationDialog: React.FC<
	ChangePersonInformationDialogProps
> = ({ personId, onUpdate, isOpen, onClose, refreshData }) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='w-full max-h-screen'>
				<PersonForm
					id={personId}
					onClose={onClose}
					onUpdate={onUpdate}
					refreshData={refreshData}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default ChangePersonInformationDialog;
