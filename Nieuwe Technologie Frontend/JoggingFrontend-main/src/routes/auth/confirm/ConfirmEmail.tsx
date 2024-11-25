import * as React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Icons} from '@/lib/Icons';
import {toast} from 'sonner';
import AuthService from '@/services/AuthService';
import {useEffect} from "react";
import {Input} from "@/components/ui/input.tsx";
import {z} from "zod";

// Define types for your component props
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}


export function ConfirmEmail({className = '', ...props}: UserAuthFormProps) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const email = queryParams.get('email');

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
    const [emailAddress, setEmailAddress] = React.useState<string>(email ?? "");
    const [error, setError] = React.useState<string | null>(null);
    const emailSchema = z.string().email("Ongeldig e-mailadres");

    const validateEmail = (): boolean => {
        setError(null);

        const validation = emailSchema.safeParse(emailAddress);
        if (!validation.success) {
            setError(validation.error.errors[0].message);
            return false;
        }

        return true;
    };
    const navigator = useNavigate();

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            try {
                if (token) {
                    await AuthService.confirmEmail(token);
                    setError(null);
                    setIsSuccess(true);
                    toast.success('E-mailadres succesvol bevestigd');
                    navigator('/auth/login');
                }
            } catch (error: any) {
                if (error.response.status === 409) {
                    setError("Deze mail is al gebruikt om je  e-mailadres te bevestigen, gelieve een nieuwe aan te vragen.");
                } else {
                    toast.error('Er is iets misgegaan bij het bevestigen van je email adres');
                }
                console.error('Confirm error:', error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const requestNewConfirmEmail = async () => {
        try {
            validateEmail();
            setIsLoading(true);
            await AuthService.requestConfirmEmail(emailAddress);
            setError(null);
            toast.success(`Er is een nieuwe mail verstuurd om je account te bevestigen naar ${emailAddress}.`);
            setIsSuccess(true);
            navigator('/auth/login');
        } catch (error: any) {
            if(error.response.status === 429) {
                toast.error('Je kan maximaal 1x om de 5minuten een nieuwe mail aanvragen.');
            } else {
                toast.error('Er is iets misgegaan bij het aanvragen van een nieuwe e-mail, probeer het opnieuw.');
            }
        } finally {
            setIsLoading(false);
        }
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailAddress(e.target.value);
        setError(null);
    }

    return (
        <>
            <div className='flex flex-col space-y-2 text-center'>
                <h1 className='text-2xl font-semibold tracking-tight'>
                    Bevestig e-mailadres
                </h1>
                <div className={className} {...props}>
                    <form onSubmit={requestNewConfirmEmail}>
                        <div className='grid gap-2'>
                            <Input disabled={isLoading || isSuccess}
                                   value={emailAddress}
                                   onChange={handleEmailChange}
                                   type='email'
                                   placeholder='user@example.com'/>
                            <Button disabled={isLoading || isSuccess || error != null} onClick={requestNewConfirmEmail}>
                                {isLoading && (<Icons.spinner className='w-4 h-4 mr-2 animate-spin'/>)}
                                Vraag nieuwe mail aan
                            </Button>
                            {error && <p className="text-red-500">{error}</p>}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
