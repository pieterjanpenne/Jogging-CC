import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';

const CookieDrawer = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	useEffect(() => {
		const consent = localStorage.getItem('cookie-consent');
		if (!consent) {
			setIsDrawerOpen(true);
		}
	}, []);

	const handleAgree = () => {
		localStorage.setItem('cookie-consent', 'accepted');
		setIsDrawerOpen(false);
	};

	if (!isDrawerOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-end justify-center'>
			<div className='fixed inset-0 bg-black opacity-40' />
			<div className='relative flex flex-col w-full max-w-3xl gap-1 p-3 pt-0 m-3 mb-6 border rounded-3xl bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700'>
				<div className='flex flex-col gap-1 p-3 text-center md:text-start'>
					<h2 className='text-xl font-semibold'>Cookiebeleid</h2>
					<p>
						Wij gebruiken cookies om uw ervaring te verbeteren. Door deze site
						te bezoeken, gaat u akkoord met ons gebruik van cookies.
					</p>
				</div>
				<div className='flex items-center justify-center '>
					<Button className='w-full rounded-xl' onClick={handleAgree}>
						Ik begrijp het
					</Button>
				</div>
			</div>
		</div>
	);
};

export default CookieDrawer;
