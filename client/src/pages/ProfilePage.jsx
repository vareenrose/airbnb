import { useContext, useState } from "react";
import { UserContext } from "../components/UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../components/AccountNav";

function ProfilePage() {
	const [redirect, setRedirect] = useState(false);
	const { user, ready, setUser } = useContext(UserContext);
	let { subpage } = useParams();

	// if (subpage === undefined) subpage = 'profile'

	async function logout() {
		await axios.post("/logout");
		setUser(null);
		setRedirect(true);
	}

	if (redirect) {
		<Navigate to={"/"} />;
	}

	if (!ready) {
		return "Loading...";
	}

	if (ready && !user && !redirect) {
		return <Navigate to={"/login"} />;
	}

	

	return (
		<div>
			<AccountNav />
			{subpage === undefined && user && (
				<div className='text-center max-w-lg mx-auto'>
					Logged in as {user.name} ({user.email}) <br />
					<button onClick={logout} className='primary max-w-sm mt-2'>
						Logout
					</button>
				</div>
			)}
			{subpage === "places" && <PlacesPage />}
		</div>
	);
}

export default ProfilePage;
