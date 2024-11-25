import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import {adminChangePersonEmail} from "@/services/PersonService";
import {toast} from "sonner";
import {Input} from "@/components/ui/input";
import {z} from "zod";
import {Icons} from "@/lib/Icons.tsx";
import {Person} from "@/types.ts";

interface ChangePersonEmailDialogProps {
    person: Person;
    isChangePersonEmailDialogOpen: boolean;
    setChangePersonEmailDialogOpen: (open: boolean) => void;
    refreshPersons: () => void;
}

const ChangePersonEmailDialog: React.FC<ChangePersonEmailDialogProps> = ({
                                                                             person,
                                                                             isChangePersonEmailDialogOpen,
                                                                             setChangePersonEmailDialogOpen,
                                                                             refreshPersons
                                                                         }) => {
    const [emailAddress, setEmailAddress] = useState<string>(person.email ?? '');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailChanged, setIsEmailChanged] = useState(false);
    const [isWarningOpen, setIsWarningOpen] = useState(false);
    const personName = `${person.firstName} ${person.lastName}`;
    const personEmail = person.email;

    useEffect(() => {
        if (personEmail !== emailAddress) {
            setIsEmailChanged(true);
        } else {
            setIsEmailChanged(false);
        }
    }, [emailAddress]);

    const emailSchema = z.union([
        z.string().email("Ongeldig e-mailadres"),
        z.string().length(0)
    ]);
    const validateEmail = () : boolean => {
        setErrorMessage(null);

        const validation = emailSchema.safeParse(emailAddress);
        if (!validation.success) {
            setErrorMessage(validation.error.errors[0].message);
            return false;
        }

        return true;
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailAddress(e.target.value.trim().toLowerCase());
        setErrorMessage(null);
    };

    const validateEmailChangeSubmit = () => {
        if(validateEmail()) {
            setIsWarningOpen(true);
        }
    };

    const handleEmailChangeSubmit = async () => {
        if(validateEmail()) {
            setIsLoading(true);
            try {
                if (person.id) {
                    await adminChangePersonEmail(person.id, emailAddress);
                    toast.success('Persoon e-mailadres succesvol gewijzigd');
                    setChangePersonEmailDialogOpen(false);
                    setIsWarningOpen(false);
                    person.email = emailAddress;
                } else {
                    toast.error('Fout bij het wijzigen van de persoon zijn e-mailadres');
                }
            } catch (error: any) {
                if (error.response.status === 409) {
                    toast.error('Dit e-mailadres is al in gebruik.');
                } else {
                    toast.error('Fout bij het wijzigen van de persoon zijn e-mailadres');
                }
                setIsWarningOpen(false);
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <>
            <Dialog open={isChangePersonEmailDialogOpen} onOpenChange={setChangePersonEmailDialogOpen}>
                <DialogContent className='sm:max-w-[425px]'>
                    <DialogHeader>
                        <DialogTitle className="text-center">Verander e-mailadres</DialogTitle>
                        <DialogDescription className="text-center">
                            Verander het e-mailadres van {personName}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='flex flex-col justify-center'>
                        <Input
                            value={emailAddress}
                            onChange={handleEmailChange}
                            type='email'
                            placeholder='user@example.com'
                        />
                        {errorMessage && (
                            <p className="text-red-500">{errorMessage}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setChangePersonEmailDialogOpen(false)}>
                            Annuleer
                        </Button>
                        <Button className="text-center" disabled={isLoading || !isEmailChanged}
                                onClick={validateEmailChangeSubmit}>
                            {isLoading && <Icons.spinner className='w-4 h-4 mr-2 animate-spin'/>}Opslaan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isWarningOpen} onOpenChange={setIsWarningOpen}>
                <DialogContent className='sm:max-w-[425px]'>
                    <DialogHeader>
                        <DialogTitle className="text-center">Bevestig wijziging</DialogTitle>
                        {emailAddress ?
                            <DialogDescription className="text-center">
                                Weet je zeker dat je het e-mailadres van {personName} wilt wijzigen naar {emailAddress}?
                            </DialogDescription> :
                            <DialogDescription className="text-center">
                                Weet je zeker dat je het e-mailadres van {personName} wilt verwijderen? <br/><br/>
                                Wanneer je een e-mailadres verwijdert zal deze persoon niet kunnen inloggen op zijn/haar account en zal deze persoon verdwijnen uit het klassement.
                            </DialogDescription>
                        }
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setIsWarningOpen(false)}>
                            Annuleer
                        </Button>
                        <Button className="text-center" disabled={isLoading} onClick={handleEmailChangeSubmit}>
                            {isLoading && <Icons.spinner className='w-4 h-4 mr-2 animate-spin'/>}Bevestig
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ChangePersonEmailDialog;
