import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { RegistrationForm } from '@/components/forms/registrationForm/RegistrationForm';
import SimpleNavBar from '@/components/nav/SimpleNavBar';
import { fetchCompetition } from '@/services/CompetitionService';
import { Competition } from '@/types';

const Inschrijving: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [competition, setCompetition] = useState<Competition | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (id) {
			const competitionId = parseInt(id, 10);

			if (isNaN(competitionId)) {
				setError('Invalid competition ID');
				setLoading(false);
				return;
			}

			const fetchCompetitionDetails = async () => {
				try {
					const data = await fetchCompetition(competitionId);
					setCompetition(data);
				} catch (error) {
					setError('Error fetching competition details');
				} finally {
					setLoading(false);
				}
			};

			fetchCompetitionDetails();
		} else {
			setLoading(false);
		}
	}, [id]);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	const isSameDate = (date1: string, date2: string) => {
		const d1 = new Date(date1);
		const d2 = new Date(date2);
		return (
			d1.getFullYear() === d2.getFullYear() &&
			d1.getMonth() === d2.getMonth() &&
			d1.getDate() === d2.getDate()
		);
	};

	// Get the current date in 'YYYY-MM-DD' format in Belgian time
	const today = new Intl.DateTimeFormat('en-GB', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		timeZone: 'Europe/Brussels',
	}).format(new Date());

	const formattedToday = today.split('/').reverse().join('-');

	if (!competition || !isSameDate(competition.date, formattedToday)) {
		return <Navigate to='/' />;
	}

	return (
		<div className='flex flex-col items-center w-full p-3'>
			<SimpleNavBar />
			<div className='flex flex-col items-center justify-center w-full mt-24 space-y-6 md:max-w-3xl lg:max-w-5xl'>
				<h1 className='text-4xl font-semibold '>
					Inschrijving voor {competition.name}
				</h1>
				<div className='w-full p-6 space-y-6 border shadow-lg rounded-xl bg-slate-50 dark:bg-slate-950'>
					<RegistrationForm competitionId={competition.id} />
				</div>
			</div>
		</div>
	);
};

export default Inschrijving;
