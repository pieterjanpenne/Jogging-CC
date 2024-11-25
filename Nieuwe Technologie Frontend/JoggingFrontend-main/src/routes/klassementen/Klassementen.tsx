import Footer from '@/components/footer/Footer';
import SimpleNavBar from '@/components/nav/SimpleNavBar';
import RankingsTable from "@/components/tables/rankingTable/RankingsTable.tsx";
import RegulationsTable from "@/components/tables/regulationTable/RegulationsTable.tsx";

export default function Klassementen() {
    return (
        <div className='flex flex-col justify-between min-h-screen'>
            <div className='flex flex-col items-center w-full'>
                <SimpleNavBar/>
                <div
                    className='flex flex-col items-center justify-center w-full mt-24 space-y-6 md:space-y-0 md:max-w-3xl md:px-6 lg:max-w-5xl md:justify-evenly md:flex-row md:space-x-0'>
                    <div className='flex flex-col items-center justify-center w-full px-3 py-3 space-y-3 md:px-0'>
                        <h1 className='text-5xl font-semibold text-center lg:text-6xl'>
                            Klassementen
                        </h1>
                        <RankingsTable/>
                    </div>
                </div>
                <div className='flex flex-col gap-3'>
                    <h2 className='text-3xl text-center'>Reglement</h2>
                    <RegulationsTable/>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

