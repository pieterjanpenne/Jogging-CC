import React, { useState, useEffect, useCallback } from 'react';
import { fetchRegistrations } from '@/services/RegistrationService';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Registration, Competition } from '@/types';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import ChangePaymentStatusDialog from '@/components/dialog/ChangePaymentStatusDialog';
import ChangePersonInformationDialog from '@/components/dialog/ChangePersonInformationDialog';
import VerwijderInschrijvingDialog from '@/components/dialog/VerwijderInschrijvingDialog';
import ChangePrivateDistanceDialog from '@/components/dialog/ChangePrivateDistanceDialog'; // Import the private dialog
import { Input } from '@/components/ui/input';

interface CompetitionTableProps {
	competitionId: number;
	renderActionButton?: (
		participant: Registration,
		refreshData: () => void
	) => React.ReactNode;
	filterByRunNumber?: boolean;
	showRunTime?: boolean;
	showCategory?: boolean;
	showBirthDate?: boolean;
	refreshKey?: number;
	showActionButton?: boolean;
	showDropdownMenu?: boolean;
	competition: Competition; // Add competition prop here
}

const CompetitionTable: React.FC<CompetitionTableProps> = ({
	competitionId,
	renderActionButton,
	filterByRunNumber = false,
	showRunTime = false,
	showCategory = false,
	showBirthDate = false,
	refreshKey,
	showActionButton = true,
	showDropdownMenu = false,
	competition, // Destructure competition prop
}) => {
	const [participants, setParticipants] = useState<Registration[]>([]);
	const [error, setError] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [selectedParticipantId, setSelectedParticipantId] = useState<
		number | null
	>(null);
	const [isPersonInfoDialogOpen, setIsPersonInfoDialogOpen] =
		useState<boolean>(false);
	const [isPaymentStatusDialogOpen, setIsPaymentStatusDialogOpen] =
		useState<boolean>(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<number | null>(
		null
	);
	const [isDistanceDialogOpen, setIsDistanceDialogOpen] = useState<
		number | null
	>(null); // New state for distance dialog
	const [currentDistance, setCurrentDistance] = useState<string | undefined>(
		undefined
	); // New state for current distance

	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize] = useState(6); // Fixed page size of 6
	const [totalRegistrations, setTotalRegistrations] = useState(0);
	const [searchValue, setSearchValue] = useState<string>(''); // Search value state

	useEffect(() => {
		handleFetch();
	}, [competitionId, filterByRunNumber, refreshKey, currentPage, searchValue]);

	const handleFetch = async () => {
		setLoading(true);
		setError('');
		try {
			const { data, pagination } = await fetchRegistrations({
				competitionId,
				PageNumber: currentPage,
				PageSize: pageSize,
				withRunNumber: filterByRunNumber,
				searchValue: searchValue,
			});
			if (data && data.length > 0) {
				setParticipants(data);
				setTotalRegistrations(pagination.TotalCount);
			} else {
				setParticipants([]);
				setTotalRegistrations(0);
			}
		} catch (error) {
			setError('Failed to fetch participants: ' + error);
		}
		setLoading(false);
	};

	const refreshData = async () => {
		setLoading(true);
		setError('');
		try {
			const { data, pagination } = await fetchRegistrations({
				competitionId,
				PageNumber: currentPage,
				PageSize: pageSize,
				withRunNumber: filterByRunNumber,
				searchValue: searchValue,
			});
			if (data && data.length > 0) {
				setParticipants(data);
				setTotalRegistrations(pagination.TotalCount);
			} else {
				setParticipants([]);
				setTotalRegistrations(0);
			}
		} catch (error) {
			setError('Failed to fetch participants: ' + error);
		}
		setLoading(false);
	};

	const handlePersonInfoOpen = (participantId: number | undefined) => {
		if (participantId) {
			setSelectedParticipantId(participantId);
			setIsPersonInfoDialogOpen(true);
			setIsPaymentStatusDialogOpen(false);
		}
	};

	const handlePaymentStatusOpen = (participantId: number) => {
		setSelectedParticipantId(participantId);
		setIsPaymentStatusDialogOpen(true);
		setIsPersonInfoDialogOpen(false);
	};

	const handleDistanceDialogOpen = (
		participantId: number,
		currentDistance: string | undefined
	) => {
		setSelectedParticipantId(participantId);
		setCurrentDistance(currentDistance);
		setIsDistanceDialogOpen(participantId);
	};

	const handleCloseDialog = () => {
		setIsPersonInfoDialogOpen(false);
		setIsPaymentStatusDialogOpen(false);
	};

	const handleDeleteDialogOpen = (participantId: number) => {
		setIsDeleteDialogOpen(participantId);
	};

	const handleDeleteDialogClose = () => {
		setIsDeleteDialogOpen(null);
		refreshData();
	};

	const handleNextPage = () => {
		setCurrentPage((prevPage) => prevPage + 1);
	};

	const handlePreviousPage = () => {
		setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
	};

	const renderPagination = () => {
		const totalPages = Math.ceil(totalRegistrations / pageSize);
		return (
			<div className='flex items-center justify-between gap-2 mt-4'>
				<Button onClick={handlePreviousPage} disabled={currentPage === 1}>
					Vorige
				</Button>
				<span>
					{currentPage} / {totalPages}
				</span>
				<Button onClick={handleNextPage} disabled={currentPage === totalPages}>
					Volgende
				</Button>
			</div>
		);
	};

	// Debounce function
	const debounce = (func: (...args: any[]) => void, wait: number) => {
		let timeout: ReturnType<typeof setTimeout>;
		return (...args: any[]) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => func(...args), wait);
		};
	};

	const debouncedSearch = useCallback(
		debounce((value: string) => {
			setSearchValue(value);
			setCurrentPage(1); // Reset to first page on search
		}, 500),
		[]
	);

	return (
		<>
			<div className='flex flex-col items-center justify-between gap-3 pb-3 md:flex-row'>
				<Input
					placeholder='Zoek deelnemers...'
					onChange={(e) => debouncedSearch(e.target.value)}
					className='md:max-w-[320px]'
				/>
				<p className='text-sm text-slate-600'>
					Totaal aantal inschrijvingen: {totalRegistrations}
				</p>
			</div>
			{loading ? (
				<p>Loading...</p>
			) : (
				<>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Voornaam</TableHead>
								<TableHead>Achternaam</TableHead>
								{showBirthDate && <TableHead>Geboorte datum</TableHead>}
								{showRunTime && <TableHead>Run Time</TableHead>}
								{showCategory && <TableHead>Categorie</TableHead>}
								<TableHead>Loopnummer</TableHead>
								<TableHead>Betaald</TableHead>
								<TableHead></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{participants.length > 0 ? (
								participants.map((participant) => {
									const { person } = participant;
									return (
										<TableRow key={participant.id}>
											<TableCell>{person?.firstName || 'Loading...'}</TableCell>
											<TableCell>{person?.lastName || 'Loading...'}</TableCell>
											{showBirthDate && (
												<TableCell>
													{person?.birthDate || 'Loading...'}
												</TableCell>
											)}
											{showRunTime && (
												<TableCell>{participant.runTime || 'N/A'}</TableCell>
											)}
											{showCategory && (
												<TableCell>
													{participant.competitionPerCategory?.distanceName ||
														'N/A'}
												</TableCell>
											)}
											<TableCell>{participant.runNumber || 'N/A'}</TableCell>
											<TableCell>{participant.paid ? 'Ja' : 'Nee'}</TableCell>
											<TableCell>
												{showActionButton &&
													renderActionButton &&
													renderActionButton(participant, refreshData)}
											</TableCell>
											{showDropdownMenu && (
												<TableCell key={`dropdown-${participant.id}`}>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant='ghost'>
																<span className='sr-only'>Open menu</span>
																<DotsHorizontalIcon />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align='end'>
															<DropdownMenuLabel>Bewerk</DropdownMenuLabel>
															<DropdownMenuSeparator />
															<DropdownMenuItem
																onSelect={() =>
																	handlePaymentStatusOpen(participant.id)
																}
															>
																Betalingsstatus
															</DropdownMenuItem>
															<DropdownMenuItem
																onSelect={() =>
																	handleDistanceDialogOpen(
																		participant.id,
																		participant.competitionPerCategory
																			?.distanceName
																	)
																}
															>
																Afstand
															</DropdownMenuItem>
															<DropdownMenuItem
																onSelect={() =>
																	handlePersonInfoOpen(person?.id)
																}
															>
																Persoonsgegevens
															</DropdownMenuItem>
															<DropdownMenuSeparator />
															<DropdownMenuItem
																onSelect={() =>
																	handleDeleteDialogOpen(participant.id)
																}
															>
																Uitschrijven
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
													<VerwijderInschrijvingDialog
														registrationId={participant.id.toString()}
														onUpdate={handleDeleteDialogClose}
														isOpen={isDeleteDialogOpen === participant.id}
														onOpenChange={(isOpen) => {
															if (!isOpen) setIsDeleteDialogOpen(null);
														}}
													/>
													<ChangePaymentStatusDialog
														registrationId={participant.id.toString()}
														onUpdate={refreshData}
														isOpen={
															isPaymentStatusDialogOpen &&
															selectedParticipantId === participant.id
														}
														isPayed={participant.paid}
														onClose={handleCloseDialog}
													/>
													<ChangePrivateDistanceDialog
														competition={competition}
														registrationId={participant.id}
														personId={person?.id || 0} // Pass personId prop
														currentDistance={
															participant.competitionPerCategory?.distanceName
														}
														onUpdate={refreshData}
														isOpen={isDistanceDialogOpen === participant.id}
														onClose={() => setIsDistanceDialogOpen(null)}
														refreshData={refreshData}
													/>
												</TableCell>
											)}
										</TableRow>
									);
								})
							) : (
								<TableRow>
									<TableCell colSpan={8} className='text-center'>
										Geen deelnemers gevonden
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
					{renderPagination()}
				</>
			)}
			{selectedParticipantId && (
				<ChangePersonInformationDialog
					personId={selectedParticipantId}
					onUpdate={refreshData}
					isOpen={isPersonInfoDialogOpen}
					onClose={handleCloseDialog}
					refreshData={refreshData}
				/>
			)}
		</>
	);
};

export default CompetitionTable;
