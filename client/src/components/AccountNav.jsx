import { useLocation, Link } from "react-router-dom";
import icons from "../assets/icons";

function AccountNav() {

    const {pathname} = useLocation()

    const linkClasses = (type) => {
        let subpage = pathname.split('/')?.[2]

        let classes = "py-2 px-6 inline-flex gap-1 rounded-full";
        if (type === subpage) {
            classes += " bg-primary text-white";
        } else {
            classes += " bg-gray-200";
        }

        return classes;
    };

	return (
		<div>
			<nav className='w-full flex justify-center mt-8 gap-2 mb-8'>
				<Link className={linkClasses(undefined)} to={"/account"}>
					<>{icons.profile}</>
					My Profile
				</Link>
				<Link className={linkClasses("bookings")} to={"/account/bookings"}>
					<>{icons.bookings}</>
					My Bookings
				</Link>
				<Link className={linkClasses("places")} to={"/account/places"}>
					<>{icons.accommodation}</>
					My Accommodations
				</Link>
			</nav>
		</div>
	);
}

export default AccountNav;
