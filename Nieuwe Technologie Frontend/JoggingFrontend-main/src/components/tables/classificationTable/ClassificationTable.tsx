import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {RankingCategory} from "@/types.ts";

interface ClassificationsTableProps {
    ranking: { [key: string]: RankingCategory[] }
}

const ClassificationsTable = ({ ranking }: ClassificationsTableProps) => {
    const key = Object.keys(ranking)[0];
    const values = Object.values(ranking)[0];

    const topEntries = values.map(value => {
        const groupKey = Object.keys(value)[0];
        const entries = Object.values(value)[0];
        const top3 = entries.slice(0, 3);
        return { groupKey, top3 };
    });

    return (
        <div className='p-3 border shadow-md rounded-xl dark:bg-slate-950'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='text-center'>Afstand</TableHead>
                        {topEntries.map((entry, index) => (
                            <TableHead key={index} className='text-center'>{entry.groupKey}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[1, 2, 3].map((place) => (
                        <TableRow key={place}>
                            <TableCell className="text-center">{place}e</TableCell>
                            {topEntries.map((entry, index) => {
                                const person = entry.top3[place - 1]?.person; // Get the person or undefined
                                return (
                                    <TableCell key={index} className='text-center'>
                                        {person ? `${person.firstName} ${person.lastName}` : ''}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
                <TableCaption>Winnaars van de {key.toLowerCase().replace("$", " ")} categorie</TableCaption>
            </Table>
        </div>
    );
};

export default ClassificationsTable;
