import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCompetition } from '@/services/CompetitionService';
import { formatDate } from '@/utils/dateUtils';
import { Competition, Registration } from '@/types';
import SimpleNavBar from '@/components/nav/SimpleNavBar';
import Footer from '@/components/footer/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '../auth/context/AuthProvider';
import { DistanceSelect } from '@/components/select/DistanceSelect';
import {
	createRegistration,
	fetchPersonalRegistrations,
	deleteRegistration,
} from '@/services/RegistrationService';
import { toast } from 'sonner';
import { formatAddress } from '@/utils/addressUtils';
import CompetitionResults from '@/components/cards/CompetitionResults';
import { DaginschrijvingDialog } from '@/components/dialog/DaginschrijvingDialog';
import Linkify from 'linkify-react';
import BetaalDialog from '@/components/dialog/BetaalDialogProps';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import ChangeDistanceDialog from '@/components/dialog/ChangeDistanceDialog';

const Wedstrijd = () => {
	const [competition, setCompetition] = useState<Competition | null>(null);
	const [registration, setRegistration] = useState<Registration | null>(null);
	const [isPaymentDialogOpen, setIsPaymentDialogOpen] =
		useState<boolean>(false);
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const [selectedCategory, setSelectedCategory] = useState<string>('');
	const [isChanging, setIsChanging] = useState<boolean>(false);
	const [imageSrc, setImageSrc] = useState<string | null>(null);
	const [isDistanceDialogOpen, setIsDistanceDialogOpen] =
		useState<boolean>(false);

	// Fetch competition details and image
	useEffect(() => {
		window.scrollTo(0, 0);

		const fetchContestDetailsAndImage = async () => {
			if (!id) {
				navigate('/');
				return;
			}

			const numericId = parseInt(id, 10);

			try {
				const response = await fetchCompetition(numericId);
				if (!response) {
					console.error('No competition found with id:', numericId);
					navigate('/');
					return;
				}
				setCompetition(response);

				// Load the image
				try {
					const image = await import(
						`../../assets/images/competitions/competition_${id}.png`
					);
					setImageSrc(image.default);
				} catch (error) {
					const fallbackImage = await import(
						'../../assets/images/logo-goud.png'
					);
					setImageSrc(fallbackImage.default);
				}
			} catch (error) {
				console.error('Failed to fetch contest details:', error);
				navigate('/');
			}
		};

		fetchContestDetailsAndImage();
	}, [id, navigate]);

	// Fetch registration status
	const fetchRegistrationStatus = async () => {
		if (user && competition) {
			try {
				const params = { PageSize: 1000 };
				const { data: registrations } = await fetchPersonalRegistrations(
					params
				);
				const userRegistration = registrations.find(
					(reg) => reg.competitionId === competition.id
				);
				setRegistration(userRegistration || null); // Set to null if no registration found
			} catch (error) {
				console.error('Failed to fetch registration status:', error);
			}
		}
	};

	useEffect(() => {
		fetchRegistrationStatus();
	}, [user, competition]);

	const handleCategoryChange = (newValue: string) => {
		setSelectedCategory(newValue);
	};

	const handleRegistration = async () => {
		if (!selectedCategory) {
			toast.error('Selecteer een afstand om te registreren.');
			return;
		}

		if (competition) {
			setIsChanging(true);
			try {
				const registrationData = {
					distanceName: selectedCategory,
					competitionId: competition.id,
				};
				const registrationResponse = await createRegistration(registrationData);
				console.log('Registration successful:', registrationResponse);
				toast.success('Registratie voltooid! Bedankt voor uw inschrijving.');
				setRegistration(registrationResponse);

				// Show payment dialog
				setIsPaymentDialogOpen(true);
			} catch (error) {
				console.error('Registration failed:', error);
				toast.error('Registratie mislukt. Probeer het opnieuw.');
			} finally {
				setIsChanging(false);
			}
		}
	};

	const handleDeregistration = async () => {
		setIsChanging(true);
		if (competition) {
			try {
				await deleteRegistration(competition.id);
				toast.success('Uitschrijving voltooid.');
				setRegistration(null);
			} catch (error) {
				console.error('Failed to delete registration:', error);
				toast.error('Uitschrijving mislukt. Probeer het opnieuw.');
			} finally {
				setIsChanging(false);
			}
		}
	};

	const handlePayment = () => {
		setIsPaymentDialogOpen(true);
	};

	const isPast = (competitionDate: Date) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		competitionDate.setHours(0, 0, 0, 0);
		return competitionDate < today;
	};

	const hasPassed = competition ? isPast(new Date(competition.date)) : false;
	const isToday = competition
		? isSameDay(new Date(competition.date), new Date())
		: false;

	return (
		<>
			<div className='flex flex-col items-center w-full '>
				<SimpleNavBar />
				<div className='flex flex-col items-center justify-center w-full mt-24 space-y-6 md:space-y-0 md:max-w-3xl md:px-6 lg:max-w-5xl md:justify-evenly md:flex-row md:space-x-0'>
					<div>
						{imageSrc && (
							<img
								className='object-contain border border-gray-300 shadow-xl dark:border-gray-900 rounded-3xl w-80 h-80 '
								src={imageSrc}
								alt='image of contest'
							/>
						)}
					</div>
					<div className='flex flex-col items-center justify-center px-3 py-3 space-y-3 md:px-0 md:w-2/3'>
						<h1 className='text-5xl font-semibold text-center lg:text-6xl'>
							{competition && competition.name}
						</h1>
						<h2 className='text-3xl text-center'>
							{competition && formatDate(competition.date)}
						</h2>
						{user && (!hasPassed || isToday) ? (
							<div className='flex flex-col items-center space-y-3'>
								{registration ? (
									<>
										{!registration.paid ? (
											<>
												<div className='flex flex-col items-center gap-3'>
													<p>
														U heeft zich ingeschreven voor de{' '}
														{registration.competitionPerCategory?.distanceInKm}
														km.
													</p>
													<div className='flex flex-col items-center justify-center gap-1'>
														<Button
															onClick={() => setIsDistanceDialogOpen(true)}
															disabled={isChanging}
															className='w-full'
														>
															Afstand Aanpassen
														</Button>
														<div className='flex gap-1'>
															<Button
																onClick={handlePayment}
																disabled={isChanging}
																className='w-1/2'
															>
																Betalen
															</Button>
															<Button
																onClick={handleDeregistration}
																disabled={isChanging}
																className='w-1/2'
															>
																Uitschrijven
															</Button>
														</div>
													</div>
												</div>
											</>
										) : (
											<div className='flex flex-col items-center space-y-3'>
												<p>
													U heeft zich ingeschreven en betaald voor de{' '}
													{registration.competitionPerCategory?.distanceInKm}km.
												</p>
												<div className='flex flex-col items-center justify-center space-y-1 md:flex-row md:space-x-1 md:space-y-0 md:items-start md:justify-start'>
													<Button
														onClick={() => setIsDistanceDialogOpen(true)}
														disabled={isChanging}
														className='w-full'
													>Afstand Aanpassen
													</Button>
												</div>
											</div>
										)}
									</>
								) : (
									<div className='flex space-x-3'>
										<DistanceSelect
											distances={competition?.distances || {}}
											onChange={handleCategoryChange}
										/>
										<Button
											onClick={handleRegistration}
											disabled={isChanging || (hasPassed && !isToday)}
										>
											{hasPassed && !isToday
												? 'Registratie Gesloten'
												: 'Inschrijven'}
										</Button>
									</div>
								)}
							</div>
						) : hasPassed && !isToday ? null : (
							<Button onClick={() => navigate('/auth/login')}>
								Log in om je in te schrijven.
							</Button>
						)}
						{!user && isToday && (
							<div className='flex flex-col items-center justify-center gap-3'>
								<p>of</p>
								<DaginschrijvingDialog />
							</div>
						)}
					</div>
				</div>

				<div className='flex flex-col items-center justify-center w-full px-3 mt-6 mb-3 space-y-6 md:px-6 md:space-y-0 md:max-w-3xl lg:max-w-5xl md:justify-evenly md:flex-row md:space-x-0'>
					<div className='flex flex-col w-full p-6 border shadow-lg rounded-xl bg-slate-50 dark:bg-slate-950'>
						<h1 className='w-full mb-4 text-3xl font-bold text-center '>
							Praktische informatie
						</h1>
						<div className='flex flex-col gap-3 md:flex-row'>
							<div className='text-center md:w-2/3 '>
								<h2 className='text-xl font-bold'>Info</h2>
								{competition?.information ? (
									<p className='text-center whitespace-pre-wrap md:px-12 md:text-start'>
										<Linkify>{competition.information}</Linkify>
									</p>
								) : (
									<p className='flex justify-center w-full'>
										Er is momenteel geen extra informatie beschikbaar voor deze
										wedstrijd.
									</p>
								)}
							</div>

							<div className='flex flex-col justify-between gap-3 md:w-1/3'>
								<div className='text-center'>
									<h2 className='text-xl font-bold '>Locatie</h2>
									<p>{formatAddress(competition?.address)}</p>
								</div>

								<div className='text-center '>
									<h2 className='pb-1 text-xl font-bold'>Afstanden</h2>
									{competition?.distances && (
										<div className='grid grid-cols-2 gap-2'>
											{Object.entries(competition.distances).map(
												([name, distance]) => (
													<div
														key={name}
														className='flex flex-col items-center justify-center p-2 border rounded-md shadow-md border-slate-300 dark:border-slate-900 bg-slate-200 dark:bg-slate-800'
													>
														<p className='font-semibold'>{name}</p>
														<p>{distance} km</p>
													</div>
												)
											)}
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='flex flex-col items-center w-full mt-6 mb-3 space-y-6 justify-items-center md:mt-0 md:space-y-0 md:max-w-3xl lg:max-w-5xl md:justify-evenly md:flex-row md:space-x-0'>
					{competition ? (
						<CompetitionResults
							competitionId={competition.id}
							competition={competition}
						/>
					) : (
						<></>
					)}
				</div>
			</div>
			<Footer />

			{competition?.id && (
				<BetaalDialog
					competitionID={competition.id}
					amountInCents={500}
					isOpen={isPaymentDialogOpen}
					onOpenChange={setIsPaymentDialogOpen}
				/>
			)}

			{registration && competition && (
				<ChangeDistanceDialog
					competition={competition}
					registrationId={registration.id}
					currentDistance={registration.competitionPerCategory?.distanceName}
					onUpdate={() => {
						setIsDistanceDialogOpen(false);
						fetchRegistrationStatus(); // Refresh registration data
					}}
					isOpen={isDistanceDialogOpen}
					onClose={() => setIsDistanceDialogOpen(false)}
				/>
			)}
		</>
	);
};

export default Wedstrijd;

const isSameDay = (date1: Date, date2: Date) => {
	return (
		date1.getDate() === date2.getDate() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getFullYear() === date2.getFullYear()
	);
};
