// Daginschrijving.tsx
import React from 'react';
import { RegistrationForm } from '@/components/forms/registrationForm/RegistrationForm';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

interface DaginschrijvingProps {
	competitionId: number;
}

export default function Daginschrijving({
	competitionId,
}: DaginschrijvingProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Dag Inschrijving</CardTitle>
				<CardDescription>
					Vul hier de informatie in van de persoon die je wil inschrijven.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<RegistrationForm competitionId={competitionId} usePrivatePost={true} />
			</CardContent>
		</Card>
	);
}
