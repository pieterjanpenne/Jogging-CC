import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import AuthCoverImage from '../../assets/images/authCoverImage.jpg';

export default function Auth() {
	const location = useLocation();
	const [isFormState, setFormState] = useState(false);

	// Effect to set the initial form state based on the URL
	useEffect(() => {
		if (location.pathname.endsWith('/register')) {
			setFormState(true); // True if register
		} else if (location.pathname.endsWith('/login')) {
			setFormState(false); // False if login
		}
	}, [location.pathname]);

	const toggleForm = () => {
		setFormState(!isFormState);
	};

	return (
		<div className='w-full h-screen max-h-screen overflow-y-hidden lg:grid lg:grid-cols-2'>
			<div className='relative flex-col hidden h-full p-10 bg-muted lg:flex dark:border-r'>
				<div className='absolute inset-0 h-screen'>
					<img
						src={AuthCoverImage}
						alt='Photo of a runner'
						className='block object-cover object-top w-full h-screen dark:brightness-[0.2] dark:grayscale'
					/>
				</div>
				<div className='relative z-20 mt-auto'>
					<blockquote className='space-y-2'>
						<p className='text-lg'></p>
						<footer className='text-sm'></footer>
					</blockquote>
				</div>
			</div>

			{/* Custom Navbar for authPage */}
			<div className='absolute flex items-center justify-between w-full px-6 font-medium md:px-10 top-10 float'>
				<Link to='/' className='pb-0.5 opacity-50'>
					Evergemse Jogging
				</Link>
				<Link to={isFormState ? '/auth/login' : '/auth/register'}>
					<Button
						onClick={toggleForm}
						variant='ghost'
						className='hover:text-primary'
					>
						{isFormState ? 'Login' : 'Registreer'}
					</Button>
				</Link>
			</div>

			<div className='flex items-center h-full px-3 mt-12 md:mt-0 lg:px-8'>
				<div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
					<Outlet />

					{/* <p className='px-8 text-sm text-center text-muted-foreground'>
						By clicking continue, you agree to our{' '}
						<Link
							to='/terms'
							className='underline underline-offset-4 hover:text-primary'
						>
							Terms of Service
						</Link>{' '}
						and{' '}
						<Link
							to='/privacy'
							className='underline underline-offset-4 hover:text-primary'
						>
							Privacy Policy
						</Link>
						.
					</p> */}
				</div>
			</div>
		</div>
	);
}
