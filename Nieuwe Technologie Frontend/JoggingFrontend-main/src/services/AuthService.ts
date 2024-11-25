import axios, { AxiosError } from 'axios';
import { Person } from '@/types';

const API_URL = '';

interface AuthResponse {
	person: Person;
}

interface RegisterRequest {
	email: string;
	password: string;
	person: Person;
}

interface CheckEmailRequest {
	email: string;
}

interface LoginRequest {
	email: string;
	password: string;
}

interface ErrorResponse {
	message: string;
	[key: string]: any;
}

// Set Axios to include cookies with requests
axios.defaults.withCredentials = true;

function handleError(error: AxiosError<ErrorResponse>): Error | ErrorResponse {
	if (error.response) {
		const data: ErrorResponse = error.response.data;
		console.error('Data:', data);
		console.error('Status:', error.response.status);
		console.error('Headers:', error.response.headers);

		if (error.response.status === 409) {
			return data;
		}

		return new Error(data.message || 'An unknown error occurred');
	} else if (error.request) {
		console.error('No response received:', error.request);
		return new Error('No response from server');
	} else {
		console.error('Error message:', error.message);
		return new Error(error.message);
	}
}

class AuthService {
	static async login(credentials: LoginRequest): Promise<AuthResponse> {
		try {
			const response = await axios.post<AuthResponse>(
				`${API_URL}/login`,
				credentials
			);
			// The cookie should be handled automatically
			return response.data;
		} catch (error) {
			throw handleError(error as AxiosError<ErrorResponse>);
		}
	}

	static async logout(): Promise<void> {
		try {
			await axios.post(`${API_URL}/logout`);
			// The cookie should be invalidated automatically
		} catch (error) {
			throw handleError(error as AxiosError<ErrorResponse>);
		}
	}

	static async register(data: RegisterRequest): Promise<AuthResponse> {
		try {
			const response = await axios.post<AuthResponse>(
				`${API_URL}/register`,
				data
			);
			// The cookie should be handled automatically
			return response.data;
		} catch (error) {
			console.log(error);
			throw handleError(error as AxiosError<ErrorResponse>);
		}
	}

	static async checkEmail(data: CheckEmailRequest): Promise<void> {
		try {
			await axios.post(`${API_URL}/check-email`, {
				email: data.email
			});
		} catch (error) {
			throw handleError(error as AxiosError<ErrorResponse>);
		}
	}

	static async verifyToken(): Promise<AuthResponse> {
		try {
			const response = await axios.get<AuthResponse>(`${API_URL}/verify-token`);
			return response.data;
		} catch (error) {
			throw handleError(error as AxiosError<ErrorResponse>);
		}
	}

	static async changePassword(
		oldPassword: string,
		newPassword: string
	): Promise<void> {
		try {
			await axios.post(
				`${API_URL}/change-password`,
				{ oldPassword, newPassword },
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
		} catch (error) {
			throw handleError(error as AxiosError<ErrorResponse>);
		}
	}

	static async resetPassword(
		recoveryToken: string,
		newPassword: string
	): Promise<void> {
		try {
			await axios.post(`${API_URL}/reset-password`, {
				recovery_token: recoveryToken,
				newPassword,
			});
		} catch (error) {
			throw handleError(error as AxiosError<ErrorResponse>);
		}
	}

	static async confirmEmail(confirmToken: string): Promise<void> {
		try {
			await axios.post(`${API_URL}/confirm-email`, {
				confirm_token: confirmToken
			});
		} catch (error) {
			throw error;
		}
	}

	static async requestConfirmEmail(email: string): Promise<void> {
		try {
			await axios.post(`${API_URL}/request-confirm-mail`, { email });
		} catch (error) {
			throw error;
		}
	}

	static async requestPassword(email: string): Promise<void> {
		try {
			await axios.post(`${API_URL}/request-password`, { email });
		} catch (error) {
			throw handleError(error as AxiosError<ErrorResponse>);
		}
	}
}

export default AuthService;
