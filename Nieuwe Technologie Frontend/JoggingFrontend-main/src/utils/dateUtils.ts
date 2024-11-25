import { parseISO, format } from 'date-fns';

function isValidDate(date: Date): boolean {
	return !isNaN(date.getTime());
}

export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};
	return date.toLocaleDateString('nl-BE', options); // Corrected locale code
}

export function extractTime(timeString: string): string {
	const isoMatch = timeString.match(
		/^(\d{4}-\d{2}-\d{2}T)?(\d{2}:\d{2}:\d{2})/
	);
	if (isoMatch) {
		return isoMatch[2];
	}
	return timeString;
}

export function removeMilliseconds(timeString: string): string {
	const match = timeString.match(/(\d{2}:\d{2}:\d{2})(\.\d{3})?/);
	if (match) {
		return match[1];
	}
	return timeString;
}

export function addTimes(runTime: string, gunTime: string | null): string {
	if (gunTime) {
		gunTime = extractTime(gunTime);
	}

	const runTimeMatch = runTime.match(/(\d{2}:\d{2}:\d{2})/);
	if (!runTimeMatch) {
		console.error('Invalid run time format');
		return '00:00:00';
	}
	const runTimeMain = runTimeMatch[1];

	const [runHours, runMinutes, runSeconds] = runTimeMain.split(':').map(Number);
	const [gunHours, gunMinutes, gunSeconds] = gunTime
		? gunTime.split(':').map(Number)
		: [0, 0, 0];

	const totalSeconds = runSeconds + gunSeconds;
	const totalMinutes = runMinutes + gunMinutes + Math.floor(totalSeconds / 60);
	const totalHours = runHours + gunHours + Math.floor(totalMinutes / 60);

	const finalSeconds = totalSeconds % 60;

	return `${String(totalHours).padStart(2, '0')}:${String(
		totalMinutes % 60
	).padStart(2, '0')}:${String(finalSeconds).padStart(2, '0')}`;
}

export function formatTime(dateString: string): string {
	try {
		const date = parseISO(dateString);
		if (!isValidDate(date)) {
			console.error('Failed to parse date:', dateString);
			return '00:00:00';
		}

		return format(date, 'HH:mm:ss');
	} catch (error) {
		console.error('Error parsing date string:', error);
		return '00:00:00';
	}
}
