import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Icons } from '@/lib/Icons';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthService from '@/services/AuthService';
import {PasswordInput} from "@/components/input/PasswordInput.tsx";
import passwordSchema from "@/schemas/passwordSchema.tsx";

// Define types for your component props
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
}

// Define Zod schema for validation
const schema = z
	.object({
		password: passwordSchema,
		passwordCheck: z.string(),
	})
	.refine((data) => data.password === data.passwordCheck, {
		message: 'Wachtwoorden komen niet overeen',
		path: ['passwordCheck'], // Set the error path to passwordCheck
	});

// Define the form data type
type FormData = z.infer<typeof schema>;

export function ResetPassword({ className = '', ...props }: UserAuthFormProps) {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const token = queryParams.get('token');

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [showPassword, setShowPassword] = React.useState<boolean>(false);

	const navigator = useNavigate();

	const onSubmit: SubmitHandler<FormData> = async (data) => {
		setIsLoading(true);

		try {
			if (token) {
				await AuthService.resetPassword(token, data.password);
				toast.success('Wachtwoord succesvol gereset');
				navigator('/auth/login');
			} else {
				toast.error('Geen token gevonden');
			}
		} catch (error: any) {
			if (error.toLowerCase() === "invalid token") {
				toast.error(
					<>
						Deze mail is al gebruikt om je wachtwoord te resetten, gelieve een nieuwe aan te vragen.{' '}
						<a
							href="https://criterium.evergemsejoggings.be/auth/request-wachtwoord"
							style={{ textDecoration: 'underline' }}
						>
							Nieuw wachtwoord aanvragen
						</a>
					</>
				);
			} else {
				toast.error('Er is iets misgegaan bij het resetten van het wachtwoord');
			}
			console.error('Reset error:', error);
		}

		setIsLoading(false);
	};

	return (
		<>
			<div className='flex flex-col space-y-2 text-center'>
				<h1 className='text-2xl font-semibold tracking-tight'>
					Reset wachtwoord
				</h1>
				<p className='text-sm text-muted-foreground'>
					Voer hier uw nieuw wachtwoord in om mee in te loggen
				</p>
			</div>
			<div className={className} {...props}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='grid gap-2'>
						<div className='grid gap-1'>
							<Label className='sr-only' htmlFor='password'>
								Wachtwoord
							</Label>
							<Controller
								name='password'
								control={control}
								render={({ field }) => (
									<PasswordInput showPassword={showPassword} setShowPassword={setShowPassword} field={field} placeholder={'Wachtwoord'}/>
								)}
							/>
							{errors.password && (
								<span className='text-sm text-red-500'>
									{errors.password.message?.toString()}
								</span>
							)}
						</div>
						<div className='grid gap-1'>
							<Label className='sr-only' htmlFor='passwordCheck'>
								Bevestig Wachtwoord
							</Label>
							<Controller
								name='passwordCheck'
								control={control}
								render={({ field }) => (
									<PasswordInput showPassword={showPassword} setShowPassword={setShowPassword} field={field} placeholder={'Bevestig wachtwoord'}/>
								)}
							/>
							{errors.passwordCheck && (
								<span className='text-sm text-red-500'>
									{errors.passwordCheck.message?.toString()}
								</span>
							)}
						</div>
						<Button disabled={isLoading}>
							{isLoading ? (
								<Icons.spinner className='w-4 h-4 mr-2 animate-spin' />
							) : (
								'Reset Wachtwoord'
							)}
						</Button>
					</div>
				</form>
			</div>
		</>
	);
}
