import { z } from 'zod';

export const addressSchema = z.object({
	street: z.string().nullable().optional(),
	zipCode: z.string().nullable().optional(),
	city: z.string().min(2, 'Plaatsnaam is verplicht.'),
	houseNumber: z.string().nullable().optional(),
});

export type AddressInfo = z.infer<typeof addressSchema>;
