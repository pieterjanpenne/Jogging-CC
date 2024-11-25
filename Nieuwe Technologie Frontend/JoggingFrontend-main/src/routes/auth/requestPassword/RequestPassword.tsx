import * as React from 'react';
import {Button} from '@/components/ui/button';
import {Icons} from '@/lib/Icons';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {toast} from 'sonner';
import {z} from 'zod';
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import AuthService from '@/services/AuthService';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import {PasswordInput} from "@/components/input/PasswordInput.tsx";
import {useNavigate} from "react-router-dom"; // Import the AuthService

// Define types for your component props
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
}

const schema = z.object({
	email: z.string().email('Ongeldig emailadres'),
});

// Define the form data type
type FormData = z.infer<typeof schema>;

export function RequestPassword({
									className = '',
									...props
								}: UserAuthFormProps) {
	const {
		control,
		handleSubmit,
		formState: {errors},
	} = useForm<FormData>({
		resolver: zodResolver(schema),
	});
	const queryParams = new URLSearchParams(location.search);
	const email = queryParams.get('email');
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: email ?? ""
		},
	});

	const onSubmit: SubmitHandler<FormData> = async (data) => {
		setIsLoading(true);

		try {
			await AuthService.requestPassword(data.email);
			toast.success(
				'Als dit emailadres bestaat, wordt er een resetlink verstuurd'
			);
			setIsSuccess(true);
			navigate("/auth/login")
		} catch (error) {
			console.error('Request error:', error);
			/*toast.error('Er is iets misgegaan bij het aanvragen van de reset link');*/
			toast.success(
				'Als dit emailadres bestaat, wordt er een resetlink verstuurd'
			);
		}

		setIsLoading(false);
	};

	return (
		<>
			<div className='flex flex-col space-y-2 text-center'>
				<h1 className='text-2xl font-semibold tracking-tight'>
					Wachtwoord resetten
				</h1>
				<p className='text-sm text-muted-foreground'>
					Voer uw emailadres in om een nieuw wachtwoord aan te vragen
				</p>
			</div>
			<div className={className} {...props}>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className='grid gap-2'>
							<div className='grid gap-1'>
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem className='w-full'>
											<FormLabel>E-mailadres*</FormLabel>
											<FormControl>
												<Input
													disabled={isLoading || isSuccess}
													placeholder={"Email"}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{errors.email && (
									<span className='text-sm text-red-500'>
                                        {errors.email.message?.toString()}
                                    </span>
								)}
							</div>
							<Button disabled={isLoading || isSuccess}>
								{isLoading ? (
									<Icons.spinner className='w-4 h-4 mr-2 animate-spin'/>
								) : isSuccess ? "Aangevraagd" : (
									'Aanvragen'
								)}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</>
	);
}