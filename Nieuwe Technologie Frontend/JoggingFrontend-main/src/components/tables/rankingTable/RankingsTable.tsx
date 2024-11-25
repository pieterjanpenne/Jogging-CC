import React, {useState, useEffect, useCallback} from 'react';
import {fetchRankings} from '@/services/RankingService';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import {RankingCategory} from '@/types';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {Input} from "@/components/ui/input.tsx";

const RankingsTable: React.FC = () => {
    const [rankings, setRankings] = useState<RankingCategory[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize] = useState<number>(100);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [genderFilter, setGenderFilter] = useState<string>('all');
    const [personNameFilter, setPersonNameFilter] = useState<string>('');

    useEffect(() => {
        (async () => {
            try {
                const {data, total} = await fetchRankings({
                    pageNumber: page,
                    pageSize,
                    orderBy: 'a',
                });
                setRankings(data);
                setTotalPages(Math.ceil(total / pageSize));
            } catch (error) {
                console.error('Failed to fetch rankings', error);
            }
        })();
    }, []);

    const handleGenderFilterChange = (value: string) => {
        setGenderFilter(value);
        setPage(1);
    };

    const getAgeFromCategory = (category: string): number => {
        const match = category.match(/(\d+)([+-]?)$/);
        if (match) {
            const age = parseInt(match[1], 10);
            const modifier = match[2];
            if (modifier === '+') {
                return age + 100; // Ensure 55+ comes after 55
            }
            return age;
        }
        return 0;
    };

    const sortedCategories = (categories: RankingCategory[]) => {
        return categories.sort((a, b) => {
            const categoryA = Object.keys(a)[0];
            const categoryB = Object.keys(b)[0];
            return getAgeFromCategory(categoryA) - getAgeFromCategory(categoryB);
        });
    };

    const filterByName = (entry: { person: { firstName: string; lastName: string; } }) => {
        const fullName = `${entry.person.firstName} ${entry.person.lastName}`.toLowerCase();
        return fullName.includes(personNameFilter.toLowerCase());
    };

    const filterCategories = (categories: RankingCategory[]) => {
        return categories
            .filter(category => genderFilter === 'all' ? true : Object.keys(category)[0].startsWith(genderFilter))
            .map(category => {
                const filteredCategory: RankingCategory = {};
                Object.keys(category).forEach(cat => {
                    filteredCategory[cat] = category[cat].filter(filterByName);
                });
                return filteredCategory;
            })
            .filter(category => Object.values(category).some(entries => entries.length > 0));
    };

    return (
        <>
            <p className="text-center">
                U dient zich te registreren op de website om opgenomen te kunnen worden in het klassement. Gebruik
                hiervoor het e-mailadres dat u opgaf tijdens de inschrijvingen van een voorgaande jogging.
            </p>
            <p className="text-center">
                Een persoonlijk account helpt ons fouten te voorkomen en zorgt voor een vlotte inschrijving bij
                loopwedstrijden.
            </p>
            <p className="text-center">
                Bij vragen of correcties mail naar <a className="underline"
                                                      href="mailto:info@kozirunners.be">info@kozirunners.be</a>.
            </p>
            <div className='flex items-center justify-between pb-3 gap-2'>
                <Input placeholder='Zoek personen...' onChange={(e) => setPersonNameFilter(e.target.value)}/>
                <Select onValueChange={handleGenderFilterChange} defaultValue="all">
                    <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Select Gender'/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Gender</SelectLabel>
                            <SelectItem value='all'>Alle</SelectItem>
                            <SelectItem value='M'>Mannen</SelectItem>
                            <SelectItem value='V'>Vrouwen</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className='grid w-full md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6'>
                {filterCategories(sortedCategories(rankings))
                    .map((category, index) => (
                        <div
                            key={index}
                            className='p-3 border rounded-lg shadow-md bg-slate-50 dark:bg-slate-800'
                        >
                            {Object.keys(category).map((cat) => (
                                <div key={cat}>
                                    <h2 className='w-full mb-4 text-xl font-bold text-center'>
                                        {cat.split("$").join(" ")}
                                    </h2>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableCell>Persoon</TableCell>
                                                <TableCell className='text-center'>Punten</TableCell>
                                                <TableCell className='text-center'>
                                                    Participaties
                                                </TableCell>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {category[cat]
                                                .map((entry, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{`${entry.person.firstName} ${entry.person.lastName}`}</TableCell>
                                                        <TableCell className='text-center'>
                                                            {entry.points}
                                                        </TableCell>
                                                        <TableCell className='text-center'>
                                                            {entry.amountOfRaces}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ))}
                        </div>
                    ))}
            </div>
        </>
    );
};

export default RankingsTable;
