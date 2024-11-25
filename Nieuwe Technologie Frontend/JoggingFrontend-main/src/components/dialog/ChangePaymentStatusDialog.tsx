import React, { useState } from 'react';
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
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Switch } from '../ui/switch';
import { updatePaymentStatus } from '@/services/RegistrationService';
import {Icons} from "@/lib/Icons.tsx";

interface ChangePaymentStatusDialogProps {
	registrationId: string;
	isPayed?: boolean;
	onUpdate: () => void;
	isOpen: boolean;
	onClose: () => void;
}

const paymentSchema = z.object({
	isPayed: z.boolean(),
});

type FormValues = z.infer<typeof paymentSchema>;

const ChangePaymentStatusDialog: React.FC<ChangePaymentStatusDialogProps> = ({
	registrationId,
	isPayed = false,
	onUpdate,
	isOpen,
	onClose,
}) => {
	const [isUpdating, setIsUpdating] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(paymentSchema),
		defaultValues: {
			isPayed,
		},
	});

	const handleSubmit = async (values: FormValues) => {
		setIsUpdating(true);

		try {
			const success = await updatePaymentStatus(Number(registrationId), {
				paid: values.isPayed,
			});
			if (success) {
				toast.success('Betalingsstatus succesvol bijgewerkt');
				onUpdate();
				onClose();
			} else {
				toast.error('Bijwerken van betalingsstatus mislukt');
			}
		} catch (error: any) {
			if (error.response && error.response.data && error.response.data.errors) {
				const errorMessages = Object.values(error.response.data.errors)
					.flat()
					.join('\n');
				toast.error(`Validation errors:\n${errorMessages}`);
			} else {
				toast.error(
					'Er is een fout opgetreden bij het bijwerken van de betalingsstatus'
				);
			}
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Betalingsstatus Bijwerken</DialogTitle>
					<DialogDescription>
						Schakel de betalingsstatus in of uit.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className=''>
						<FormField
							control={form.control}
							name='isPayed'
							render={({ field }) => (
								<FormItem className='flex items-center justify-center gap-2 p-3 space-x-0 space-y-0 justify-items-center'>
									<FormLabel>Betaald</FormLabel>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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

export default ChangePaymentStatusDialog;
