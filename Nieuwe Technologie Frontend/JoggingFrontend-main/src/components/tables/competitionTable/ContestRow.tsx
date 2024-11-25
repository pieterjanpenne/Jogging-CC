import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { deleteCompetition } from '@/services/CompetitionService';
import { toast } from 'sonner';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { formatDate } from '@/utils/dateUtils';
import { Competition } from '@/types';
import CustomAlertDialog from '@/components/dialog/CustomAlertDialog';

interface ContestRowProps {
	contest: Competition;
	refreshContests: () => void;
	onEdit: (contest: Competition) => void;
}

const ContestRow: React.FC<ContestRowProps> = ({
	contest,
	refreshContests,
	onEdit,
}) => {
	const [isDialogOpen, setDialogOpen] = useState(false);

	const handleDelete = async () => {
		try {
			await deleteCompetition(contest.id);
			toast.success('Wedstrijd verwijderd');
			refreshContests();
		} catch (error) {
			toast.error('Failed to delete competition');
			console.error(error);
		}
		setDialogOpen(false); // Close the dialog regardless of the outcome
	};

	const handleEdit = () => {
		onEdit(contest);
	};

	return (
		<TableRow>
			<TableCell>{contest.name}</TableCell>
			<TableCell>{formatDate(contest.date)}</TableCell>
			<TableCell>{contest.active ? 'Actief' : 'Inactief'}</TableCell>
			<TableCell>{contest.rankingActive ? 'Actief' : 'Inactief'}</TableCell>
			<TableCell>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost'>
							<span className='sr-only'>Open menu</span>
							<DotsHorizontalIcon />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem onClick={handleEdit}>Bewerk</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setDialogOpen(true)}>
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
					<CustomAlertDialog
						title='Bevestig Verwijdering'
						description='Weet u zeker dat u deze wedstrijd wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.'
						cancelButtonLabel='Cancel'
						actionButtonLabel='Delete'
						onAction={handleDelete}
						open={isDialogOpen}
						setOpen={setDialogOpen}
					/>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
};

export default ContestRow;
