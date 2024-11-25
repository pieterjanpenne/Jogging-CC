import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AuthService from '@/services/AuthService';
import { Person } from '@/types';

type ContextUser = {
	user: Person | undefined;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	register: (email: string, password: string, person: Person) => Promise<void>;
	checkEmail: (email: string) => Promise<void>;
	changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
	setUser: (user: Person | undefined) => void;
	isLoading: boolean;
};

const AuthContext = createContext<ContextUser>({
	user: undefined,
	login: async () => {},
	logout: async () => {},
	register: async () => {},
	checkEmail: async () => {},
	changePassword: async () => {},
	setUser: () => {},
	isLoading: false,
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children?: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<Person | undefined>(undefined);
	const [isLoading, setLoading] = useState<boolean>(true);
	const navigate = useNavigate();

	const verifyUser = async () => {
		setLoading(true);
		try {
			const response = await AuthService.verifyToken();
			setUser(response.person);
			console.log('Token is valid, user set.');
		} catch (error) {
			console.error('Token verification failed:', error);
			//toast('Sessie verlopen, gelieve opnieuw in te loggen.');
			//navigate('/auth/login');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		verifyUser();
	}, []);

	const login = async (email: string, password: string) => {
		setLoading(true);
		try {
			const data = await AuthService.login({ email, password });
			setUser(data.person);

			if (data.person.profile?.role === 'User') navigate('/account/dashboard');
			if (data.person.profile?.role === 'Admin') navigate('/admin/dashboard');
			console.log('LOGIN USER SUCCESS');
		} catch (error) {
			console.error('LOGIN USER ERROR', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		setLoading(true);
		try {
			await AuthService.logout();
			setUser(undefined);
			navigate('/auth/login');
		} catch (error) {
			console.error('LOGOUT Error', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const register = async (
		email: string,
		password: string,
		newPerson: Person
	) => {
		setLoading(true);
		try {
			const response = await AuthService.register({
				email,
				password,
				person: newPerson,
			});
			const { person: registeredPerson } = response;
			setUser(registeredPerson);
			toast(
				'Succesvol geregistreerd. Gelieve eerst je account te bevestigen met de mail die is verzonden.'
			);
			navigate('/auth/login');
		} catch (error) {
			console.error('REGISTER Error', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};
	const checkEmail = async (email: string) => {
		setLoading(true);
		try {
			await AuthService.checkEmail({
				email
			});
		} catch (error) {
			if (error === 'This email address is already registered.') {
				toast('Er bestaat al een account met dit e-mailadres.');
			} else {
				console.error('Email check mislukt:', error);
				toast('Email check mislukt: Onbekende fout');
			}
			throw error;
		} finally {
			setLoading(false);
		}
	};
	const changePassword = async (oldPassword: string, newPassword: string) => {
		setLoading(true);
		try {
			await AuthService.changePassword(oldPassword, newPassword);
		} catch (error) {
			if(error === "Invalid old password") {
				toast.error('Incorrect oud wachtwoord');
			} else {
				toast.error(`Wachtwoord bijwerken mislukt: ${error}`);
			}
			throw error;
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthContext.Provider
			value={{ user, login, logout, register, checkEmail, changePassword, setUser, isLoading }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
