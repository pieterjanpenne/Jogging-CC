import React, { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { uploadCsv } from '@/services/ResultsService';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import CompetitionTable from '@/components/tables/competitionParticipantsTable/CompetitionTable';
import LooptijdToewijzenDialog from '@/components/dialog/LooptijdToewijzenDialog';
import { Registration, Competition } from '@/types';
import {
	Tooltip,
	TooltipProvider,
	TooltipTrigger,
} from '@radix-ui/react-tooltip';

interface LooptijdOpmetenProps {
	competitionId: number;
	competition: Competition;
}

export default function LooptijdOpmeten({
	competitionId,
	competition,
}: LooptijdOpmetenProps) {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploadStatus, setUploadStatus] = useState<string>('');
	const [progress, setProgress] = useState<number>(0);
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const [refreshKey, setRefreshKey] = useState(0);

	const refreshData = () => {
		setRefreshKey((prevKey) => prevKey + 1);
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] || null;
		setSelectedFile(file);
	};

	const handleUpload = async () => {
		if (!selectedFile) {
			setUploadStatus('Selecteer een bestand');
			toast.error('Selecteer een bestand');
			return;
		}

		setIsUploading(true);
		setProgress(0);

		try {
			setTimeout(() => setProgress(66), 500);

			const success = await uploadCsv(competitionId.toString(), selectedFile);
			if (success) {
				setUploadStatus('Bestand succesvol geüpload');
				toast.success('Bestand succesvol geüpload');
				setProgress(100);
				refreshData(); // Refresh data after successful upload
			} else {
				setUploadStatus('Uploaden van bestand mislukt');
				toast.error('Uploaden van bestand mislukt');
				setProgress(0);
			}
		} catch (error: any) {
			let errorMessage = error.message;
			console.error('Failed to upload CSV file:', errorMessage);
			setUploadStatus(errorMessage);
			toast.error(`Uploaden van bestand mislukt: ${errorMessage}`);
			setProgress(0);
		} finally {
			setIsUploading(false);
		}
	};

	const renderDatePickerButton = (
		participant: Registration,
		refreshData: () => void
	) => (
		<LooptijdToewijzenDialog
			resultId={participant.id.toString()}
			runTime={participant.runTime}
			onUpdate={refreshData}
		/>
	);

	return (
		<Card>
			<CardHeader className='relative'>
				<CardTitle>Looptijd Opmeten</CardTitle>
				<CardDescription>
					Voeg toe, bewerk of verwijder looptijden voor een wedstrijd hier.
				</CardDescription>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild className='absolute right-5 top-1 md:top-3'>
							<Button className='w-10 p-2' onClick={refreshData}>
								<svg
									width='15'
									height='15'
									viewBox='0 0 15 15'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										d='M1.84998 7.49998C1.84998 4.66458 4.05979 1.84998 7.49998 1.84998C10.2783 1.84998 11.6515 3.9064 12.2367 5H10.5C10.2239 5 10 5.22386 10 5.5C10 5.77614 10.2239 6 10.5 6H13.5C13.7761 6 14 5.77614 14 5.5V2.5C14 2.22386 13.7761 2 13.5 2C13.2239 2 13 2.22386 13 2.5V4.31318C12.2955 3.07126 10.6659 0.849976 7.49998 0.849976C3.43716 0.849976 0.849976 4.18537 0.849976 7.49998C0.849976 10.8146 3.43716 14.15 7.49998 14.15C9.44382 14.15 11.0622 13.3808 12.2145 12.2084C12.8315 11.5806 13.3133 10.839 13.6418 10.0407C13.7469 9.78536 13.6251 9.49315 13.3698 9.38806C13.1144 9.28296 12.8222 9.40478 12.7171 9.66014C12.4363 10.3425 12.0251 10.9745 11.5013 11.5074C10.5295 12.4963 9.16504 13.15 7.49998 13.15C4.05979 13.15 1.84998 10.3354 1.84998 7.49998Z'
										fill='currentColor'
										fillRule='evenodd'
										clipRule='evenodd'
									></path>
								</svg>
							</Button>
						</TooltipTrigger>
					</Tooltip>
				</TooltipProvider>
			</CardHeader>
			<CardContent>
				<div className='flex flex-col gap-3 md:flex-row'>
					<div className='flex w-full gap-3'>
						<Input
							placeholder='Selecteer CSV/TEXT-bestand'
							type='file'
							accept='.csv, .txt'
							onChange={handleFileChange}
							disabled={isUploading}
						/>
						<Button onClick={handleUpload} disabled={isUploading}>
							{isUploading ? 'Bezig met uploaden...' : 'Upload CSV'}
						</Button>
					</div>
					{/* <div className='w-full md:w-[60%] flex justify-center items-center'>
                        {isUploading && progress > 0 && <Progress value={progress} />}
                        {uploadStatus && <p>{uploadStatus}</p>}
                    </div> */}
				</div>
				<div className='mt-4'>
					<CompetitionTable
						competitionId={competitionId}
						renderActionButton={renderDatePickerButton}
						filterByRunNumber={true}
						showRunTime={true}
						refreshKey={refreshKey}
						competition={competition} // Pass competition down to CompetitionTable
					/>
				</div>
			</CardContent>
		</Card>
	);
}
