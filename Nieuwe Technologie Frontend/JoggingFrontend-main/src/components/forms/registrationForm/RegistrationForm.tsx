import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Button} from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {FormValues, registrationschema} from './RegistrationFormSetup';
import {
    createRegistration,
    createPrivateRegistration,
} from '@/services/RegistrationService';
import {fetchCompetition} from '@/services/CompetitionService';
import {toast} from 'sonner';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '@/routes/auth/context/AuthProvider';
import {PersonAutoComplete} from "@/components/autoComplete/PersonAutoComplete.tsx";
import {Person} from "@/types.ts";
import {Icons} from "@/lib/Icons.tsx";

type DistanceType = string;

interface RegistrationFormProps {
    competitionId: number;
    usePrivatePost?: boolean;
}


export function RegistrationForm({
                                     competitionId,
                                     usePrivatePost = false,
                                 }: RegistrationFormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(registrationschema),
        defaultValues: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            gender: undefined,
            birthDate: '',
            distanceName: '',
            address: {
                street: '',
                zipCode: '',
                city: '',
                houseNumber: '',
            },
        },
    });

    const navigate = useNavigate();
    const {user} = useAuth();
    const [distances, setDistances] = useState<DistanceType[]>([]);
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [focused, setFocused] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    useEffect(() => {
        if (selectedPerson != null) {
            form.setValue('firstName', selectedPerson.firstName);
            form.setValue('lastName', selectedPerson.lastName);
            form.setValue('email', selectedPerson.email ?? '');
            form.setValue('gender', selectedPerson.gender);
            form.setValue('birthDate', selectedPerson.birthDate);
            form.setValue('address.street', selectedPerson?.address?.street ?? '');
            form.setValue('address.zipCode', selectedPerson?.address?.zipCode ?? '');
            form.setValue('address.city', selectedPerson?.address?.city ?? '');
            form.setValue('address.houseNumber', selectedPerson?.address?.houseNumber ?? '');
        }
    }, [selectedPerson]);

    useEffect(() => {
        (async () => {
            const loadCompetitionDetails = async () => {
                try {
                    const competition = await fetchCompetition(competitionId);
                    if (competition) {
                        const distanceOptions = Object.keys(competition.distances || {});
                        setDistances(distanceOptions);
                    }
                } catch (error) {
                    console.error('Failed to fetch competition details:', error);
                }
            };

            await loadCompetitionDetails();
        })();
    }, [competitionId]);

    const resetForm = () => {
        setSelectedPerson(null);
        form.reset({
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            gender: undefined,
            birthDate: '',
            distanceName: '',
            address: {
                street: '',
                zipCode: '',
                city: '',
                houseNumber: '',
            },
        });
    }

    const onSubmit = async (values: FormValues) => {
        setIsLoading(true);
        try {
            const registrationData = {
                distanceName: values.distanceName as DistanceType,
                competitionId,
                email: values.email ?? undefined,
                person: {
                    lastName: values.lastName,
                    firstName: values.firstName,
                    birthDate: values.birthDate,
                    gender: values.gender,
                    address: {
                        houseNumber: values.address.houseNumber ?? '',
                        street: values.address.street ?? '',
                        zipCode: values.address.zipCode ?? '',
                        city: values.address.city ?? '',
                    },
                    phoneNumber: values.phoneNumber ?? undefined,
                },
            };

            if (usePrivatePost) {
                const privateRegistrationData = {personId: selectedPerson != null ? selectedPerson.id : -1, ...registrationData};
                await createPrivateRegistration(privateRegistrationData);
            } else {
                await createRegistration(registrationData);
            }

            toast.success('Registratie succesvol');

            resetForm();

            if (user?.profile?.role !== 'Admin') {
                navigate('/');
            }
        } catch (error: any) {
            if (error.response.status === 409) {
                toast.error(error.response.data);
            } else {
                toast.error('Registratie mislukt. Probeer het opnieuw.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const normalizeValue = (value: string | null | undefined) => value ?? '';

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8'>
                <div className='flex flex-col w-full gap-3 md:flex-row'>
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({field}) => (
                            <FormItem className="w-full">
                                <FormLabel>Voornaam*</FormLabel>
                                <FormControl>
                                    {usePrivatePost
                                        ?  (<PersonAutoComplete
                                            {...field}
                                            disabled={!!selectedPerson}
                                            selectedPerson={selectedPerson}
                                            setSelectedPerson={setSelectedPerson}
                                            placeholder='Geef je voornaam'
                                            onFocus={() => setFocused(true)}
                                            onBlur={() => setFocused(false)}
                                            focused={focused}
                                            resetForm={resetForm}
                                        />)
                                        : (<Input
                                        placeholder='Geef je voornaam'
                                        {...field}
                                        value={normalizeValue(field.value)}
                                    />)}

                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='lastName'
                        render={({field}) => (
                            <FormItem className='w-full'>
                                <FormLabel>Achternaam*</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={!!selectedPerson}
                                        placeholder='Geef je achternaam'
                                        {...field}
                                        value={normalizeValue(field.value)}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <div className='flex flex-col w-full gap-3 md:flex-row'>
                    <FormField
                        control={form.control}
                        name='birthDate'
                        render={({field}) => (
                            <FormItem className='w-full'>
                                <FormLabel>Geboortedatum*</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={!!selectedPerson}
                                        type='date'
                                        placeholder='YYYY-MM-DD'
                                        max='9999-12-31'
                                        {...field}
                                        value={normalizeValue(field.value)}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='email'
                        render={({field}) => (
                            <FormItem className='w-full'>
                                <FormLabel>Email Adres</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={!!selectedPerson}
                                        placeholder='user@example.com'
                                        {...field}
                                        value={normalizeValue(field.value)}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

{/*                <div className='flex flex-col w-full gap-3 md:flex-row'>
                    <FormField
                        control={form.control}
                        name='phoneNumber'
                        render={({field}) => (
                            <FormItem className='w-full'>
                                <FormLabel>Telefoonnummer</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={!!selectedPerson}
                                        placeholder='Geef je telefoonnummer'
                                        {...field}
                                        value={normalizeValue(field.value)}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='ibanNumber'
                        render={({field}) => (
                            <FormItem className='w-full'>
                                <FormLabel>IBAN Nummer</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={!!selectedPerson}
                                        placeholder='BE95'
                                        {...field}
                                        value={normalizeValue(field.value)}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>*/}

                <div className='flex flex-col justify-around w-full gap-3 md:flex-row '>
                    <FormField
                        control={form.control}
                        name='gender'
                        render={({field}) => (
                            <FormItem className='w-full'>
                                <FormLabel>Gender*</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        disabled={!!selectedPerson}
                                        onValueChange={field.onChange}
                                        value={field.value || ''}
                                        className='flex pt-2 space-y-0'
                                    >
                                        <FormItem className='flex items-center space-x-3 space-y-0'>
                                            <FormControl>
                                                <RadioGroupItem value='V'/>
                                            </FormControl>
                                            <FormLabel className='font-normal'>Vrouw</FormLabel>
                                        </FormItem>
                                        <FormItem className='flex items-center space-x-3 space-y-0'>
                                            <FormControl>
                                                <RadioGroupItem value='M'/>
                                            </FormControl>
                                            <FormLabel className='font-normal'>Man</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='distanceName'
                        render={({field}) => (
                            <FormItem className='w-full'>
                                <FormLabel>Afstand*</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Selecteer een afstand'/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Afstanden</SelectLabel>
                                                {distances.map((distance) => (
                                                    <SelectItem key={distance} value={distance}>
                                                        {distance}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <div className='p-4 mt-6 space-y-4 border rounded-md'>
                    <h3 className='text-lg font-medium'>Adres Details</h3>
                    <div className='flex space-x-3'>
                        <FormField
                            control={form.control}
                            name='address.zipCode'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Post Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={!!selectedPerson}
                                            {...field}
                                            value={normalizeValue(field.value)}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='address.city'
                            render={({field}) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Stad/Gemeente*</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={!!selectedPerson}
                                            {...field}
                                            value={normalizeValue(field.value)}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex space-x-3'>
                        <FormField
                            control={form.control}
                            name='address.street'
                            render={({field}) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Straat</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={!!selectedPerson}
                                            {...field}
                                            value={normalizeValue(field.value)}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='address.houseNumber'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Huisnummer</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={!!selectedPerson}
                                            {...field}
                                            value={normalizeValue(field.value)}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Button
                    type='submit'
                    className='w-full'
                    disabled={form.formState.isSubmitting}
                >
                    {isLoading && <Icons.spinner className='w-4 h-4 mr-2 animate-spin'/>}Registreren
                </Button>
            </form>
        </Form>
    );
}
