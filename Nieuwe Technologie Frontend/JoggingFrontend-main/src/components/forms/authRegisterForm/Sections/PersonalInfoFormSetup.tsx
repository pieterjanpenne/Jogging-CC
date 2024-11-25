import { z } from 'zod';

const MAX_AGE = 160;

export const personalInfoSchema = z.object({
	firstName: z.string().min(2, 'Voornaam moet minimaal 2 tekens lang zijn.'),
	lastName: z.string().min(2, 'Achternaam moet minimaal 2 tekens lang zijn.'),
	birthday: z
		.string()
		.min(10, 'Voer een geldige geboortedatum in.')
		.refine(
			(date) => {
				const parsedDate = new Date(date);
				const today = new Date();
				const maxBirthday = new Date();
				maxBirthday.setFullYear(maxBirthday.getFullYear() - MAX_AGE);
				return parsedDate < today && parsedDate > maxBirthday;
			},
			{
				message: `Geboortedatum moet in het verleden liggen.`,
			}
		),
	club: z.string().optional(),
	gender: z.enum(['V', 'M'], {
		required_error: 'Selecteer een geslacht.',
	}),
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
