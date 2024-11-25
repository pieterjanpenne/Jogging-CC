import React, {useEffect, useState} from 'react';
import { Input } from '../../ui/input';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
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
import { useForm, Controller } from 'react-hook-form';
import { FormSetup, formSetupSchema } from './PersonFormSetup';
import {
	createPerson,
	fetchPerson,
	updatePerson,
} from '@/services/PersonService';
import { toast } from 'sonner';
import {Icons} from "@/lib/Icons.tsx";

interface PersonFormProps {
	id?: number;
	onClose?: () => void;
	onUpdate?: () => void;
	refreshData?: () => void; // Add this line
}

export function PersonForm({
	id,
	onClose,
	onUpdate,
	refreshData,
}: PersonFormProps) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const form = useForm<FormSetup>({
		resolver: zodResolver(formSetupSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			birthDate: '',
			ibanNumber: '',
			gender: 'M',
			school: { name: '' },
			address: {
				houseNumber: '',
				street: '',
				zipCode: '',
				city: '',
			},
		},
	});

	const { control, handleSubmit, setValue } = form;

	useEffect(() => {
		if (id) {
			const fetchData = async () => {
				try {
					const existingPerson = await fetchPerson(id);

					if (existingPerson) {
						const formattedDate = existingPerson.birthDate
							? new Date(existingPerson.birthDate).toISOString().slice(0, 10)
							: '';
						const formData: FormSetup = {
							firstName: existingPerson.firstName || '',
							lastName: existingPerson.lastName || '',
							birthDate: formattedDate || '',
							ibanNumber: existingPerson.ibanNumber || '',
							gender: existingPerson.gender || 'M',
							school: existingPerson.school || { name: '' },
							address: {
								houseNumber: existingPerson.address?.houseNumber || '',
								street: existingPerson.address?.street || '',
								zipCode: existingPerson.address?.zipCode || '',
								city: existingPerson.address?.city || '',
							},
						};
						Object.keys(formData).forEach((key) => {
							setValue(
								key as keyof FormSetup,
								formData[key as keyof typeof formData]
							);
						});
					}
				} catch (error) {
					console.error('Error fetching person data:', error);
				}
			};
			fetchData();
		}
	}, [id, setValue]);

	const onSubmit = async (values: FormSetup) => {
		setIsLoading(true);
		try {
			const formattedValues = {
				...values,
				address: {
					...values.address,
					houseNumber: values.address.houseNumber || '',
					street: values.address.street || '',
					zipCode: values.address.zipCode || '',
				},
				ibanNumber: values.ibanNumber || '',
				school: values.school?.name ? values.school : { name: '' },
			};

			if (id) {
				await updatePerson(id, formattedValues);
				toast('Gegevens succesvol bijgewerkt');
				onUpdate && onUpdate();
			} else {
				await createPerson(formattedValues);
				toast('Gegevens succesvol aangemaakt');
			}
			refreshData && refreshData(); // Add this line
			onClose && onClose();
		} catch (error) {
			console.error('Failed to submit person:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8'>
				{/* Names */}
				<div className='flex flex-col w-full space-y-3 lg:space-y-0 lg:space-x-3 lg:flex-row'>
					<FormField
						control={form.control}
						name='firstName'
						render={({ field }) => (
							<FormItem className='w-full'>
								<FormLabel>Voornaam*</FormLabel>
								<FormControl>
									<Input placeholder='voornaam' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='lastName'
						render={({ field }) => (
							<FormItem className='w-full'>
								<FormLabel>Naam*</FormLabel>
								<FormControl>
									<Input placeholder='naam' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name='ibanNumber'
					render={({ field }) => (
						<FormItem className='w-full'>
							<FormLabel>IBAN</FormLabel>
							<FormControl>
								<Input placeholder='BE95' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='flex flex-col w-full space-y-3 lg:space-y-0 lg:space-x-3 lg:flex-row'>
					{/* Gender */}
					<Controller
						name='gender'
						control={control}
						render={({ field }) => (
							<FormItem className='w-full space-y-3'>
								<FormLabel>Geslacht*</FormLabel>
								<FormControl>
									<RadioGroup
										value={field.value}
										onValueChange={(value) => field.onChange(value)}
										className='flex'
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

					{/* Bday */}
					<FormField
						control={control}
						name='birthDate'
						render={({ field }) => (
							<FormItem className='w-full'>
								<FormLabel>Geboortedatum*</FormLabel>
								<FormControl>
									<Input
										type='date'
										{...field}
										max='9999-12-31'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Nested Address Form UI */}
				<div className='p-4 mt-6 space-y-4 border rounded-md'>
					<h3 className='text-lg font-medium'>Adres Details</h3>
					<FormField
						control={form.control}
						name='address.street'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Straat</FormLabel>
								<FormControl>
									<Input
										placeholder='Dorpstraat'
										{...field}
										value={field.value || ''}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='address.city'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Stad/Gemeente*</FormLabel>
								<FormControl>
									<Input
										placeholder='Gent'
										{...field}
										value={field.value || ''}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='flex space-x-3'>
						<FormField
							control={form.control}
							name='address.zipCode'
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormLabel>Postcode</FormLabel>
									<FormControl>
										<Input
											placeholder='9000'
											{...field}
											value={field.value || ''}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='address.houseNumber'
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormLabel>Huisnummer</FormLabel>
									<FormControl>
										<Input
											placeholder='12'
											{...field}
											value={field.value || ''}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<Button disabled={isLoading} className='w-full' type='submit'>
					{isLoading && <Icons.spinner className='w-4 h-4 mr-2 animate-spin'/>}Opslaan
				</Button>
			</form>
		</Form>
	);
}

export default PersonForm;
