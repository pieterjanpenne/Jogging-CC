import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '../../ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import {PasswordInput} from "@/components/input/PasswordInput.tsx";
import {useAuth} from "@/routes/auth/context/AuthProvider.tsx";
import {Icons} from "@/lib/Icons.tsx";
import * as React from "react";
import {useState} from "react";
import passwordSchema from "@/schemas/passwordSchema.tsx";

const wachtwoordSchema = z
	.object({
		oudWachtwoord: z.string().nonempty('Oud wachtwoord is verplicht.'),
		nieuwWachtwoord: passwordSchema,
		bevestigWachtwoord: passwordSchema,
	})
	.refine((data) => data.nieuwWachtwoord === data.bevestigWachtwoord, {
		message: 'Wachtwoorden komen niet overeen',
		path: ['bevestigWachtwoord'],
	});

type PasswordFormSetup = z.infer<typeof wachtwoordSchema>;

interface PasswordFormProps {
	updateWachtwoord: (
		oudWachtwoord: string,
		nieuwWachtwoord: string
	) => Promise<void>;
}

export function PasswordForm({ updateWachtwoord }: PasswordFormProps) {
	const { isLoading } = useAuth();
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm<PasswordFormSetup>({
		resolver: zodResolver(wachtwoordSchema),
		defaultValues: {
			oudWachtwoord: '',
			nieuwWachtwoord: '',
			bevestigWachtwoord: '',
		},
	});

	const { handleSubmit, control } = form;

	const onSubmit = async (values: PasswordFormSetup) => {
		await updateWachtwoord(values.oudWachtwoord, values.nieuwWachtwoord);
	};

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-8'>
				<FormField
					control={control}
					name='oudWachtwoord'
					render={({ field }) => (
						<FormItem className='w-full'>
							<FormLabel>Oud Wachtwoord*</FormLabel>
							<FormControl>
								<PasswordInput showPassword={showPassword} setShowPassword={setShowPassword} field={field} placeholder={'Oud Wachtwoord'}/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name='nieuwWachtwoord'
					render={({ field }) => (
						<FormItem className='w-full'>
							<FormLabel>Nieuw Wachtwoord*</FormLabel>
							<FormControl>
								<PasswordInput showPassword={showPassword} setShowPassword={setShowPassword} field={field} placeholder={'Nieuw Wachtwoord'}/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name='bevestigWachtwoord'
					render={({ field }) => (
						<FormItem className='w-full'>
							<FormLabel>Bevestig Nieuw Wachtwoord*</FormLabel>
							<FormControl>
								<PasswordInput showPassword={showPassword} setShowPassword={setShowPassword} field={field} placeholder={'Bevestig Nieuw Wachtwoord'}/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button disabled={isLoading} className='w-full' type='submit'>
					{isLoading ? (
						<Icons.spinner className='w-4 h-4 mr-2 animate-spin'/>
					) : (
						'Update wachtwoord'
					)}
				</Button>
			</form>
		</Form>
	);
}

export default PasswordForm;
