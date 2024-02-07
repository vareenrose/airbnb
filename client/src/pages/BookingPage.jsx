import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { differenceInCalendarDays, format } from "date-fns";
import icons from "../assets/icons";

function BookingPage() {
	const { id } = useParams();
	const [booking, setBooking] = useState(null);
	const [allPhotos, setAllPhotos] = useState(false);
	const [redirect, setRedirect] = useState("");
	useEffect(() => {
		if (id) {
			axios.get("/bookings").then((response) => {
				const foundBooking = response.data.find(({ _id }) => _id === id);
				if (foundBooking) {
					setBooking(foundBooking);
				}
			});
		}
	}, [id]);

	if (!booking) return "";

	let numberOfNights = differenceInCalendarDays(
		new Date(booking.checkOut),
		new Date(booking.checkIn)
	);

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
					{booking.place?.photos?.length > 0 &&
						booking.place.photos.map((photo) => (
							<div key={photo} className=''>
								<img src={`http://localhost:4000/uploads/${photo}`} alt='' />
							</div>
						))}
				</div>
			</div>
		);
	}

	return (
		<div className='mt-4 bg-gray-50 -mx-8 px-8 py-8'>
			<h1 className='text-3xl'>{booking.place.title}</h1>
			<a
				className='flex gap-1 my-3 font-semibold underline'
				target='_blank'
				href={`https://maps.google.com/?q=${booking.place.address}`}
			>
				{icons.map}
				{booking.place.address}
			</a>
			<div className='relative'>
				<div className='grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden'>
					<div>
						{booking.place.photos?.[0] && (
							<img
								onClick={() => setAllPhotos(true)}
								className='aspect-square object-cover cursor-pointer'
								src={`http://localhost:4000/uploads/${booking.place.photos[0]}`}
								alt=''
							/>
						)}
					</div>
					<div className='grid'>
						{booking.place.photos?.[1] && (
							<img
								onClick={() => setAllPhotos(true)}
								className='aspect-square object-cover cursor-pointer'
								src={`http://localhost:4000/uploads/${booking.place.photos[1]}`}
								alt=''
							/>
						)}
						<div className=' overflow-hidden'>
							{booking.place.photos?.[2] && (
								<img
									onClick={() => setAllPhotos(true)}
									className='aspect-square object-cover relative top-2 cursor-pointer'
									src={`http://localhost:4000/uploads/${booking.place.photos[2]}`}
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
						{booking.place.description}
					</div>
					Check-in: {booking.place.checkIn} <br />
					Check-out: {booking.place.checkOut} <br />
					Max no. of guests: {booking.place.maxGuests}
				</div>
				<div>
					<div className='bg-white shadow p-4 rounded-2xl'>
						<div className='text-xl font-bold'>${booking.place.price}</div> per
						night
						<div className='border rounded-2xl my-4'>
							<div className='flex'>
								<div className='py-3 px-4'>
									<label>Check-in</label>
									<input
										type='text'
										name='checkIn'
										value={format(booking.checkIn, "yyyy-MM-dd")}
										disabled
									/>
								</div>
								<div className='py-3 px-4 border-l'>
									<label>Check-out</label>
									<input
										type='text'
										name='checkOut'
										value={format(booking.checkOut, "yyyy-MM-dd")}
										disabled
									/>
								</div>
							</div>
							<div className='py-3 px-4 border-t'>
								<label>Guests</label>
								<input
									type='number'
									name='guests'
									value={booking.guests}
									disabled
								/>
							</div>
						</div>
						<button className='primary font-semibold' disabled>
							Cost:{" "}
							{numberOfNights > 0 && (
								<span> ${numberOfNights * booking.place.price}</span>
							)}
						</button>
					</div>
				</div>
			</div>
			<h2 className='font-semibold text-xl'>Extra Info</h2>
			<div className='mt-2 text-sm text-gray-600 leading-5'>
				{booking.place.extraInfo}
			</div>
		</div>
	);
}

export default BookingPage;
