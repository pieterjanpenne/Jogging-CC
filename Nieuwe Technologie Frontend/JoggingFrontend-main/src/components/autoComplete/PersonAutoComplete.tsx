import * as React from 'react';

import {cn} from '@/lib/utils';
import {useEffect, useRef, useState} from "react";
import {Person} from "@/types.ts";
import {fetchPersons} from "@/services/PersonService.ts";
import PersonDropDown from "@/components/dropdowns/PersonDropDown.tsx";
import {cross} from 'react-icons-kit/icomoon/cross';
import {Icon} from "react-icons-kit";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    selectedPerson: Person | null;
    setSelectedPerson: React.Dispatch<React.SetStateAction<Person | null>>;
    focused: boolean;
    onFocus: () => void;
    onBlur: () => void;
    resetForm: () => void;
}

const DEBOUNCE_DELAY = 1000;
const BLUR_DELAY = 200;

const PersonAutoComplete = React.forwardRef<HTMLInputElement, InputProps>(
    ({className, focused, selectedPerson, setSelectedPerson, resetForm, onFocus, onBlur, ...props}, ref) => {
        const [inputValue, setInputValue] = useState('');
        const [suggestions, setSuggestions] = useState<Person[]>([]);
        const [isSearching, setIsSearching] = useState<boolean>(false);
        const [hasSearched, setHasSearched] = useState<boolean>(false);

        const focusedRef = useRef(focused);

        useEffect(() => {
            focusedRef.current = focused;
        }, [focused]);

        useEffect(() => {
            const handler = setTimeout(async () => {
                if (inputValue && focusedRef.current) {
                    await fetchSuggestions(inputValue);
                } else {
                    setSuggestions([]);
                }
            }, DEBOUNCE_DELAY);

            return () => {
                clearTimeout(handler);
            };
        }, [inputValue]);

        const fetchSuggestions = async (query: string) => {
            setIsSearching(true);
            try {
                setSuggestions([]);
                const response = await fetchPersons({
                    pageNumber: 0,
                    pageSize: 100,
                    searchValue: query
                });
                setSuggestions(response.data);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            } finally {
                setHasSearched(true);
                setIsSearching(false);
            }
        };

        const handleInputChange = (e: any) => {
            setHasSearched(false);
            setSuggestions([]);
            setInputValue(e.target.value);
        };

        const handlePersonSelect = (person: Person | null) => {
            setInputValue('');
            setSuggestions([]);
            setHasSearched(false);
            setSelectedPerson(person);
        };

        const handleClickOutside = () => {
            setTimeout(() => {
                    onBlur();
            }, BLUR_DELAY);
        };

        const clearInput = () => {
            setInputValue('');
            resetForm();
        };

        return (
            <div className="relative">
                <div className="relative">
                    <input
                        value={inputValue}
                        onInput={handleInputChange}
                        type='text'
                        onFocus={onFocus}
                        onBlur={handleClickOutside}
                        className={cn(
                            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {selectedPerson && (
                        <button
                            type="button"
                            className="absolute mt-[-6px] inset-y-0 right-0 flex items-center pr-3 pointer-events-auto focus:outline-none"
                            onClick={clearInput}
                        >
                            <Icon icon={cross} className="h-5 w-5 text-gray-400" />
                        </button>
                    )}
                </div>
                {isSearching && <div>Loading...</div>}
                {!isSearching && hasSearched && suggestions.length <= 0 && (
                    <ul>
                        <li>Geen personen gevonden</li>
                    </ul>
                )}
                {!isSearching && focused && hasSearched && suggestions.length > 0 && (
                    <ul className="absolute w-full z-10 mt-1 text-black bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                        {suggestions.map((suggestion) => (
                            <PersonDropDown setSelectedPerson={handlePersonSelect} person={suggestion}
                                            key={suggestion.id} {...props} />
                        ))}
                    </ul>
                )}
            </div>
        );
    }
);


export {PersonAutoComplete}