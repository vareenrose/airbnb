import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function IndexPage() {
	const [listings, setListings] = useState([]);
	useEffect(() => {
		axios.get("/places").then((res) => {
			setListings(res.data);
		});
	}, [listings]);

	return (
		<div className='grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 mt-8'>
			{listings.length > 0 &&
				listings.map((place) => (
					<Link to={'/place/' + place._id} key={place._id}>
						<div className='bg-gray-500 rounded-2xl'>
							{place.photos?.[0] && (
								<img
									className='rounded-2xl aspect-square object-cover'
									src={place.photos?.[0]}
									alt=''
								/>
							)}
						</div>
						<h3 className='font-semibold truncate'>{place.address}</h3>
						<h2 className='text-sm text-gray-500'>{place.title}</h2>
						<div className='mt-2'>
							<span className='font-semibold'>${place.price}</span> per night
						</div>
					</Link>
				))}
		</div>
	);
}
