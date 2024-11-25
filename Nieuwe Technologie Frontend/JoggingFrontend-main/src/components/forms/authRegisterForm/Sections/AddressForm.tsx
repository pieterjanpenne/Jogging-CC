import React, {Dispatch, SetStateAction} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {AddressInfo, addressSchema} from './AddressFormSetup';

interface AddressInfoProps {
    onDataChange: (data: AddressInfo) => void;
    setValidateCurrentForm: React.MutableRefObject<() => Promise<boolean>>;
    setIsChecked: Dispatch<SetStateAction<boolean>>;
    isChecked: boolean;
}

export const AddressInfoComponent: React.FC<AddressInfoProps> = ({
                                                                     onDataChange,
                                                                     setValidateCurrentForm,
                                                                     setIsChecked,
                                                                     isChecked,
                                                                 }) => {
    const form = useForm<AddressInfo>({
        resolver: zodResolver(addressSchema),
        mode: 'onTouched',
        defaultValues: {
            street: '',
            zipCode: '',
            city: '',
            houseNumber: '',
        },
    });

    const {control, handleSubmit, watch} = form;

    React.useEffect(() => {
        setValidateCurrentForm.current = async () => {
            return new Promise((resolve) => {
                handleSubmit(
                    (data) => {
                        onDataChange(data);
                        resolve(true);
                    },
                    (errors) => {
                        console.error('Validation errors:', errors);
                        resolve(false);
                    }
                )();
            });
        };
    }, [handleSubmit, onDataChange]);

    React.useEffect(() => {
        const subscription = watch((value) => {
            onDataChange({
                ...value,
                city: value.city || '',
            });
        });
        return () => subscription.unsubscribe();
    }, [watch, onDataChange]);

    return (
        <Form {...form}>
            <form className='w-full'>
                <div className='flex space-x-3'>
                    <FormField
                        control={control}
                        name='zipCode'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Postcode</FormLabel>
                                <Input
                                    {...field}
                                    placeholder='9000'
                                    value={field.value ?? ''}
                                />
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name='city'
                        render={({field}) => (
                            <FormItem className='w-full'>
                                <FormLabel>Stad/Gemeente*</FormLabel>
                                <Input
                                    {...field}
                                    placeholder='Gent'
                                    value={field.value ?? ''}
                                />
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex space-x-3'>
                    <FormField
                        control={control}
                        name='street'
                        render={({field}) => (
                            <FormItem className='w-full'>
                                <FormLabel>Straat</FormLabel>
                                <Input
                                    {...field}
                                    placeholder='Dorpstraat'
                                    value={field.value ?? ''}
                                />
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name='houseNumber'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Huisnummer</FormLabel>
                                <Input {...field} placeholder='12' value={field.value ?? ''}/>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <div>
                    <input
                        id='privacy-policy'
                        type='checkbox'
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                        className='form-checkbox'
                    />
                    <label htmlFor='privacy-policy' className='text-sm text-gray-700'>
                        &nbsp;Ik ga akkoord met de{' '}
                        <a href='/privacy-policy' target='_blank' className='text-blue-500 underline'>
                            privacyvoorwaarden
                        </a>{' '}
                        en{' '}
                        <a href='/algemene-voorwaarden' target='_blank' className='text-blue-500 underline'>
                            algemene voorwaarden
                        </a>.
                    </label>
                </div>
            </form>
        </Form>
    );
};
