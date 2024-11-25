import React from 'react';
import SimpleNavBar from '@/components/nav/SimpleNavBar.tsx';
import Footer from '@/components/footer/Footer.tsx';

const GeneralConditions: React.FC = () => {
	return (
		<>
			<SimpleNavBar />
			<div className='flex flex-col items-center justify-between w-full min-h-screen'>
				<div>
					<div className='w-full h-full p-6 md:px-12'>
						<div className='w-full max-w-4xl pt-24 mx-auto '>
							<h1 className='mb-6 text-2xl font-semibold text-center md:text-start h-9'>
								Algemene voorwaarden
							</h1>
							<ol className='flex flex-col gap-2 ml-6 list-decimal'>
								<li>
									<strong>Inschrijving en betaling:</strong>
									<ul className='flex flex-col gap-1 ml-6 list-disc '>
										<li>
											Het is niet verplicht om zich vooraf in te schrijven om
											deel te nemen aan een jogging.
										</li>
										<li>
											Betalingen worden onmiddellijk verwerkt en voorinschrijven
											kan tot op de wedstrijddag zelf.
										</li>
									</ul>
								</li>
								<li>
									<strong>Annulering door deelnemer:</strong>
									<ul className='ml-6 list-disc'>
										<li>
											Bij annulering door de deelnemer wordt het
											inschrijvingsgeld niet gerestitueerd.
										</li>
									</ul>
								</li>
								<li>
									<strong>Aansprakelijkheid:</strong>
									<ul className='ml-6 list-disc'>
										<li>
											Deelnemers nemen op eigen risico deel aan het evenement.
										</li>
										<li>
											De organisator is niet verantwoordelijk voor persoonlijk
											letsel, verlies of schade.
										</li>
									</ul>
								</li>
								<li>
									<strong>Toestemming voor gebruik beeldmateriaal:</strong>
									<ul className='ml-6 list-disc'>
										<li>
											Deelnemers stemmen ermee in dat foto’s en video’s tijdens
											het evenement kunnen worden gebruikt voor
											promotiedoeleinden.
										</li>
									</ul>
								</li>
								<li>
									<strong>Overige bepalingen:</strong>
									<ul className='ml-6 list-disc'>
										<li>
											De organisator behoudt zich het recht voor om het
											evenement te annuleren of te wijzigen.
										</li>
										<li>
											Deelnemers dienen zich te houden aan de geldende regels en
											instructies opgelegd vanuit de kermiscomités.
										</li>
									</ul>
								</li>
							</ol>
						</div>
					</div>
				</div>

				<Footer />
			</div>
		</>
	);
};

export default GeneralConditions;
