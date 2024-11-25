import React from "react";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/ui/table.tsx";

const RegulationsTable: React.FC = () => {

    return (<>
        <p className="text-center">
            Liep je in minstens 4 van de 6 joggings mee? Dan krijg je sowieso een naturaprijs
        </p>
        <p className="text-center">
            Op elke van de <strong>3 afstanden</strong> winnen de 3 lopers met de meeste punten een mooie geldprijs.
        </p>
        <Table>
            <TableHeader className="text-center">
                <TableRow>
                    <TableCell>Plaats</TableCell>
                    <TableCell className='text-center'>Kort</TableCell>
                    <TableCell className='text-center'>Midden</TableCell>
                    <TableCell className='text-center'>Lang</TableCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className='text-center'>1.</TableCell>
                    <TableCell className='text-center'>€13</TableCell>
                    <TableCell className='text-center'>€18</TableCell>
                    <TableCell className='text-center'>€25</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className='text-center'>2.</TableCell>
                    <TableCell className='text-center'>€9</TableCell>
                    <TableCell className='text-center'>€13</TableCell>
                    <TableCell className='text-center'>€18</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className='text-center'>3.</TableCell>
                    <TableCell className='text-center'>€6</TableCell>
                    <TableCell className='text-center'>€9</TableCell>
                    <TableCell className='text-center'>€13</TableCell>
                </TableRow>
            </TableBody>
        </Table>
        <p className="text-center">
            Er zijn telkens <strong>4 leeftijdscategorieën</strong>, ingedeeld per geboortejaar:
        </p>
        <p className="text-center">1. Geboren van 1989 tot 2009</p>
        <p className="text-center">2. Geboren van 1979 tot 1988</p>
        <p className="text-center">3. Geboren van 1969 tot 1978</p>
        <p className="text-center">4. Geboren voor 1969</p>
        <p className="text-center">Voor de <strong>dames en heren</strong> is er telkens een apart klassement</p>
        <br/>
        <p className="text-center underline"><a target="_blank" href="https://sites.google.com/view/evergemsejoggings/reglement-augustijn-criterium">Link naar het volledige reglement.</a></p>
    </>);
}

export default RegulationsTable;