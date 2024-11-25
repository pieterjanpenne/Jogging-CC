import profilePicture from '@/assets/images/profilePicture.jpg';

export default function OverOns() {
    return (
        <div className='flex flex-col items-center space-y-6'>
            <h1 className='text-5xl font-semibold text-center' id='#joggings'>
                Over ons
            </h1>
            <h2 className='text-2xl text-center'>
                Het ontstaan van de Evergemse Joggings.
            </h2>

            <div className='flex flex-col items-center justify-around w-full gap-6 md:flex-row'>
                <div className='flex justify-center md:w-1/3'>
                    <img
                        src={profilePicture}
                        alt='Profielfoto van Jasper de Vries'
                        className='object-cover w-4/5 rounded-full md:w-full aspect-square'
                    />
                </div>
                <div className='space-y-6 md:w-2/3'>
                    <p className='text-justify md:text-left'>
                        De Evergemse joggings zijn een gezamenlijk initiatief van 6 verenigingen uit Evergem. Door onze
                        samenwerking streven we ernaar om de lokale joggings naar een hoger niveau te tillen.
                        Met nieuwe sponsors, aantrekkelijke prijzen en meer ondersteuning van ervaren hardlopers willen
                        we het lopen aantrekkelijker maken. Naast de mogelijkheid om de strijd aan te gaan met
                        lokale verenigingen zullen we ook onze prachtige looproutes buiten de
                        gemeente promoten om zo extra deelnemers aan te trekken. Op die manier ontdekken verenigingen 
                        uit andere regio's onze mooie landelijke omgeving.
                    </p>
                </div>
            </div>
        </div>
    );
}
