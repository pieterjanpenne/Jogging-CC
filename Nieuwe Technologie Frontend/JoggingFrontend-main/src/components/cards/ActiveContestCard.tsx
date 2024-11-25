import React, { useEffect, useState } from 'react';
import { formatDate } from '@/utils/dateUtils';
import { Competition } from '@/types';

interface ActiveContestCardProps {
	competition: Competition;
}

const ActiveContestCard = ({ competition }: ActiveContestCardProps) => {
	const { id, name, date } = competition;

	const isPast = (competitionDate: Date) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		competitionDate.setHours(0, 0, 0, 0);
		return competitionDate < today;
	};

	const hasPassed = isPast(new Date(date));

	const [isHovered, setIsHovered] = useState(false);

	const [imageSrc, setImageSrc] = useState<string | null>(null);

	//fetching local image
	useEffect(() => {
		const loadImage = async () => {
			try {
				const image = await import(
					`../../assets/images/competitions/competition_${id}.png`
				);
				setImageSrc(image.default);
			} catch (error) {
				// Fallback image if loading fails
				const fallbackImage = await import('../../assets/images/logo-goud.png');
				setImageSrc(fallbackImage.default);
			}
		};

		loadImage();
	}, [id]);

	return (
		<div
			className='relative my-2 overflow-hidden text-white transition-transform duration-300 border border-gray-200 rounded-lg shadow-md md:my-0 dark:border-gray-900 shadow-slate-300 dark:shadow-gray-900 max-w-72 min-w-72 bg-slate-500 dark:bg-slate-700 md:hover:scale-105 '
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className='relative bg-white'>
				{imageSrc && (
					<img
						className='object-contain object-center w-full h-72 '
						//DATABASE IMAGE FETCHING
						// src={`https://wnhnvxvcynrkidmptsga.supabase.co/storage/v1/object/public/images_competitions/competition_${id}.png`}

						//LOCAL IMAGE FETCHING
						src={imageSrc}
						alt={`${name} event`}
					/>
				)}
				{hasPassed && (
					<div
						className={`absolute inset-0 flex items-center justify-center ${
							isHovered ? 'bg-black bg-opacity-75' : 'bg-black bg-opacity-50'
						}`}
					>
						<span className='text-xl font-bold'>
							{isHovered ? 'Zie resultaten' : 'Gelopen'}
						</span>
					</div>
				)}
			</div>
			<div className='px-6 py-4'>
				<div className='mb-2 text-xl font-bold'>{name}</div>
				<p className='text-base'>{formatDate(date)}</p>
			</div>
		</div>
	);
};

export default ActiveContestCard;
