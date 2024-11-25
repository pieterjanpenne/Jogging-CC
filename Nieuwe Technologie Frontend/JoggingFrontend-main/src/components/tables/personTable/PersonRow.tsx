'use client';

import React, {useState} from 'react';
import {TableCell, TableRow} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {DotsHorizontalIcon} from '@radix-ui/react-icons';
import {formatDate} from '@/utils/dateUtils';
import {Person} from '@/types';
import ChangeRoleDialog from '@/components/dialog/ChangeRoleDialog';
import DeletePersonDialog from "@/components/dialog/DeletePersonDialog.tsx";
import ChangePersonEmailDialog from "@/components/dialog/ChangePersonEmailDialog.tsx";

interface PersonRowProps {
    person: Person;
    refreshPersons: () => void;
    onEdit: (person: Person) => void;
}

const PersonRow: React.FC<PersonRowProps> = ({
                                                 person,
                                                 refreshPersons,
                                                 onEdit,
                                             }) => {
    const [isPersonChangeOpen, setPersonChangeOpen] = useState(false);
    const [isEmailChangeOpen, setEmailChangeOpen] = useState(false);
    const [isWarningOpen, setIsWarningOpen] = useState(false);

    const handleEdit = () => {
        onEdit(person);
    };

    const handleOpenChangeRoleDialog = () => {
        setPersonChangeOpen(true);
    };
    const handleOpenChangeEmailDialog = () => {
        setEmailChangeOpen(true);
    };

    if (person.id === undefined) {
        return null; // or handle the undefined case appropriately
    }

    return (
        <>
            <TableRow>
                <TableCell>{person.firstName}</TableCell>
                <TableCell>{person.lastName}</TableCell>
                <TableCell>{person.email ?? ''}</TableCell>
                <TableCell>{formatDate(person.birthDate)}</TableCell>
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='ghost'>
                                <span className='sr-only'>Open menu</span>
                                <DotsHorizontalIcon/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={handleEdit}>Bewerk</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleOpenChangeEmailDialog}>Bewerk e-mailadres</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleOpenChangeRoleDialog}>
                                Verander rol
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsWarningOpen(true)}>
                                Verwijder
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
            <ChangeRoleDialog
                personId={person.id}
                personName={`${person.firstName} ${person.lastName}`}
                initialRole={person.profile?.role as 'Admin' | 'User'}
                isDialogOpen={isPersonChangeOpen}
                setDialogOpen={setPersonChangeOpen}
                onRoleUpdated={refreshPersons}
            />
            <DeletePersonDialog
                personId={person.id}
                isWarningOpen={isWarningOpen}
                setIsWarningOpen={setIsWarningOpen}
                refreshPersons={refreshPersons}
            />
            <ChangePersonEmailDialog
                person={person}
                isChangePersonEmailDialogOpen={isEmailChangeOpen}
                setChangePersonEmailDialogOpen={setEmailChangeOpen}
                refreshPersons={refreshPersons}
            />

        </>
    );
};

export default PersonRow;
