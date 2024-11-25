import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Link, useLocation } from 'react-router-dom';

export function DaginschrijvingDialog() {
	const location = useLocation();
	const currentPath = location.pathname;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Doe een daginschrijving</Button>
			</DialogTrigger>
			<DialogContent className=' max-w-[360px] md:max-w-[512px]'>
				<DialogHeader>
					<DialogTitle>Daginschrijving</DialogTitle>
					<DialogDescription>Let op!</DialogDescription>
				</DialogHeader>

				<div className=''>
					<DialogDescription className='text-md'>
						Als je inschrijft voor een daginschrijving, zullen je resultaten
						openbaar zijn, maar je komt niet in aanmerking voor het klassement.
						Wil je meedoen aan het klassement? Maak dan een account aan en zorg
						dat je bent ingelogd vooraleer je jouw inschrijft.
					</DialogDescription>
				</div>
				<DialogFooter className='gap-1 md:gap-0'>
					<DialogClose asChild>
						<Button variant='outline'>Sluiten</Button>
					</DialogClose>
					<Link to={`${currentPath}/inschrijven`}>
						<Button className='w-full'>Inschrijven</Button>
					</Link>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
