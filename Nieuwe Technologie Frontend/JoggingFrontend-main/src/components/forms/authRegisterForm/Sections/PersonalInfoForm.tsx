import React, { FC, useEffect } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PersonalInfo, personalInfoSchema } from './PersonalInfoFormSetup';

interface PersonalInfoProps {
	onDataChange: (data: PersonalInfo) => void;
	setValidateCurrentForm: React.MutableRefObject<() => Promise<boolean>>;
}

export const PersonalInfoComponent: FC<PersonalInfoProps> = ({
	onDataChange,
	setValidateCurrentForm,
}) => {
	const form = useForm<PersonalInfo>({
		resolver: zodResolver(personalInfoSchema),
		mode: 'onChange',
		defaultValues: {
			firstName: '',
			lastName: '',
			birthday: '',
			club: '',
			gender: 'M',
		},
	});

	const { control, handleSubmit, watch } = form;

	useEffect(() => {
		setValidateCurrentForm.current = async () => {
			return new Promise<boolean>((resolve) => {
				handleSubmit(
					(data) => {
						onDataChange(data);
						resolve(true);
					},
					(errors) => {
						console.error('Validation errors:', errors);
						resolve(false);
					}
				)();
			});
		};
	}, [handleSubmit, onDataChange]);

	useEffect(() => {
		const subscription = watch((value) => {
			// Ensure all fields are defined before calling onDataChange
			if (value.firstName && value.lastName && value.birthday && value.gender) {
				onDataChange({
					...value,
					firstName: value.firstName,
					lastName: value.lastName,
					birthday: value.birthday,
					club: value.club || '', // Provide default empty string if club is undefined
					gender: value.gender,
				});
			}
		});
		return () => subscription.unsubscribe();
	}, [watch, onDataChange]);

	return (
		<Form {...form}>
			<form className='w-full'>
				<FormField
					control={control}
					name='firstName'
					render={({ field }) => (
						<FormItem className='w-full'>
							<FormLabel>Voornaam</FormLabel>
							<FormControl>
								<Input {...field} placeholder='Geef je voornaam' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name='lastName'
					render={({ field }) => (
						<FormItem className='w-full'>
							<FormLabel>Achternaam</FormLabel>
							<FormControl>
								<Input {...field} placeholder='Geef je achternaam' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name='birthday'
					render={({ field }) => (
						<FormItem className='w-full'>
							<FormLabel>Geboortedatum</FormLabel>
							<FormControl>
								<Input
									type='date' {...field}
									max='9999-12-31'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* <FormField
					control={control}
					name='club'
					render={({ field }) => (
						<FormItem className='lg:w-full'>
							<FormLabel>Club</FormLabel>
							<FormControl>
								<Input {...field} placeholder='Geef je sportclub' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/> */}

				<FormField
					control={control}
					name='gender'
					render={({ field }) => (
						<FormItem className='w-full space-y-3'>
							<FormLabel>Geslacht</FormLabel>
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									defaultValue={field.value}
									className='flex '
								>
									<FormItem className='flex items-center space-x-3 space-y-0'>
										<FormControl>
											<RadioGroupItem value='M' />
										</FormControl>
										<FormLabel className='font-normal'>Man</FormLabel>
									</FormItem>
									<FormItem className='flex items-center space-x-3 space-y-0'>
										<FormControl>
											<RadioGroupItem value='V' />
										</FormControl>
										<FormLabel className='font-normal'>Vrouw</FormLabel>
									</FormItem>
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
};
