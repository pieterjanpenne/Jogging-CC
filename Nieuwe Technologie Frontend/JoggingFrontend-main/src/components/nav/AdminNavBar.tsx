import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTrigger,
} from '@/components/ui/sheet';
import { ModeToggle } from '@/components/ModeToggle';
import AccountDropDown from '../dropdowns/AccountDropDown';

interface NavItem {
	link: string;
	title: string;
}

const navData: NavItem[] = [
	{
		link: '/',
		title: 'Startpagina',
	},
	{
		link: 'dashboard',
		title: 'Dashboard',
	},
	{
		link: 'data/wedstrijden',
		title: 'Data',
	},
	{
		link: 'activity',
		title: 'Activiteiten',
	},
	{
		link: 'instellingen',
		title: 'Instellingen',
	},
];

const AdminNavBar: React.FC = () => {
	return (
		<header className='sticky top-0 flex items-center justify-between w-full h-16 gap-4 px-4 border-b bg-background md:px-6'>
			{/* Desktop Navigation Bar */}
			<nav className='hidden md:flex md:items-center md:gap-6'>
				<Link to='/' className='font-bold'>
					Evergemse Joggings
				</Link>
				{navData.map((item) => (
					<Link
						key={item.link}
						to={item.link}
						className='hover:text-foreground'
					>
						{item.title}
					</Link>
				))}
			</nav>

			{/* Mobile Navigation Drawer */}
			<Sheet>
				<SheetTrigger asChild>
					<Button variant='outline' size='icon' className='md:hidden'>
						<Menu className='w-5 h-5' />
						<span className='sr-only'>Toggle navigation menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side='left' className='space-y-6'>
					<Link to='/' className='text-xl font-bold'>
						Evergemse Joggings
					</Link>

					<nav className='grid gap-6 text-lg font-medium'>
						{navData.map((item) => (
							<SheetClose key={item.link} asChild>
								<Link key={item.link} to={item.link} className='block'>
									{item.title}
								</Link>
							</SheetClose>
						))}
					</nav>
				</SheetContent>
			</Sheet>

			<div className='flex items-center justify-end gap-3'>
				<ModeToggle />
				<AccountDropDown />
			</div>
		</header>
	);
};

export default AdminNavBar;
