import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from '@/components/ui/card';
import PersonForm from '@/components/forms/personForm/PersonForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/routes/auth/context/AuthProvider';

export default function Profile() {
	const { user } = useAuth();
	console.log(user);
	return (
		<Card>
			<CardHeader>
				<CardTitle>Profiel</CardTitle>
				<CardDescription>Alle informatie van jouw profiel.</CardDescription>
			</CardHeader>
			<CardContent>
				{user?.id ? (
					<PersonForm id={user?.id} />
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
