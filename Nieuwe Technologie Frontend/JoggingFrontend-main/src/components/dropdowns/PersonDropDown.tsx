import React from "react";
import {Person} from "@/types.ts";

interface PersonDropDownProps {
    person: Person;
    props?: React.HTMLAttributes<HTMLLIElement>
    setSelectedPerson: (person: Person | null) => void;
}

const PersonDropDown: React.FC<PersonDropDownProps> = ({
                                                           person,
                                                           props,
                                                           setSelectedPerson
                                                       }) => {
    const handlePersonClick = () => {
        setSelectedPerson(person);
    }

    return (<li {...props} onClick={handlePersonClick} key={person.id} className="hover:opacity-50 hover:cursor-pointer">
        <div className="grid grid-cols-2 w-full">
            <p className="w-full text-sm text-center">
                <strong>Voornaam:</strong> {person.firstName}
            </p>
            <p className="w-full text-sm text-center">
                <strong>Achternaam:</strong> {person.lastName}
            </p>
            <p className="w-full text-sm text-center">
                <strong>Geboortedatum:</strong> {person.birthDate}
            </p>
            <p className="w-full text-sm text-center">
                <strong>Email:</strong> {person.email}
            </p>
        </div>
    </li>);
}
export default PersonDropDown;