import { z } from 'zod';
import { addressSchema } from '../authRegisterForm/Sections/AddressFormSetup';

// Define the schema for the school object
const schoolSchema = z.object({
	name: z.string().optional(),
});

// Define the main schema for the form
export const formSetupSchema = z.object({
	firstName: z.string().min(2, 'Voornaam moet minimaal 2 tekens lang zijn.'),
	lastName: z.string().min(2, 'Achternaam moet minimaal 2 tekens lang zijn.'),
	birthDate: z
		.string()
		.min(10, 'Voer een geldige geboortedatum in.')
		.refine((date) => new Date(date) < new Date(), {
			message: 'Geboortedatum moet in het verleden liggen.',
		}),
	club: z.string().optional(),
	gender: z.enum(['M', 'V'], {
		required_error: 'Selecteer een geslacht.',
	}),
	ibanNumber: z.string().optional(),

	school: schoolSchema.optional(),
	address: addressSchema,
});

// Export the types derived from the schema
export type FormSetup = z.infer<typeof formSetupSchema>;
