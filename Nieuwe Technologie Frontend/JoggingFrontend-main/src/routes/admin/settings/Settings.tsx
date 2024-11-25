import { Link, Outlet } from 'react-router-dom';

export default function Settings() {
	return (
		<>
			<div className='grid w-full max-w-6xl gap-2 mx-auto'>
				<h1 className='text-3xl font-semibold'>Instellingen</h1>
			</div>
			<div className='mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]'>
				<nav className='flex gap-4 text-sm md:flex-col text-muted-foreground'>
					<Link to='profile'>Profiel</Link>
					<Link to='account'>Veiligheid</Link>
					<Link to='verwijder-account'>Account verwijderen</Link>
				</nav>
				{/* Dynamic content area for "Account", "Profiel"*/}
				<div className='flex-1'>
					<Outlet />
				</div>
			</div>
		</>
	);
}
