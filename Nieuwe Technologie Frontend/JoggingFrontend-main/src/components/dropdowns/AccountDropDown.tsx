import React from 'react';
import { Link } from 'react-router-dom';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { CircleUser } from 'lucide-react';
import { useAuth } from '@/routes/auth/context/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function AccountDropDown() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logout();
			navigate('/auth/login');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	// Safe access to user properties
	const userRole = user?.profile?.role;

	return (
		<>
			{user ? (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' size='icon' className=''>
							<CircleUser className='w-5 h-5' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>Mijn Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{userRole === 'Admin' ? (
							<>
								<DropdownMenuItem asChild>
									<Link to='/admin/dashboard'>Dashboard</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link to='/admin/data/wedstrijden'>Data</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link to='/admin/activity'>Activiteiten</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link to='/admin/instellingen'>Instellingen</Link>
								</DropdownMenuItem>
							</>
						) : (
							<>
								<DropdownMenuItem asChild>
									<Link to='/account'>Dashboard</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link to='/account/instellingen'>Instellingen</Link>
								</DropdownMenuItem>
							</>
						)}
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleLogout}>Afmelden</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<>
					<div className='flex items-center justify-center text-center lg:hidden'>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant='ghost' size='icon' className=''>
									<CircleUser className='w-5 h-5' />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end'>
								<DropdownMenuLabel>Account</DropdownMenuLabel>

								<DropdownMenuItem asChild>
									<Link to='/auth/login'>Log in</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link to='/auth/register'>Registreer</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<div className='items-center justify-center hidden space-x-3 text-center lg:flex'>
						<Link to='/auth/login'>
							<Button className='rounded-full' variant='ghost'>
								Log in
							</Button>
						</Link>
						<p className=''>|</p>
						<Link to='/auth/register'>
							<Button className='rounded-full' variant='ghost'>
								Registreer
							</Button>
						</Link>
					</div>
				</>
			)}
		</>
	);
}
