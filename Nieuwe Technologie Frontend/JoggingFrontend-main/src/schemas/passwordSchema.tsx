import {z} from "zod";

const passwordSchema = z
    .string()
    .min(6, 'Het wachtwoord moet ten minste 6 tekens lang zijn.')
    .regex(/[A-Z]/, {
        message: 'Het wachtwoord moet ten minste één hoofdletter bevatten.',
    })
    .regex(/[a-z]/, {
        message: 'Het wachtwoord moet ten minste één kleine letter bevatten.',
    })
    .regex(/[0-9]/, {
        message: 'Het wachtwoord moet ten minste één cijfer bevatten.',
    });

export default passwordSchema;