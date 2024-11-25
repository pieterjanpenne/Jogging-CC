import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Icons } from '@/lib/Icons';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '../context/AuthProvider';
import { toast } from 'sonner';
import {Icon} from "react-icons-kit";
import {eyeOff} from 'react-icons-kit/feather';
import {eye} from 'react-icons-kit/feather/eye'

// Define types for your component props
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
}

export function AuthLoginForm({ className = '', ...props }: UserAuthFormProps) {
	const { login } = useAuth();
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [showPassword, setShowPassword] = React.useState(false);

	async function onSubmit(event: React.SyntheticEvent) {
		event.preventDefault();
		setIsLoading(true);

		try {
			await login(email, password);
			toast.success('Inloggen succesvol');
		} catch (error) {
			if (isAuthError(error)) {
				if (error.error_description.includes("not confirmed")) {
					toast.error(<>
						<div className="grid grid-cols-2 gap-2 text-center">
							<div className="flex items-center justify-center">E-mailadres is nog niet bevestigd</div>
							<div className="flex items-center justify-center">
								<a className="underline" href={`/auth/confirm?email=${email}`}>Vraag nieuwe mail aan</a>
							</div>
						</div>
					</>)
				} else {
					toast.error(<>
						<div className="grid grid-cols-2 gap-2 text-center">
							<div className="flex items-center justify-center">Verkeerde gebruikersnaam of wachtwoord</div>
							<div className="flex items-center justify-center">
								<a className="underline" href={`/auth/request-wachtwoord?email=${email}`}>Vraag nieuwe wachtwoord aan</a>
							</div>
						</div>
					</>)
				}
			} else {
				toast.error('Er is een fout opgetreden bij het inloggen');
			}
			console.error('Login error:', error);
		}

		setIsLoading(false);
	}

	function isAuthError(error: unknown): error is { error_description: string } {
		return typeof error === 'object' && error !== null && 'error_description' in error;
	}

	return (
		<>
			<div className='flex flex-col space-y-2 text-center'>
				<h1 className='text-2xl font-semibold tracking-tight'>Login</h1>
				<p className='text-sm text-muted-foreground'>
					Voer hier uw e-mailadres en wachtwoord in om in te loggen
				</p>
			</div>
			<div className={className} {...props}>
				<form onSubmit={onSubmit}>
					<div className='grid gap-2'>
						<div className='grid gap-1'>
							<Label className='sr-only' htmlFor='email'>
								Email
							</Label>
							<Input
								id='email'
								placeholder='name@example.com'
								type='email'
								autoCapitalize='none'
								autoComplete='email'
								autoCorrect='off'
								disabled={isLoading}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className='grid gap-1'>
							<Label className='sr-only' htmlFor='password'>
								Password
							</Label>
							<div className="relative">
								<Input
									id='password'
									placeholder='Wachtwoord'
									type={showPassword ? 'text' : 'password'}
									autoCapitalize='none'
									autoComplete='password'
									autoCorrect='off'
									disabled={isLoading}
									onChange={(e) => setPassword(e.target.value)}
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? <Icon icon={eye}/> : <Icon icon={eyeOff}/>}
								</button>
							</div>

						</div>
						<Button disabled={isLoading}>
							{isLoading ? (
								<Icons.spinner className='w-4 h-4 mr-2 animate-spin' />
							) : (
								'Inloggen'
							)}
						</Button>
					</div>
				</form>
			</div>
			<div className='px-8 text-sm text-center text-muted-foreground'>
				<p>Wachtwoord vergeten?</p>
				<Link
					to='/auth/request-wachtwoord'
					className='underline underline-offset-4 hover:text-primary'
				>
					Vraag een nieuw wachtwoord aan.
				</Link>
			</div>
		</>
	);
}
