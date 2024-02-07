import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import icons from "../assets/icons";
import axios from "axios";
import AccountNav from "../components/AccountNav";

function PlacesFormPage() {
	const { id } = useParams();
	useEffect(() => {
		if (!id) {
			return;
		}
		axios.get("/places/" + id).then(({ data }) => {
			setPlace({
				title: data.title,
				address: data.address,
				description: data.description,
				perks: data.perks,
				extraInfo: data.extraInfo,
				checkIn: data.checkIn,
				checkOut: data.checkOut,
				maxGuests: data.maxGuests,
				photos: data.photos,
				price: data.price
			});
		});
	}, [id]);

	const [place, setPlace] = useState({
		title: "",
		address: "",
		description: "",
		perks: [],
		extraInfo: "",
		checkIn: "",
		checkOut: "",
		maxGuests: 1,
		photos: [],
		price: 100
	});

	const [photoLink, setPhotoLink] = useState("");
	const [redirect, setRedirect] = useState(false);
	const perksArray = [
		"Wifi",
		"Free parking on premises",
		"Pets allowed",
		"TV",
		"Radio",
		"Private entrance",
		"Kitchen",
		"Washer",
	];

	const inputHeader = (text) => {
		return <h2 className='text-2xl mt-4'>{text}</h2>;
	};

	const inputDescription = (text) => {
		return <p className='text-gray-400 text-xs'>{text}</p>;
	};

	function preInput(header, description) {
		return (
			<>
				{inputHeader(header)}
				{inputDescription(description)}
			</>
		);
	}

	async function addPhotoByLink(e) {
		e.preventDefault();
		const { data } = await axios.post("/upload-by-link", {
			link: photoLink,
		});
		setPlace({ ...place, photos: [...place.photos, data] });
		setPhotoLink("");
	}

	function uploadPhoto(e) {
		const files = e.target.files;
		const formData = new FormData();
		for (let i = 0; i < files.length; i++) {
			formData.append("photos", files[i]);
		}

		axios
			.post("/upload", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			})
			.then((res) => {
				const { data: filenames } = res;
				setPlace({ ...place, photos: [...place.photos, ...filenames] });
			});
	}

	function handleCheckbox(e) {
		const { checked, name } = e.target;

		checked
			? setPlace({ ...place, perks: [...place.perks, name] })
			: setPlace({
					...place,
					perks: [...place.perks.filter((perk) => perk !== name)],
			  });
	}

	const handleChange = (e) => {
		setPlace({ ...place, [e.target.name]: e.target.value });
	};

	async function handleSubmit(e) {
		e.preventDefault();
		console.log(id);
		if (id) {
			try {
				await axios.put("/places", { id, ...place });
				setRedirect(true);
			} catch (error) {
				alert("Edit unsuccessful");
			}
		} else {
			try {
				await axios.post("/places", place);
				setRedirect(true);
			} catch (error) {
				alert("Creation unsuccessful");
			}
		}
	}

	if (redirect) return <Navigate to={"/account/places"} />;

	function deletePhoto(e, filename) {
		e.preventDefault()
		setPlace({...place, photos: place.photos.filter(photo => photo !== filename)})
	}

	function selectAsCoverPhoto(e, filename) {
		e.preventDefault()		
		setPlace({...place, photos: [filename, ...place.photos.filter(photo => photo !== filename)]})
	}
	

	return (
		<div>
			<AccountNav />
			<form onSubmit={handleSubmit}>
				{preInput("Title", "name of the place, make it short and catchy")}
				<input
					type='text'
					name='title'
					id=''
					placeholder='title'
					value={place.title}
					onChange={handleChange}
				/>

				{preInput("Address", "listing location")}
				<input
					type='text'
					name='address'
					id=''
					placeholder='address'
					value={place.address}
					onChange={handleChange}
				/>

				{preInput("Photos", "the more the better")}

				<div className='flex gap-2'>
					<input
						type='text'
						name=''
						value={photoLink}
						onChange={(e) => setPhotoLink(e.target.value)}
						placeholder='Add using link ....jpg'
					/>
					<button
						onClick={addPhotoByLink}
						className='bg-gray-200 mt-2 px-4 rounded-2xl'
					>
						Add Photo
					</button>
				</div>
				<div className='mt-2 grid gap-2 grid-cols-3 lg:grid-cols-6 md:grid-cols-4'>
					{place.photos.length > 0 &&
						place.photos.map((link) => (
							<div className='h-32 flex relative' key={link}>
								<img
									className='rounded-2xl w-full object-cover'
									src={`${import.meta.env.VITE_API_URL}/uploads/${link}`}
									alt=''
								/>
								<button
									className='absolute bottom-2 right-2 text-white cursor-pointer bg-transparent'
									onClick={(e) => deletePhoto(e, link)}
								>
									{icons.delete}
								</button>
								<button
									className='absolute bottom-2 left-2 text-white cursor-pointer bg-transparent'
									onClick={(e) => selectAsCoverPhoto(e, link)}
								>
									{link === place.photos[0] ? (
										<>{icons.starsolid}</>
									) : (
										<>{icons.star}</>
									)}
								</button>
							</div>
						))}
					<label className='flex h-32 items-center cursor-pointer justify-center gap-1 border bg-transparent rounded-2xl p-2 text-2xl text-gray-600'>
						<input
							type='file'
							multiple
							name=''
							className='hidden'
							onChange={uploadPhoto}
						/>
						<>{icons.upload}</>
						Upload
					</label>
				</div>

				{preInput("Description", "describe your listing")}
				<textarea
					name='description'
					value={place.description}
					onChange={handleChange}
				/>

				{preInput("Perks", "select all that apply")}
				<div className='grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-8 mt-2'>
					{perksArray.map((perk, index) => (
						<label
							key={index}
							className='border p-4 flex rounded-2xl gap-2 items-center cursor-pointer'
						>
							<input
								type='checkbox'
								checked={place.perks.includes(perk)}
								name={perk}
								onChange={handleCheckbox}
							/>
							<>{icons[perk]}</>
							<span>{perk}</span>
						</label>
					))}
				</div>

				{preInput("Check In & Check Out", "check in and check out times")}
				<div className='grid gap-2 grid-cols-4 sm:grid-cols-2'>
					<div>
						<h3 className='mt-2 -mb-2'>Check In</h3>
						<input
							type='text'
							name='checkIn'
							value={place.checkIn}
							placeholder='14:00'
							onChange={handleChange}
						/>
					</div>
					<div>
						<h3 className='mt-2 -mb-2'>Check Out</h3>
						<input
							type='text'
							name='checkOut'
							placeholder='9:00'
							value={place.checkOut}
							onChange={handleChange}
						/>
					</div>
					<div>
						<h3 className='mt-2 -mb-2'>Max Guests</h3>
						<input
							type='number'
							name='maxGuests'
							value={place.maxGuests}
							onChange={handleChange}
						/>
					</div>
					<div>
						<h3 className='mt-2 -mb-2'>Price per Night</h3>
						<input
							type='number'
							name='price'
							value={place.price}
							onChange={handleChange}
						/>
					</div>
				</div>

				{preInput("Extra Info", "anything else you need your guests to know")}
				<textarea
					name='extraInfo'
					value={place.extraInfo}
					onChange={handleChange}
				/>
				<div>
					<button className='primary my-4'>Save</button>
				</div>
			</form>
		</div>
	);
}

export default PlacesFormPage;
