import { Address } from '@/types';

export function formatAddress(address: Address | undefined): string {
	if (!address) {
		return 'No address provided';
	}

	// Build the address string dynamically, ignoring null or empty values
	let addressLines: string[] = [];

	// Check and add house number and street if available
	if (address.houseNumber || address.street) {
		let firstLine = '';
		if (address.houseNumber) {
			firstLine += address.houseNumber;
		}
		if (address.street) {
			firstLine += firstLine.length > 0 ? ' ' + address.street : address.street;
		}
		addressLines.push(firstLine);
	}

	// Check and add zip code and city if available
	if (address.zipCode || address.city) {
		let secondLine = '';
		if (address.zipCode) {
			secondLine += address.zipCode;
		}
		if (address.city) {
			secondLine += secondLine.length > 0 ? ' ' + address.city : address.city;
		}
		addressLines.push(secondLine);
	}

	// Join the lines into a single string, separated by newlines
	return addressLines.join('\n').trim();
}
