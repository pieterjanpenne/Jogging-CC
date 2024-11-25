import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';

export default function VeelgesteldeVragen() {
	return (
		<>
			<div className='flex flex-col items-center space-y-6'>
				<h1 className='text-5xl font-semibold text-center' id='#joggings'>
					Veelgestelde vragen
				</h1>
			</div>
			<Accordion type='single' collapsible>
				<AccordionItem value='item-1'>
					<AccordionTrigger>Hoe kan ik deelnemen?</AccordionTrigger>
					<AccordionContent>
						<ul className='my-6 ml-6 list-disc [&>li]:mt-2'>
							<li>
								Elke jogging is in handen van een lokaal organiserend comité.
								Bij elke jogging is er een eigen omloop, veiligheidsmaatregelen,
								tijdsopname en EHBO-post.
							</li>
							<li>
								Voor elke jogging schrijf je je apart in via de lokale
								organisatie. De prijzen variëren ook per jogging.
							</li>
							<li>
								Om een prijs te kunnen winnen, moet je finishen in minstens 4
								van de 6 joggings. Je moet in elke jogging dezelfde afstand
								lopen: kort, midden of lang.
							</li>
						</ul>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value='item-2'>
					<AccordionTrigger>Hoe werkt de puntentelling?</AccordionTrigger>
					<AccordionContent>
						<ul className='my-6 ml-6 list-disc [&>li]:mt-2'>
							<li>
								De bestuursleden van ‘Evergemse Joggings’ verzamelen de
								deelnemerslijsten van elke jogging.
							</li>
							<li>
								Na afloop van elke jogging kun je de uitslag en het voorlopige
								klassement van het Augustijn Criterium terugvinden op de website
								criterium.evergemsejoggings.be
							</li>
							<li>
								Na elke jogging krijg je punten. De eerste krijgt 200 punten, de
								tweede 199, de derde 198 punten enzovoort.
							</li>
							<li>De gelopen tijd is van geen belang</li>
							<li>
								Liep je meer dan 4 joggings? Dan tellen enkel je beste 4
								resultaten.
							</li>
						</ul>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value='item-3'>
					<AccordionTrigger>Wat kan ik winnen?</AccordionTrigger>
					<AccordionContent>
						<p>
							Liep je in minstens 4 van de 6 joggings mee? Dan krijg je sowieso
							een naturaprijs Op elke van de 3 afstanden winnen de 3 lopers met
							de meeste punten een mooie geldprijs.
						</p>
						<ol className='my-6 ml-6 list-disc [&>li]:mt-2'>
							<li>€13 (kort) €18 (midden) €25 (lang)</li>
							<li>€9 (kort) €13 (midden) €18 (lang)</li>
							<li>€6 (kort) €9 (midden) €13 (lang)</li>
						</ol>
						<p>
							Er zijn telkens 4 leeftijdscategorieën, ingedeeld per
							geboortejaar:
						</p>
						<ol className='my-6 ml-6 list-disc [&>li]:mt-2'>
							<li>Geboren van 1989 tot 2008</li>
							<li>Geboren van 1979 tot 1988</li>
							<li>Geboren van 1969 tot 1978 </li>
							<li>Geboren voor 1969 </li>
						</ol>
						<p>Voor de heren en de dames is er telkens een apart klassement</p>
						<p>
							Je prijs krijg je na afloop van de laatste jogging van het
							criterium op 6/10 op de Veense Jogging.
						</p>
						<p>
							Kun je er niet bij zijn op de prijsuitreiking? Geen probleem. Haal
							je prijs op (voor 15/11/24) bij Jan Van Dorpe in de Heifortstraat
							91 in Ertvelde (0456/646881)
						</p>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value='item-4'>
					<AccordionTrigger>Wat bij vragen of betwistingen?</AccordionTrigger>
					<AccordionContent>
						<p>
							Met vragen kun je terecht op info@kozirunners.be of op
							0471/980922 (Stijn Van De Voorde)
						</p>
						<p>
							Als er een betwisting is van de correcte toepassing van het
							reglement, beslissen de organisatoren in onderling overleg.
						</p>
						<p>
							Aanpassingen aan het reglement zijn mogelijk na overleg en
							overeenstemming tussen de verschillende organisatoren.
						</p>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</>
	);
}
