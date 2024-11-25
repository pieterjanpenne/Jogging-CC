import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import React, {useState} from "react";
import {adminDeletePerson} from "@/services/PersonService.ts";
import {toast} from "sonner";
import {Icons} from "@/lib/Icons.tsx";

interface DeletePersonDialogProps {
    personId: number;
    isWarningOpen: boolean;
    setIsWarningOpen: (open: boolean) => void;
    refreshPersons: () => void;
}

const DeletePersonDialog: React.FC<DeletePersonDialogProps> = ({
                                                              personId,
                                                              refreshPersons,
                                                              isWarningOpen,
                                                              setIsWarningOpen,
                                                          }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            if(personId) {
                await adminDeletePerson(personId);
                toast.success('Persoon succesvol verwijderd');
                refreshPersons();
            } else {
                toast.error('Fout bij het verwijderen van de persoon');
            }
        } catch (error) {
            toast.error('Fout bij het verwijderen van de persoon');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (<Dialog open={isWarningOpen} onOpenChange={() => setIsWarningOpen(false)}>
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
    </Dialog>)
};

export default DeletePersonDialog;