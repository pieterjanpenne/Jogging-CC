import { z } from 'zod';
import passwordSchema from "@/schemas/passwordSchema.tsx";


export const contactInfoSchema = z
	.object({
		email: z.string().email('Voer een geldig e-mailadres in.'),
		password: passwordSchema,
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Wachtwoorden komen niet overeen',
		path: ['confirmPassword'],
	});

export type ContactInfo = z.infer<typeof contactInfoSchema>;
