import underconstructionImage from '../../assets/images/UnderConstruction.webp';

export default function UnderConstructionBanner() {
	return (
		<div className='flex flex-col items-center justify-center w-full mt-24 space-y-6 md:space-y-0 md:max-w-3xl md:px-6 lg:max-w-5xl md:justify-evenly md:flex-row md:space-x-0'>
			<img
				src={underconstructionImage}
				alt='Under Construction'
				className='w-4/5 max-w-2xl mb-5'
			/>
			<div className='flex flex-col items-center justify-center px-3 py-3 space-y-3 md:px-0 md:w-2/3'>
				<h1 className='text-4xl font-semibold text-center lg:text-5xl'>
					Aan deze pagina word nog gewerkt. Keer binnenkort terug.
				</h1>
			</div>
		</div>
	);
}
