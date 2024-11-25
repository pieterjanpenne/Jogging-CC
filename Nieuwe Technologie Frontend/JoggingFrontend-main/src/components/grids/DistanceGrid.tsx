import React from 'react';

interface DistanceGridProps {
	short: string;
	medium: string;
	long: string;
}

const DistanceGrid: React.FC<DistanceGridProps> = ({ short, medium, long }) => {
	return (
		<>
			<div className='grid grid-cols-3 text-center rounded-t-lg shadow-md text-slate-50 bg-slate-500 dark:bg-slate-700'>
				{/* Headers */}
				<p className='p-2 font-bold '>Kort</p>
				<p className='p-2 font-bold '>Medium</p>
				<p className='p-2 font-bold'>Lang</p>
			</div>
			<div className='grid grid-cols-3 text-center rounded-b-lg shadow-md bg-slate-300 dark:bg-slate-500'>
				{/* Distances */}
				<p className='p-4 '>{short} km</p>
				<p className='p-4 border-x-2'>{medium} km</p>
				<p className='p-4 '>{long} km</p>
			</div>
		</>
	);
};

export default DistanceGrid;
