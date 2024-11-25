import React from 'react';
import { Link } from 'react-router-dom';
import SimpleNavBar from '@/components/nav/SimpleNavBar.tsx';
import Footer from '@/components/footer/Footer.tsx';

const PrivacyPolicy: React.FC = () => {
	return (
		<>
			<SimpleNavBar />
			<div className='flex flex-col items-center justify-between w-full min-h-screen'>
				<div>
					<div className='w-full h-full p-6 md:px-12'>
						<div className='w-full max-w-4xl pt-24 mx-auto '>
							<h1 className='mb-6 text-2xl font-semibold text-center md:text-start h-9'>
								Privacybeleid voor Kozirunners VZW
							</h1>
							<h1 className='text-lg font-semibold'>
								Contactgegevens van de verwerkende partij
							</h1>
							<div className='ml-4 opacity-95'>
								<p>Kozirunners VZW</p>
								<p>Linde 72</p>
								<p>9940 Sleidinge</p>
							</div>
							<h1 className='mt-4 text-lg font-semibold'>
								Verzamelde persoonsgegevens
							</h1>
							<p className='opacity-95'>
								We verzamelen de volgende persoonsgegevens van deelnemers aan
								onze loopwedstrijden:
							</p>
							<div className='ml-4 opacity-95'>
								<ul className='ml-6 list-disc'>
									<li>Naam</li>
									<li>Geboortedatum</li>
									<li>Woonplaats</li>
									<li>Geslacht</li>
									<li>E-mail (optioneel)</li>
									<li>Volledig adres (optioneel)</li>
									<li>IBAN-rekeningnummer (optioneel)</li>
								</ul>
							</div>
							<h1 className='mt-4 text-lg font-semibold'>
								Gebruik van persoonsgegevens
							</h1>
							<p className='opacity-95'>
								De verzamelde persoonsgegevens worden als volgt gebruikt:
							</p>
							<div className='ml-4 opacity-95'>
								<ul className='ml-6 list-decimal'>
									<li>
										<strong>Publicatie van klassementen:</strong>
										&nbsp;De naam en woonplaats van deelnemers worden
										publiekelijk weergegeven in de klassementen.
										Leeftijdscategorieën worden getoond op basis van de
										niet-gepubliceerde geboortedatum. E-mailadressen en
										geboortedata worden nooit publiekelijk vermeld.
									</li>
									<li>
										<strong>Uitbetaling van prijzengeld:</strong>
										&nbsp;Het IBAN-nummer wordt gebruikt voor de uitbetaling van
										prijzengeld aan deelnemers.
									</li>
								</ul>
							</div>
							<h1 className='mt-4 text-lg font-semibold opacity-95'>
								Bewaartermijn van persoonsgegevens
							</h1>
							<p className='opacity-95'>
								We bewaren persoonsgegevens zolang er geen expliciet verzoek tot
								verwijdering van het account is ingediend. Deelnemers kunnen hun
								persoonsgegevens laten wissen door een e-mail te sturen naar
								info@kozirunners.be of op de accountspagina via{' '}
								<Link
									className='text-blue-500 underline hover:text-blue-600'
									to='/admin/instellingen/verwijder-account'
								>
									deze link
								</Link>
								.
							</p>
							<h1 className='mt-4 text-lg font-semibold'>
								Uitwisseling met derde partijen
							</h1>
							<p className='opacity-95'>
								In geen enkel geval worden persoonsgegevens uitgewisseld met
								derde partijen.
							</p>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		</>
	);
};

export default PrivacyPolicy;
