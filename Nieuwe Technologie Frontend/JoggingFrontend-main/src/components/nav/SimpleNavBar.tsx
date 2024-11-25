import { Link } from 'react-router-dom';
import { ModeToggle } from '../ModeToggle';
import AccountDropDown from '../dropdowns/AccountDropDown';

const SimpleNavBar = () => {
	return (
		<div className='absolute flex items-center justify-between w-full px-6 font-medium md:px-10 top-10 float'>
			<Link to='/' className='pb-0.5 opacity-50'>
				Evergemse Jogging
			</Link>
			<div className='flex gap-6 '>
				<ModeToggle />
				<AccountDropDown />
			</div>
		</div>
	);
};

export default SimpleNavBar;
