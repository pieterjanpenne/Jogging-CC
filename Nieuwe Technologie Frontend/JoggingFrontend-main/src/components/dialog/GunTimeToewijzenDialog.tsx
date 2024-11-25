import { updateResultGunTime } from '@/services/ResultsService';
import React, { useState, useEffect } from 'react';
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
import clockIcon from '../../assets/icon/clock.svg';
import clockWhite from '../../assets/icon/clockWhite.svg';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip';
import {Icons} from "@/lib/Icons.tsx";

interface GunTimeToewijzenDialogProps {
	competitionId: number;
	competitionDate: string;
	gunTime: Date | null;
	onUpdate: () => void;
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

const GunTimeToewijzenDialog: React.FC<GunTimeToewijzenDialogProps> = ({
	competitionId,
	competitionDate,
	gunTime,
	onUpdate,
}) => {
	const [isUpdating, setIsUpdating] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		const checkDarkMode = () => {
			setIsDarkMode(document.documentElement.classList.contains('dark'));
		};

		checkDarkMode();

		const observer = new MutationObserver(checkDarkMode);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class'],
		});

		return () => observer.disconnect();
	}, []);

	const form = useForm<FormValues>({
		resolver: zodResolver(timeSchema),
		defaultValues: {
			hours: gunTime instanceof Date ? gunTime.getHours().toString() : '0',
			minutes: gunTime instanceof Date ? gunTime.getMinutes().toString() : '0',
			seconds: gunTime instanceof Date ? gunTime.getSeconds().toString() : '0',
		},
	});

	const handleSubmit = async (values: FormValues) => {
		const parsedHours = parseInt(values.hours, 10);
		const parsedMinutes = parseInt(values.minutes, 10);
		const parsedSeconds = parseInt(values.seconds, 10);

		setIsUpdating(true);

		try {
			// Parse the competitionDate string into a Date object
			const strippedDate = new Date(competitionDate);
			strippedDate.setUTCHours(0, 0, 0, 0);

			// Add input hours, minutes, and seconds to the stripped date
			strippedDate.setUTCHours(
				strippedDate.getUTCHours() + parsedHours,
				strippedDate.getUTCMinutes() + parsedMinutes,
				strippedDate.getUTCSeconds() + parsedSeconds
			);

			const success = await updateResultGunTime(competitionId, strippedDate);
			if (success) {
				toast.success('Guntime succesvol bijgewerkt');
				onUpdate();
				setIsOpen(false);
			} else {
				toast.error('Bijwerken van guntime mislukt');
			}
		} catch (error: any) {
			if (error.response && error.response.data && error.response.data.errors) {
				const errorMessages = Object.values(error.response.data.errors)
					.flat()
					.join('\n');
				toast.error(`Validation errors:\n${errorMessages}`);
			} else {
				toast.error(
					'Er is een fout opgetreden bij het bijwerken van de guntime'
				);
			}
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<DialogTrigger asChild>
							<Button disabled={isUpdating} className='w-10 p-2'>
								<img
									src={isDarkMode ? clockWhite : clockIcon}
									alt='Clock Icon'
									className='w-full h-full bg-cover'
								/>
							</Button>
						</DialogTrigger>
					</TooltipTrigger>
					<TooltipContent className='bg-slate-500 dark:bg-slate-600 dark:text-white'>
						<p>Pas starttijd aan</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Guntime bijwerken</DialogTitle>
					<DialogDescription>
						Vul de guntime in uren, minuten en seconden in.
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

export default GunTimeToewijzenDialog;
