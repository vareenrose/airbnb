import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../components/UserContext";

export default function LoginPage() {
	const [userDetails, setUserDetails] = useState({
		email: "",
		password: "",
	});
	const [redirect, setRedirect] = useState(false);
	const { setUser } = useContext(UserContext);

	const handleChange = (event) => {
		setUserDetails({ ...userDetails, [event.target.name]: event.target.value });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const { data } = await axios.post("/login", {
				userDetails,
			});
			setUser(data);
			alert("Login Successful");
			setRedirect(true);
		} catch (error) {
			alert("Login unsuccessful");
		}
	};

	return (
		<div className='mt-4 grow flex items-center justify-around'>
			{redirect && <Navigate to={"/"} />}
			<div className='mb-64'>
				<h1 className='text-4xl text-center mb-4'>Login</h1>
				<form className='max-w-md mx-auto' onSubmit={handleSubmit}>
					<input
						type='text'
						name='email'
						id=''
						placeholder='your@email.com'
						value={userDetails.email}
						onChange={handleChange}
					/>
					<input
						type='password'
						name='password'
						id=''
						placeholder='password'
						value={userDetails.password}
						onChange={handleChange}
					/>
					<button className='primary'>Login</button>
					<div className='text-center py-2 text-gray-500'>
						Don't have an account?
						<Link className='underline text-black' to={"/register"}>
							Register
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
