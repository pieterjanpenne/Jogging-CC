import React, { useState, useEffect, useRef } from 'react';
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
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from '@/components/ui/input-otp';
import { updateRegistration } from '@/services/RegistrationService';
import { toast } from 'sonner';
import {Icons} from "@/lib/Icons.tsx";

interface NumberInputProps {
	onChange?: (value: string) => void;
	value?: string;
	inputRef: React.RefObject<HTMLInputElement>;
}

const RunNumberInput: React.FC<NumberInputProps> = ({
	onChange,
	value,
	inputRef,
}) => {
	const handleChange = (value: string) => {
		if (onChange) {
			onChange(value);
		}
	};

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, [inputRef]);

	return (
		<div className='flex justify-center w-full'>
			<InputOTP maxLength={4} onChange={handleChange} value={value}>
				<InputOTPGroup className=''>
					<InputOTPSlot index={0} ref={inputRef} />
					<InputOTPSlot index={1} />
					<InputOTPSlot index={2} />
					<InputOTPSlot index={3} />
				</InputOTPGroup>
			</InputOTP>
		</div>
	);
};

interface RunNumberDialogProps {
	registrationId: number;
	paid: boolean;
	onUpdate: () => void;
	runNumber?: number | null
}

export const RunNumberDialog: React.FC<RunNumberDialogProps> = ({
	registrationId,
	paid,
	onUpdate,
	runNumber: existingRunNumber
}) => {
	const [runNumber, setRunNumber] = useState<string>(existingRunNumber?.toString() ?? '');
	const [isWarningOpen, setIsWarningOpen] = useState<boolean>(false);
	const [isInputOpen, setIsInputOpen] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleRunNumberChange = (value: string) => {
		setRunNumber(value);
	};

    const handleSave = async () => {
		setIsLoading(true);
        try {
            const runNumberInt = parseInt(runNumber, 10);
            if (runNumber == "" || (!isNaN(runNumberInt) && runNumberInt >= 1000)) {
                const updateData = {runNumber: isNaN(runNumberInt) ? -1 : runNumberInt};
                console.log('Updating registration with data:', updateData);

                const response = await updateRegistration(registrationId, updateData);
                console.log('Registration updated successfully:', response);
                toast.success('Registratie succesvol bijgewerkt!');
                onUpdate();
                setIsInputOpen(false);
            } else {
                console.error('Invalid run number');
                toast.error('Ongeldig loopnummer');
            }
        } catch (error: any) {
            if (error.response.status === 409) {
                toast.error(error.response.data);
            } else {
                console.error('Failed to update registration:', error);
                toast.error('Registratie bijwerken mislukt: ' + error);
            }
        } finally {
			setIsLoading(false);
		}
    };

	const checkIfPaid = () => {
		if (paid) {
			setIsWarningOpen(false);
			setTimeout(() => {
				setIsInputOpen(true);
			}, 300);
		} else {
			setIsInputOpen(false);
			setTimeout(() => {
				setIsWarningOpen(true);
			}, 300);
		}
	};

	const handleProceed = () => {
		setIsWarningOpen(false);
		setTimeout(() => {
			setIsInputOpen(true);
		}, 300);
	};

	const handleScannerInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value;

		if (inputValue.startsWith('https://kozirunners.be/?loopnummer=')) {
			const url = new URL(inputValue);
			const loopnummer = url.searchParams.get('loopnummer');
			if (loopnummer) {
				setRunNumber(loopnummer.slice(-4));
			}
		} else {
			setRunNumber(inputValue);
		}
	};

	return (
		<>
			<Dialog open={isWarningOpen} onOpenChange={() => setIsWarningOpen(false)}>
				<DialogContent className='sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle>Waarschuwing</DialogTitle>
						<DialogDescription>
							Deze deelnemer heeft nog niet betaald. Wil je toch doorgaan?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant='outline' onClick={() => setIsWarningOpen(false)}>
							Annuleren
						</Button>
						<Button type='button' onClick={handleProceed}>
							Doorgaan
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={isInputOpen} onOpenChange={() => setIsInputOpen(false)}>
				<DialogTrigger asChild>
					<Button variant='outline' onClick={checkIfPaid}>
						Pas aan
					</Button>
				</DialogTrigger>
				<DialogContent className='sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle>Voer loopnummer in</DialogTitle>
						<DialogDescription>Voer hier het loopnummer in.</DialogDescription>
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						<input
							type='text'
							className='hidden'
							onChange={handleScannerInput}
							autoFocus
						/>
						<RunNumberInput
							value={runNumber}
							onChange={handleRunNumberChange}
							inputRef={inputRef}
						/>
					</div>
					<DialogFooter>
						<Button disabled={isLoading} type='submit' onClick={handleSave}>
							{isLoading && <Icons.spinner className='w-4 h-4 mr-2 animate-spin'/>}Opslaan
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default RunNumberDialog;
