import { useContext } from "react";
import { UserContext } from "./UserContext";
import { Link } from "react-router-dom";
import icons from "../assets/icons";

export default function Header() {
	const { user } = useContext(UserContext);

	return (
		<div>
			<header className='flex justify-between'>
				<Link to={"/"} className='flex items-center gap-1'>
					{icons.logo}
					<span className='font-bold text-xl'>homey</span>
				</Link>
				<div className='flex gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-300'>
					<p className="text-gray-500 text-md">Search...</p>
					<button className='bg-primary text-white p-1 rounded-full'>
						{icons.search}
					</button>
				</div>
				<Link to={user ? "/account" : "/login"}>
					<div className='flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4'>
						{icons.menu}
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
