import React, {FC, useState} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	Form,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ContactInfo, contactInfoSchema } from './ContactInfoFormSetup';
import {useAuth} from "@/routes/auth/context/AuthProvider.tsx";
import {PasswordInput} from "@/components/input/PasswordInput.tsx";

interface ContactInfoProps {
    onDataChange: (data: ContactInfo) => void,
    setValidateCurrentForm: React.MutableRefObject<() => Promise<boolean>>
}

export const ContactInfoComponent: FC<ContactInfoProps> = ({
	onDataChange,
	setValidateCurrentForm
}) => {
	const {checkEmail} = useAuth();
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm<ContactInfo>({
		resolver: zodResolver(contactInfoSchema),
		mode: 'onChange',
		defaultValues: {
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	const { control, handleSubmit } = form;

    // Function to validate and handle data submission
    const validateAndSubmit = () => {
        return new Promise<boolean>((resolve) => {
            handleSubmit(
                async (data) => {
                    onDataChange(data);
                    await checkEmail(data.email);
                    resolve(true);
                },
                (errors) => {
                    console.error('Validation errors:', errors);
                    resolve(false);
                }
            )();
        });
    };

	// Expose the validateAndSubmit function to the parent component via ref
	React.useEffect(() => {
		setValidateCurrentForm.current = validateAndSubmit;
	}, [validateAndSubmit, setValidateCurrentForm]);

	return (
		<Form {...form}>
			<form className='w-full'>
				<FormField
					control={control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email Adres</FormLabel>
							<FormControl>
								<Input type='email' placeholder='user@example.com' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Wachtwoord</FormLabel>
							<FormControl>
								<PasswordInput showPassword={showPassword} setShowPassword={setShowPassword} field={field} placeholder={"Voer je wachtwoord in"}/>
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name='confirmPassword'
					render={({field}) => (
						<FormItem>
							<FormLabel>Bevestig Wachtwoord</FormLabel>
							<FormControl>
								<PasswordInput showPassword={showPassword} setShowPassword={setShowPassword} field={field} placeholder={"Bevestig je wachtwoord"}/>
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
};
