import React, { useEffect, useState } from 'react';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHeader,
	TableHead,
	TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/routes/auth/context/AuthProvider';
import { Registration, Competition } from '@/types';
import { fetchPersonalRegistrations } from '@/services/RegistrationService';
import { fetchCompetition } from '@/services/CompetitionService';
import { formatDate } from '@/utils/dateUtils';
import UitschrijvenDialog from '@/components/dialog/UitschrijvenDialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import BetaalDialog from '@/components/dialog/BetaalDialogProps';

const PersonalRegistrationTable: React.FC = () => {
	const { user } = useAuth();
	const [registrations, setRegistrations] = useState<Registration[]>([]);
	const [competitions, setCompetitions] = useState<{
		[key: number]: Competition;
	}>({});
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [isPaymentDialogOpen, setIsPaymentDialogOpen] =
		useState<boolean>(false);
	const [selectedCompetitionID, setSelectedCompetitionID] = useState<
		number | null
	>(null);
	const [isUitschrijvenDialogOpen, setIsUitschrijvenDialogOpen] =
		useState<boolean>(false);
	const [
		selectedUitschrijvenCompetitionID,
		setSelectedUitschrijvenCompetitionID,
	] = useState<number | null>(null);

	useEffect(() => {
		const loadRegistrations = async () => {
			try {
				const params = { PageNumber: 0, PageSize: 1000 };
				const { data: fetchedRegistrations } = await fetchPersonalRegistrations(
					params
				);

				const competitionIds = [
					...new Set(
						fetchedRegistrations
							.map((r) => r.competitionId)
							.filter((id): id is number => id !== undefined)
					),
				];
				const fetchedCompetitions: { [key: number]: Competition } = {};

				await Promise.all(
					competitionIds.map(async (id) => {
						if (id !== undefined) {
							const competition = await fetchCompetition(id);
							fetchedCompetitions[id] = competition;
						}
					})
				);

				setRegistrations(fetchedRegistrations);
				setCompetitions(fetchedCompetitions);
			} catch (error) {
				setError('Failed to fetch registrations or competitions');
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		if (user) {
			loadRegistrations();
		}
	}, [user]);

	const handleUpdate = async () => {
		try {
			const params = { PageNumber: 0, PageSize: 1000 }; // Adjust params as needed
			const { data: updatedRegistrations } = await fetchPersonalRegistrations(
				params
			);
			setRegistrations(updatedRegistrations);
		} catch (error) {
			setError('Failed to update registrations');
			console.error(error);
		}
	};

	const handleOpenPaymentDialog = (competitionID: number) => {
		setSelectedCompetitionID(competitionID);
		setIsPaymentDialogOpen(true);
	};

	const handleClosePaymentDialog = () => {
		setIsPaymentDialogOpen(false);
		setSelectedCompetitionID(null);
	};

	const handleOpenUitschrijvenDialog = (competitionID: number) => {
		setSelectedUitschrijvenCompetitionID(competitionID);
		setIsUitschrijvenDialogOpen(true);
	};

	const handleCloseUitschrijvenDialog = () => {
		setIsUitschrijvenDialogOpen(false);
		setSelectedUitschrijvenCompetitionID(null);
	};

	if (loading) {
		return <p>Loading...</p>;
	}

	if (registrations.length === 0 || error) {
		return (
			<p className='flex justify-center w-full text-base font-normal'>
				Er zijn nog geen registraties.
			</p>
		);
	}

	return (
		<>
			<Table>
				<TableCaption>Een lijst van jouw inschrijvingen</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Wedstrijd</TableHead>
						<TableHead className='hidden md:table-cell'>Datum</TableHead>
						<TableHead>Afstand</TableHead>
						<TableHead className='hidden md:table-cell'>
							Afstands Categorie
						</TableHead>
						<TableHead>Betaald</TableHead>
						<TableHead></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{registrations.map((registration) => {
						const competitionId = registration.competitionId;
						if (competitionId === undefined) {
							return (
								<TableRow key={registration.id}>
									<TableCell>Loading...</TableCell>
									<TableCell className='hidden md:table-cell'>
										Loading...
									</TableCell>
									<TableCell>Loading...</TableCell>
									<TableCell className='hidden md:table-cell'>
										Loading...
									</TableCell>
									<TableCell>Loading...</TableCell>
									<TableCell></TableCell>
								</TableRow>
							);
						}
						const competition = competitions[competitionId];
						return (
							<TableRow key={registration.id}>
								<TableCell>
									{competition ? competition.name : 'Loading...'}
								</TableCell>
								<TableCell className='hidden md:table-cell'>
									{competition ? formatDate(competition.date) : 'Loading...'}
								</TableCell>
								<TableCell>
									{registration.competitionPerCategory?.distanceInKm ??
										'Unknown'}{' '}
									km
								</TableCell>
								<TableCell className='hidden md:table-cell'>
									{registration.competitionPerCategory?.distanceName ??
										'Unknown'}
								</TableCell>
								<TableCell>
									{registration.paid ? 'Betaald' : 'Nog te betalen'}
								</TableCell>
								<TableCell>
									{!registration.paid && (
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant='ghost'>
													<svg
														width='15'
														height='15'
														viewBox='0 0 15 15'
														fill='none'
														xmlns='http://www.w3.org/2000/svg'
													>
														<path
															d='M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z'
															fill='currentColor'
															fillRule='evenodd'
															clipRule='evenodd'
														></path>
													</svg>
												</Button>
											</DropdownMenuTrigger>

											<DropdownMenuContent className='w-56'>
												<DropdownMenuGroup>
													<DropdownMenuItem
														onSelect={() =>
															handleOpenPaymentDialog(competition?.id ?? 0)
														}
													>
														Betalen
													</DropdownMenuItem>
													<DropdownMenuItem
														onSelect={() =>
															handleOpenUitschrijvenDialog(competition?.id ?? 0)
														}
													>
														Uitschrijven
													</DropdownMenuItem>
												</DropdownMenuGroup>
											</DropdownMenuContent>
										</DropdownMenu>
									)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>

			{selectedCompetitionID !== null && (
				<BetaalDialog
					competitionID={selectedCompetitionID}
					amountInCents={500}
					isOpen={isPaymentDialogOpen}
					onOpenChange={handleClosePaymentDialog}
				/>
			)}

			{selectedUitschrijvenCompetitionID !== null && (
				<UitschrijvenDialog
					competitionID={selectedUitschrijvenCompetitionID}
					onUpdate={handleUpdate}
					isOpen={isUitschrijvenDialogOpen}
					onOpenChange={handleCloseUitschrijvenDialog}
				/>
			)}
		</>
	);
};

export default PersonalRegistrationTable;
