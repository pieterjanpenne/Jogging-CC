import apiClient from './apiClient';

interface PaymentRequest {
	amountInCents: number;
}

interface PaymentResponse {
	url: string;
}

// Create a new payment
export const createPayment = async (
	competitionID: number,
	paymentData: PaymentRequest
): Promise<PaymentResponse> => {
	try {
		const response = await apiClient.post(
			`Payment/${competitionID}`,
			paymentData
		);
		console.log('API response data:', response.data); // Log the response data

		// Since response.data is a string URL, return it as an object with a url property
		return { url: response.data } as PaymentResponse;
	} catch (error: any) {
		console.error(
			`Failed to create payment for competition with competitionID ${competitionID}:`,
			error.message
		);
		throw new Error(
			`Could not create payment for competition with competitionID ${competitionID}. Please try again later.`
		);
	}
};
