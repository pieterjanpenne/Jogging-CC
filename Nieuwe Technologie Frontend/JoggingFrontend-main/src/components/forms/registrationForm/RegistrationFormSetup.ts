import { z } from 'zod';
import { addressSchema } from '../authRegisterForm/Sections/AddressFormSetup';

export const registrationschema = z.object({
	firstName: z.string().trim().min(2, {
		message: 'Voornaam moet minimaal 2 tekens lang zijn.',
	}),
	lastName: z.string().trim().min(2, {
		message: 'Achternaam moet minimaal 2 tekens lang zijn.',
	}),
	phoneNumber: z.string().trim().nullable().optional(),
	email: z.union([
		z.string().email("Ongeldig e-mailadres"),
		z.string().length(0)
	]),
	gender: z.enum(['M', 'V'], {
		required_error: 'Je moet een gender selecteren.',
	}),
	birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
		message: 'Voer een geldige geboortedatum in.',
	}),
	ibanNumber: z.string().nullable().optional(),
	distanceName: z.string().trim().min(1, {
		message: 'Selecteer een afstand.',
	}),
	address: addressSchema,
});

export type FormValues = z.infer<typeof registrationschema>;
