import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import icons from "../assets/icons";
import axios from "axios";
import AccountNav from "../components/AccountNav";

function PlacesPage() {
	const [placesList, setPlacesList] = useState([]);
	useEffect(() => {
		axios.get("/user-places").then(({ data }) => {
			setPlacesList(data);
		});
	}, [placesList]);

	return (
		<div>
			<AccountNav />
			<div>
				<div className='text-center'>
					<Link
						className='inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full'
						to={"/account/places/new"}
					>
						<>{icons.plus}</>
						Add New Place
					</Link>
				</div>
				<div className='mt-4'>
					{placesList.map((item) => (
						<Link
							key={item._id}
							to={"/account/places/" + item._id}
							className='flex cursor-pointer gap-4 bg-gray-100 p-4 mt-2 rounded-2xl'
						>
							<div className='w-32 h-32 rounded-2xl bg-gray-300 shrink-0'>
								{item.photos.length > 0 && (
									<img
										className='w-32 h-32 rounded-2xl object-cover'
										src={import.meta.env.VITE_API_URL + "/uploads/" + item.photos[0]}
										alt=''
									/>
								)}
							</div>
							<div>
								<h2 className='text-xl font-semibold'>{item.title}</h2>
								<p className='text-sm mt-2'>{item.description}</p>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}

export default PlacesPage;
