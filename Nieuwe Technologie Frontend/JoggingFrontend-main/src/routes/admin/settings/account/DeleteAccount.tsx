import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import React, {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {Icons} from "@/lib/Icons.tsx";
import {toast} from "sonner";
import {deletePerson} from "@/services/PersonService.ts";

const DeleteAccount = () => {
    const [isWarningOpen, setIsWarningOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await deletePerson();
            setIsWarningOpen(false);
            window.location.href = '/';
        } catch (error) {
            toast.error('Fout bij het verwijderen van de persoon');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (<Card>
        <CardHeader>
            <CardTitle>Verwijder account</CardTitle>
            <CardDescription>Verwijder hier je account.</CardDescription>
        </CardHeader>
        <CardContent>
            <Button className="bg-red-800 text-white hover:bg-red-700" onClick={() => setIsWarningOpen(true)}>Verwijder je account</Button>
            <Dialog open={isWarningOpen} onOpenChange={() => setIsWarningOpen(false)}>
                <DialogContent className='sm:max-w-[425px]'>
                    <DialogHeader>
                        <DialogTitle className="text-center">Waarschuwing</DialogTitle>
                        <DialogDescription className="text-center">
                            Wanneer je een account verwijdert verdwijnen al deze persoon zijn uitslagen definitief!
                            <br/>
                            <br/>
                            Bent u zeker dat u dit wilt doen?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <div className="text-center w-full">
                            <Button disabled={isLoading} className="mr-3" variant='outline' onClick={() => setIsWarningOpen(false)}>
                                Annuleren
                            </Button>
                            <Button disabled={isLoading} className="ml-3" type='button' onClick={handleDelete}>
                                {isLoading && <Icons.spinner className='w-4 h-4 mr-2 animate-spin'/>}Doorgaan
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </CardContent>
    </Card>);
}

export default DeleteAccount;