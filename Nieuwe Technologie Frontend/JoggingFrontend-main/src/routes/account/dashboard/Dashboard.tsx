import PersonalRegistrationTable from '@/components/tables/personalRegistrationTable/personalRegistrationTable';
import PersonalRunsTable from '@/components/tables/personalRunsTable/personalRunsTable';
import { useAuth } from '@/routes/auth/context/AuthProvider';

const Dashboard: React.FC = () => {
	const { user } = useAuth();

	return (
		<>
			<div className='grid w-full max-w-6xl gap-2 mx-auto'>
				<h1 className='text-5xl font-semibold' id='#joggings'>
					Welkom {user?.firstName} {user?.lastName}
				</h1>
				<h2 className='p-2 text-2xl '>Jouw participaties en inschrijvingen</h2>
			</div>

			<div className='w-full max-w-6xl p-6 mx-auto space-y-6 border shadow-xl rounded-xl bg-slate-50 dark:bg-slate-950'>
				<div>
					<h2 className='p-2 pt-0 text-2xl font-semibold '>Inschrijvingen:</h2>
					{/* <p className='p-2 pt-0'>
						Je kan hier nog betalen of je uitschrijven.
					</p> */}

					<PersonalRegistrationTable />
				</div>
				<div>
					<h2 className='p-2 pt-0 text-2xl font-semibold '>Participaties:</h2>
					<p className='p-2 pt-0'>
						Hier kan je jouw resultaten zien van jouw participaties.
					</p>
					<PersonalRunsTable />
				</div>
			</div>
		</>
	);
};

export default Dashboard;
