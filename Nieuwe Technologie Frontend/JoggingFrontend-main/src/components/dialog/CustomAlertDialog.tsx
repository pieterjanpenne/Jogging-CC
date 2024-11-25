import React, { ReactNode } from 'react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CustomAlertDialogProps {
	title: string;
	description: string;
	cancelButtonLabel: string;
	actionButtonLabel: string;
	onAction: () => void;
	open: boolean;
	setOpen: (open: boolean) => void;
}

const CustomAlertDialog: React.FC<CustomAlertDialogProps> = ({
	title,
	description,
	cancelButtonLabel,
	actionButtonLabel,
	onAction,
	open,
	setOpen,
}) => {
	const handleAction = () => {
		onAction();
		setOpen(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription>{description}</AlertDialogDescription>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => setOpen(false)}>
						{cancelButtonLabel}
					</AlertDialogCancel>
					<AlertDialogAction onClick={handleAction}>
						{actionButtonLabel}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default CustomAlertDialog;
