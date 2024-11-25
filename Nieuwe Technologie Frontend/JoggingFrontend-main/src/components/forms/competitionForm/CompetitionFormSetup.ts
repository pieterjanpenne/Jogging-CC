import { z } from 'zod';
import { addressSchema } from '../authRegisterForm/Sections/AddressFormSetup';

export const distanceSchema = z.object({
	name: z.string().min(1, 'Naam van de afstand is verplicht'),
	distance: z.number().positive('Afstand moet een positief getal zijn'),
});

export const competitionSchema = z.object({
	name: z.string().min(2).max(50),
	date: z
		.string()
		.regex(
			/^\d{4}-\d{2}-\d{2}$/,
			'Ongeldig datum formaat. Vereist: JJJJ-MM-DD'
		),
	active: z.boolean(),
	rankingActive: z.boolean(),
	address: addressSchema,
	information: z
		.string()
		// .min(10, {
		// 	message: 'Informatie moet minstens 10 tekens lang zijn.',
		// })
		.max(600, {
			message: 'Informatie mag niet langer zijn dan 160 tekens.',
		}),
	afstanden: z
		.array(distanceSchema)
		.nonempty('Er moet minstens één afstand zijn.'),
});

export type FormValues = z.infer<typeof competitionSchema>;
