import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import icons from "../assets/icons";
import { differenceInCalendarDays } from "date-fns";

function PlacePage() {
	const { id } = useParams();
	const [place, setPlace] = useState(null);
	const [allPhotos, setAllPhotos] = useState(false);
	const [bookingData, setBookingData] = useState({
		checkIn: "",
		checkOut: "",
		guests: 1,
	});
	const [redirect, setRedirect] = useState("");
	useEffect(() => {
		if (!id) {
			return;
		}
		axios.get(`/places/${id}`).then((res) => {
			setPlace(res.data);
		});
	}, [id]);

	const handleChange = (ev) => {
		setBookingData({ ...bookingData, [ev.target.name]: ev.target.value });
	};

	let numberOfNights = 0;
	if (bookingData.checkOut && bookingData.checkIn) {
		numberOfNights = differenceInCalendarDays(
			new Date(bookingData.checkOut),
			new Date(bookingData.checkIn)
		);
	}

	const makeBooking = async (ev) => {
		ev.preventDefault();
		const res = await axios.post("/booking", {
			...bookingData,
			place: place._id,
			price: numberOfNights * place.price,
		});
		const bookingId = res.data._id;

		if (bookingId) {
			setRedirect(`account/bookings/${bookingId}`);
		}
	};

	if (!place) return "";
	if (redirect) {
		return <Navigate to={redirect} />;
	}
	if (allPhotos) {
		return (
			<div className='absolute inset-0 bg-white min-h-screen'>
				<div className='p-8 grid gap-4'>
					<div>
						<h2 className='text-xl font-semibold'>Photo tour</h2>
						<button
							onClick={() => setAllPhotos(false)}
							className='flex fixed gap-1 py-2 px-4 rounded-2xl shadow shadow-gray-500'
						>
							{icons.close} Back
						</button>
					</div>
					{place?.photos?.length > 0 &&
						place.photos.map((photo) => (
							<div className=''>
								<img
									src={`${import.meta.env.VITE_API_URL}/uploads/${photo}`}
									alt=''
								/>
							</div>
						))}
				</div>
			</div>
		);
	}

	return (
		<div className='mt-4 bg-gray-50 -mx-8 px-8 py-8 2xl:mx-auto 2xl:max-w-7xl'>
			<h1 className='text-3xl'>{place.title}</h1>
			<a
				className='flex gap-1 my-3 font-semibold underline'
				target='_blank'
				href={`https://maps.google.com/?q=${place.address}`}
			>
				{icons.map}
				{place.address}
			</a>
			<div className='relative'>
				<div className='grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden'>
					<div>
						{place.photos?.[0] && (
							<img
								onClick={() => setAllPhotos(true)}
								className='aspect-square object-cover cursor-pointer'
								src={`${import.meta.env.VITE_API_URL}/uploads/${
									place.photos[0]
								}`}
								alt=''
							/>
						)}
					</div>
					<div className='grid'>
						{place.photos?.[1] && (
							<img
								onClick={() => setAllPhotos(true)}
								className='aspect-square object-cover cursor-pointer'
								src={`${import.meta.env.VITE_API_URL}/uploads/${
									place.photos[1]
								}`}
								alt=''
							/>
						)}
						<div className=' overflow-hidden'>
							{place.photos?.[2] && (
								<img
									onClick={() => setAllPhotos(true)}
									className='aspect-square object-cover relative top-2 cursor-pointer'
									src={`${import.meta.env.VITE_API_URL}/uploads/${
										place.photos[2]
									}`}
									alt=''
								/>
							)}
						</div>
					</div>
				</div>
				<button
					onClick={() => setAllPhotos(true)}
					className='flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow-md shadow-gray-500'
				>
					{icons.photo}
					Show all photos
				</button>
			</div>

			<div className='grid mt-8 gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]'>
				<div>
					<div className='my-4'>
						<h2 className='text-xl font-semibold'>Description</h2>
						{place.description}
					</div>
					Check-in: {place.checkIn} <br />
					Check-out: {place.checkOut} <br />
					Max no. of guests: {place.maxGuests}
				</div>
				<div>
					<div className='bg-white shadow p-4 rounded-2xl'>
						<div className='text-xl font-bold'>${place.price}</div> per night
						<div className='border rounded-2xl my-4'>
							<div className='flex'>
								<div className='py-3 px-4'>
									<label>Check-in</label>
									<input
										type='date'
										name='checkIn'
										value={bookingData.checkIn}
										onChange={handleChange}
									/>
								</div>
								<div className='py-3 px-4 border-l'>
									<label>Check-out</label>
									<input
										type='date'
										name='checkOut'
										value={bookingData.checkOut}
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className='py-3 px-4 border-t'>
								<label>Guests</label>
								<input
									type='number'
									max={place.maxGuests}
									name='guests'
									value={bookingData.guests}
									onChange={handleChange}
								/>
							</div>
						</div>
						<button onClick={makeBooking} className='primary font-semibold'>
							Book{" "}
							{numberOfNights > 0 && (
								<span> ${numberOfNights * place.price}</span>
							)}
						</button>
					</div>
				</div>
			</div>
			<h2 className='font-semibold text-xl'>Extra Info</h2>
			<div className='mt-2 text-sm text-gray-600 leading-5'>
				{place.extraInfo}
			</div>
		</div>
	);
}

export default PlacePage;
