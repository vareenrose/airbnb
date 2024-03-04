import { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import icons from "../assets/icons";


export default function Header() {
	const { user } = useContext(UserContext);
	const [searchTerm, setSearchTerm] = useState(null)
	let [searchParams, setSearchParams] = useSearchParams()
	let navigate = useNavigate()

	const handleSearch = (e) => {
		setSearchParams({ q: searchTerm });
		if (searchParams.get('q')){			
			navigate(`/places?${searchParams.get("q")}`);			
		}		
	}

	return (
		<div>
			<header className='flex justify-between'>
				<Link to={"/"} className='flex items-center gap-1'>
					{icons.logo}
					<span className='font-bold text-xl'>homey</span>
				</Link>
				<div className='flex gap-2 items-center w-96'>
					<input
						className='border border-gray-300 shadow-md shadow-gray-300 focus:outline-4'
						type='text'
						name='searchText'
						placeholder='Search...'
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<button className='bg-primary text-white p-2 rounded-xl' onClick={handleSearch}>
						{icons.search}
					</button>
				</div>
				<Link to={user ? "/account" : "/login"} className='flex items-center'>
					<div className='flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4'>
						<div className='bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden'>
							{icons.user}
						</div>
						{user ? <div>{user.name}</div> : <div>Login?</div>}
					</div>
				</Link>
			</header>
		</div>
	);
}
