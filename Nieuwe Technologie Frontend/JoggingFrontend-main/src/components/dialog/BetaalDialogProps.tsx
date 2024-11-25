import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { createPayment } from '@/services/paymentService';

interface BetaalDialogProps {
	competitionID: number;
	amountInCents: number;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}

const BetaalDialog: React.FC<BetaalDialogProps> = ({
													   competitionID,
													   amountInCents,
													   isOpen,
													   onOpenChange,
												   }) => {
	const [isProcessing, setIsProcessing] = useState(false);
	const [isChecked, setIsChecked] = useState(false);

	const handleProceedToPay = async () => {
		setIsProcessing(true);

		try {
			amountInCents = 700;
			const paymentData = { amountInCents };
			const response = await createPayment(competitionID, paymentData);

			toast.success('Betaling succesvol aangemaakt');
			console.log('Payment URL:', response.url);
			window.location.href = response.url;
		} catch (error: any) {
			toast.error(
				`Er is een fout opgetreden bij het aanmaken van de betaling. Probeer het later opnieuw.`
			);
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Betaling</DialogTitle>
					<DialogDescription>
						Wens je nu te betalen? Dan wordt je doorverwezen naar de
						betalingspagina.
					</DialogDescription>
				</DialogHeader>
				<div className='flex items-center space-x-2'>
					<input
						id='privacy-policy'
						type='checkbox'
						checked={isChecked}
						onChange={(e) => setIsChecked(e.target.checked)}
						className='form-checkbox'
					/>
					<label htmlFor='privacy-policy' className='text-sm text-gray-700'>
						Ik ga akkoord met de{' '}
						<a href='/privacy-policy' target='_blank' className='text-blue-500 underline'>
							privacyvoorwaarden
						</a>{' '}
						en{' '}
						<a href='/algemene-voorwaarden' target='_blank' className='text-blue-500 underline'>
							algemene voorwaarden
						</a>.
					</label>
				</div>
				<DialogFooter>
					<Button variant='outline' onClick={() => onOpenChange(false)}>
						Later
					</Button>
					<Button onClick={handleProceedToPay} disabled={isProcessing || !isChecked}>
						{isProcessing ? 'Bezig met verwerken...' : 'Nu Betalen'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default BetaalDialog;
