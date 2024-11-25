import React from 'react';
import { toast } from 'sonner';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/routes/auth/context/AuthProvider';
import AuthService from '@/services/AuthService';
import PasswordForm from '@/components/forms/passwordForm/PasswordForm.tsx';

const updatePassword = async (oldPassword: string, newPassword: string) => {
	try {
		await AuthService.changePassword(oldPassword, newPassword);
		toast.success('Wachtwoord succesvol bijgewerkt');
	} catch (error: any) {
		if(error.message === "Invalid old password") {
			toast.error('Incorrect oud wachtwoord');
		} else {
			toast.error(`Wachtwoord bijwerken mislukt: ${error.message}`);
		}
		console.error('Failed to update password:', error);
	}
};

export default function Account() {
	const { user } = useAuth();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Veiligheid</CardTitle>
				<CardDescription>Pas hier je wachtwoord aan.</CardDescription>
			</CardHeader>
			<CardContent>
				{user?.id ? (
					<div className='flex flex-col gap-3'>
						{/* <h1 className='text-base font-medium'>Email</h1>
						<Input type='text' value='email' disabled /> */}
						<PasswordForm updateWachtwoord={updatePassword} />
					</div>
				) : (
					<div className='flex flex-col space-y-3'>
						<Skeleton className='h-[125px] w-[250px] rounded-xl' />
						<div className='space-y-2'>
							<Skeleton className='h-4 w-[250px]' />
							<Skeleton className='h-4 w-[200px]' />
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
