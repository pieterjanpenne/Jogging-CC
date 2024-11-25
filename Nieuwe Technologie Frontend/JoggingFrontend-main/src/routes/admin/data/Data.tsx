import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Link, Outlet } from 'react-router-dom';

export default function Data() {
	return (
		<>
			<div className='grid w-full max-w-6xl gap-2 mx-auto'>
				<h1 className='text-3xl font-semibold'>Data</h1>
			</div>
			<div className='mx-auto grid w-full max-w-6xl space-y-3  md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]'>
				<nav className='flex gap-4 text-sm md:flex-col text-muted-foreground'>
					<Link to='wedstrijden'>Wedstrijden</Link>
					<Link to='personen'>Personen</Link>
					{/* <Link to='runs'>Looptijden</Link> */}
				</nav>
				<div className='flex-1'>
					<Outlet />
				</div>
			</div>
		</>
	);
}
