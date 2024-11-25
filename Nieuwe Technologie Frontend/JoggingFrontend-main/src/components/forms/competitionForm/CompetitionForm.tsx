import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { competitionSchema, FormValues } from './CompetitionFormSetup';
import {
	fetchCompetition,
	updateCompetition,
	createCompetition,
} from '@/services/CompetitionService';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CompetitionForm: React.FC<{
	competitionId?: number;
	onClick: () => void;
}> = ({ competitionId, onClick }) => {
	const form = useForm<FormValues>({
		resolver: zodResolver(competitionSchema),
		defaultValues: {
			name: '',
			date: '',
			active: false,
			rankingActive: false,
			address: {
				street: '',
				city: '',
				zipCode: '',
				houseNumber: '',
			},
			information: '',
			afstanden: [
				{ name: 'kort', distance: 5 },
				{ name: 'midden', distance: 10 },
				{ name: 'lang', distance: 15 },
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'afstanden',
	});

	useEffect(() => {
		const loadCompetitionDetails = async () => {
			if (competitionId) {
				try {
					const competition = await fetchCompetition(competitionId);
					if (competition) {
						const fetchedDate = new Date(competition.date);
						fetchedDate.setDate(fetchedDate.getDate() + 1);
						const formattedDate = fetchedDate.toISOString().split('T')[0];

						const defaultDistances = {
							kort: 5,
							midden: 10,
							lang: 15,
						};

						const mergedDistances = {
							...defaultDistances,
							...competition.distances,
						};

						const sortedDistances = Object.entries(mergedDistances)
							.map(([name, distance]) => ({ name, distance }))
							.sort((a, b) => {
								const order = ['kort', 'midden', 'lang'];
								return order.indexOf(a.name) - order.indexOf(b.name);
							});

						form.reset({
							name: competition.name,
							date: formattedDate,
							active: competition.active || false,
							rankingActive: competition.rankingActive || false,
							address: competition.address || {
								street: '',
								city: '',
								zipCode: '',
								houseNumber: '',
							},
							information: competition.information || '',
							afstanden: sortedDistances,
						});
					}
				} catch (error) {
					console.error('Failed to fetch competition details:', error);
				}
			}
		};

		loadCompetitionDetails();
	}, [competitionId, form]);

	const handleSubmit = async (values: FormValues) => {
		const formattedValues = {
			...values,
			date: new Date(values.date).toISOString().split('T')[0],
		};
		if (competitionId) {
			try {
				const response = await updateCompetition(
					competitionId,
					formattedValues
				);
				console.log('Update Response:', response);
				toast.success('Wedstrijd aangepast');
				onClick();
			} catch (error: any) {
				if (error.response.status === 409) {
					toast.error(error.response.data);
				} else {
					console.error('Error updating competition:', error);
					toast.error(
						'Er is een fout opgetreden bij het aanpassen van de wedstrijd.'
					);
				}
			}
		} else {
			try {
				const response = await createCompetition(formattedValues);
				console.log('Create Response:', response);
				toast.success('Wedstrijd toegevoegd');
				onClick();
			} catch (error: any) {
				if (error.response.status === 409) {
					toast.error(error.response.data);
				} else {
					console.error('Error creating competition:', error);
					toast.error(
						'Er is een fout opgetreden bij het toevoegen van de wedstrijd.'
					);
				}
			}
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-3'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem className='w-full'>
							<FormLabel>Wedstrijd naam*</FormLabel>
							<FormControl>
								<Input
									placeholder='De Jogging van Oost-Vlaanderen'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='flex flex-col w-full pt=0 space-y-3 lg:space-y-0 lg:space-x-3 lg:flex-row'>
					<FormField
						control={form.control}
						name='date'
						render={({ field }) => (
							<FormItem className='w-full'>
								<FormLabel>Datum*</FormLabel>
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
					<FormField
						control={form.control}
						name='active'
						render={({ field }) => (
							<FormItem className='w-full'>
								<FormLabel>Publicatie status*</FormLabel>
								<FormControl>
									<Select
										value={String(field.value)}
										onValueChange={(value) => field.onChange(value === 'true')}
									>
										<SelectTrigger>
											<SelectValue
												placeholder={field.value ? 'Actief' : 'Inactief'}
											/>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='true'>Actief</SelectItem>
											<SelectItem value='false'>Inactief</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='rankingActive'
						render={({ field }) => (
							<FormItem className='w-full'>
								<FormLabel>Klassement status*</FormLabel>
								<FormControl>
									<Select
										value={String(field.value)}
										onValueChange={(value) => field.onChange(value === 'true')}
									>
										<SelectTrigger>
											<SelectValue
												placeholder={field.value ? 'Actief' : 'Inactief'}
											/>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='true'>Actief</SelectItem>
											<SelectItem value='false'>Inactief</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className='p-3 mt-6 space-y-4 border rounded-md'>
					<div className='flex justify-between'>
						<h2 className='text-lg font-medium '>Afstanden</h2>
						{!competitionId && (
							<div className='flex gap-3'>
								<Button
									type='button'
									onClick={() => {
										if (fields.length > 3) remove(fields.length - 1);
									}}
									disabled={fields.length <= 3}
								>
									<svg
										width='15'
										height='15'
										viewBox='0 0 15 15'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
									>
										<path
											d='M2.25 7.5C2.25 7.22386 2.47386 7 2.75 7H12.25C12.5261 7 12.75 7.22386 12.75 7.5C12.75 7.77614 12.5261 8 12.25 8H2.75C2.47386 8 2.25 7.77614 2.25 7.5Z'
											fill='currentColor'
											fill-rule='evenodd'
											clip-rule='evenodd'
										></path>
									</svg>
								</Button>
								<Button
									type='button'
									onClick={() => append({ name: '', distance: 0 })}
								>
									<svg
										width='15'
										height='15'
										viewBox='0 0 15 15'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
									>
										<path
											d='M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z'
											fill='currentColor'
											fill-rule='evenodd'
											clip-rule='evenodd'
										></path>
									</svg>
								</Button>
							</div>
						)}
					</div>
					<div className='flex flex-col w-full gap-3'>
						{fields.map((field, index) => (
							<div key={field.id} className='flex gap-3'>
								<FormField
									control={form.control}
									name={`afstanden.${index}.name`}
									render={({ field }) => (
										<FormItem className='w-full'>
											<FormControl>
												<Input
													placeholder='Afstand naam'
													{...field}
													disabled={index < 3 || competitionId !== undefined}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`afstanden.${index}.distance`}
									render={({ field }) => (
										<FormItem className='w-full'>
											<FormControl>
												<Input
													type='number'
													{...field}
													step='any'
													inputMode='decimal'
													value={field.value ?? ''}
													onChange={(e) =>
														field.onChange(e.target.valueAsNumber)
													}
													onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
														e.target.value = e.target.value.replace(
															/[^0-9.]/g,
															''
														);
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						))}
					</div>
				</div>

				<FormField
					control={form.control}
					name='information'
					render={({ field }) => (
						<FormItem className='w-full'>
							<FormLabel>Informatie</FormLabel>
							<FormControl>
								<Textarea
									rows={10}
									placeholder='Voeg aanvullende informatie toe over de wedstrijd'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

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
										value={field.value ?? ''}
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
								<FormLabel>Stad*</FormLabel>
								<FormControl>
									<Input placeholder='Gent' {...field} />
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
									<FormLabel>Post Code</FormLabel>
									<FormControl>
										<Input
											placeholder='9000'
											{...field}
											value={field.value ?? ''}
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
											value={field.value ?? ''}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<Button className='w-full' type='submit'>
					Opslaan
				</Button>
			</form>
		</Form>
	);
};

export default CompetitionForm;
