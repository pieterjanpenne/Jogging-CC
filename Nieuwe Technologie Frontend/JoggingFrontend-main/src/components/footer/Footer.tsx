import { Link } from 'react-router-dom';

const Footer = () => {
	return (
		<footer className='flex items-center justify-center w-full pt-3 mt-6 bg-slate-500 dark:bg-slate-700'>
			<div className='flex flex-col justify-center w-full max-w-4xl pb-3 text-slate-50'>
				<div className='flex flex-col justify-around w-full gap-y-2 text-slate-50 md:flex-row'>
					<div className='flex flex-col items-center justify-start text-center'>
						<strong>Adres</strong>
						<p>Kozirunners VZW</p>
						<p>Linde 72</p>
						<p>9940 Sleidinge</p>
					</div>
					<div className='flex flex-col items-center justify-start text-center'>
						<strong>Clubrekening</strong>
						<p>IBAN: BE97 8908 7441 8049</p>
						<p>BIC: VDSPBE91</p>
					</div>
					<div className='flex flex-col items-center justify-start text-center'>
						<strong>Btw nummer</strong>
						<p>BE 1001.737.707</p>
						<strong>Email</strong>
						<p>info@kozirunners.be</p>
					</div>
				</div>
				<div className='flex flex-col items-center justify-center text-sm text-center text-slate-300'>
					<p>
						<Link
							to='/privacy-policy'
							className='underline hover:text-slate-100'
						>
							Privacybeleid
						</Link>
					</p>
					<p>
						<Link
							to='/algemene-voorwaarden'
							className='underline hover:text-slate-100'
						>
							Algemene voorwaarden
						</Link>
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
