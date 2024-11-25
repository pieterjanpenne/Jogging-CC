import React from 'react';
import { Link } from 'react-router-dom';
import coverRunner from '../../assets/images/login_bg2.png';

const NotFound: React.FC = () => {
	return (
		<div className='relative w-screen h-screen'>
			<img
				src={coverRunner}
				alt='Background'
				className='absolute top-0 left-0 object-cover w-full h-full'
			/>
			<div className='relative flex flex-col items-center justify-center h-full p-6 text-center bg-slate-950 bg-opacity-70'>
				<h1 className='mb-4 text-5xl font-bold text-white'>404</h1>
				<h2 className='mb-4 text-4xl font-bold text-white'>
					Oei! Je bent de foute kant opgelopen!
				</h2>
				{/* <p className='mb-4 text-white'>
					De pagina waar je voor zoekt bestaat niet.
				</p> */}
				<Link
					to='/'
					className='text-lg text-white underline underline-offset-8'
				>
					Keer terug naar de Evergemse Joggings
				</Link>
			</div>
		</div>
	);
};

export default NotFound;
