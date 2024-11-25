import { updateResultRunTime } from '@/services/ResultsService';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {Icons} from "@/lib/Icons.tsx";

interface LooptijdToewijzenDialogProps {
	resultId: string;
	onUpdate: () => void;
	runTime?: string | null;
}

const timeSchema = z.object({
	hours: z
		.string()
		.refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) >= 0, {
			message: 'Ongeldig aantal uren',
		}),
	minutes: z.string().refine(
		(val) => {
			const num = parseInt(val, 10);
			return !isNaN(num) && num >= 0 && num < 60;
		},
		{
			message: 'Ongeldig aantal minuten',
		}
	),
	seconds: z.string().refine(
		(val) => {
			const num = parseInt(val, 10);
			return !isNaN(num) && num >= 0 && num < 60;
		},
		{
			message: 'Ongeldig aantal seconden',
		}
	),
});

type FormValues = z.infer<typeof timeSchema>;

const LooptijdToewijzenDialog: React.FC<LooptijdToewijzenDialogProps> = ({
	resultId,
	runTime,
	onUpdate,
}) => {
	const [isUpdating, setIsUpdating] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const [hours, minutes, seconds] = (runTime ?? "00:00:00").split(":");
	const form = useForm<FormValues>({
		resolver: zodResolver(timeSchema),
		defaultValues: {
			hours: hours,
			minutes: minutes,
			seconds: seconds,
		},
	});

	const handleSubmit = async (values: FormValues) => {
		const parsedHours = parseInt(values.hours, 10);
		const parsedMinutes = parseInt(values.minutes, 10);
		const parsedSeconds = parseInt(values.seconds, 10);

		setIsUpdating(true);

		try {
			const success = await updateResultRunTime(resultId, {
				hours: parsedHours,
				minutes: parsedMinutes,
				seconds: parsedSeconds,
			});
			if (success) {
				toast.success('Resultaat succesvol bijgewerkt');
				onUpdate();
				setIsOpen(false);
			} else {
				toast.error('Bijwerken van resultaat mislukt');
			}
		} catch (error: any) {
			if (error.response && error.response.data && error.response.data.errors) {
				const errorMessages = Object.values(error.response.data.errors)
					.flat()
					.join('\n');
				toast.error(`Validation errors:\n${errorMessages}`);
			} else {
				toast.error(
					'Er is een fout opgetreden bij het bijwerken van het resultaat'
				);
			}
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant='outline'>Pas Looptijd Aan</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Looptijd Bijwerken</DialogTitle>
					<DialogDescription>
						Vul de looptijd in uren, minuten en seconden in.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className='space-y-4'
					>
						<div className='flex flex-row gap-2'>
							<FormField
								control={form.control}
								name='hours'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Uren</FormLabel>
										<FormControl>
											<Input type='number' placeholder='Uren' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='minutes'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Minuten</FormLabel>
										<FormControl>
											<Input type='number' placeholder='Minuten' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='seconds'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Seconden</FormLabel>
										<FormControl>
											<Input type='number' placeholder='Seconden' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<Button type='submit' disabled={isUpdating}>
								{isUpdating && <Icons.spinner className='w-4 h-4 mr-2 animate-spin'/>}
								{isUpdating ? 'Bezig met bijwerken...' : 'Bijwerken'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default LooptijdToewijzenDialog;
