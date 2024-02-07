import { useEffect, useState } from 'react'
import AccountNav from '../components/AccountNav'
import axios from 'axios'
import { differenceInCalendarDays, format } from 'date-fns'
import icons from '../assets/icons'
import { Link } from 'react-router-dom'


function BookingsPage() {
  const [bookings, setBookings] = useState([])
  useEffect(() => {
    axios.get('/bookings').then((res) => {
      setBookings(res.data)
    })
  }, [])

  return (
		<div>
			<AccountNav />
			<div>
				{bookings?.length > 0 &&
					bookings.map((booking) => (
						<Link to={`/account/bookings/${booking._id}`}
							key={booking._id}
							className='flex gap-4 bg-gray-200 rounded-2xl overflow-hidden'
						>
							<div className='w-48'>
								{booking.place?.photos?.length > 0 && (
									<img
										className='object-cover'
										src={`${import.meta.env.VITE_API_URL}/uploads/${booking.place.photos[0]}`}
										alt=''
									/>
								)}
							</div>
							<div className='py-3 pr-3 grow'>
								<h2 className='text-xl'>{booking.place.title}</h2>
								<div className='flex gap-2 items-center border-t border-gray-300 mt-2 py-2'>
									<div className='flex gap-1 items-center'>
										{icons.calendar} {format(booking.checkIn, "yyyy-MM-dd")}
									</div>
									&rarr;
									<div className='flex gap-1 items-center'>
										{icons.calendar}
										{format(booking.checkOut, "yyyy-MM-dd")}
									</div>
								</div>
								<div className='font-semibold'>
									{differenceInCalendarDays(booking.checkOut, booking.checkIn)}	nights | Cost: ${booking.price}
								</div>
							</div>
						</Link>
					))}
			</div>
		</div>
	);
}

export default BookingsPage