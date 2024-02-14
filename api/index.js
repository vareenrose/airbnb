const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const UserModel = require("./models/User");
const PlaceModel = require("./models/Place");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const imgDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const Booking = require("./models/Booking");

const app = express();
const jwtSecret = process.env.JWT_SECRET;

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
	cors({
		credentials: true,
		origin: process.env.CLIENT_URL,
	})
);

mongoose.connect(process.env.MONGO_URL);

async function getUserData(req){	
	return new Promise(function(resolve, reject){
		jwt.verify(req.cookies.token, jwtSecret, {}, async(err, userData) =>{
			if (err) {
                reject(err);
            } else {
                resolve(userData);
            }
		})
	})
}

app.get("/test", (req, res) => {
	res.json("test ok");
});

app.post("/register", async (req, res) => {
	const { userDetails } = req.body;

	try {
		const user = await UserModel.create({
			name: userDetails.name,
			email: userDetails.email,
			password: bcrypt.hashSync(userDetails.password, 10),
		});

		res.json(user);
	} catch (error) {
		res.status(422).json(error);
	}
});

app.post("/login", async (req, res) => {
	const { userDetails } = req.body;
	const user = await UserModel.findOne({ email: userDetails.email });

	if (user) {
		const passOk = bcrypt.compareSync(userDetails.password, user.password);
		if (passOk) {
			jwt.sign(
				{ email: user.email, id: user._id },
				jwtSecret,
				{},
				(err, token) => {
					if (err) {
						throw err;
					}
					res.cookie("token", token, { httpOnly: true, sameSite: "none", secure: true }).send(user);
				}
			);
			// res.send('pass ok')
		} else {
			res.status(422).send("pass not ok");
		}
	} else {
		res.status(422).send("user not found");
	}
});

app.get("/profile", (req, res) => {
	const { token } = req.cookies;
	if (token) {
		jwt.verify(token, jwtSecret, {}, async (err, userData) => {
			if (err) throw err;

			const { _id, name, email } = await UserModel.findById(userData.id);
			res.json({ _id, name, email });
			// res.json(userData)
		});
	} else {
		res.json(null);
	}
});

app.post("/logout", (req, res) => {
	console.log("logging out");
	res.cookie("token", "").json(true);
});

app.post("/upload-by-link", async (req, res) => {
	const { link } = req.body;
	const newName = "photo" + Date.now() + ".jpg";
	await imgDownloader.image({
		url: link,
		dest: __dirname + "\\uploads\\" + newName,
	});

	res.json(newName);
});

const photosMiddleware = multer({ dest: "uploads" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
	const uploadedFiles = [];

	for (let i = 0; i < req.files.length; i++) {
		const { path, originalname } = req.files[i];
		const parts = originalname.split(".");
		const ext = parts[parts.length - 1];
		const newPath = path + "." + ext;

		fs.renameSync(path, newPath);

		uploadedFiles.push(newPath.replace("uploads\\", ""));
	}
	res.send(uploadedFiles);
});

app.post("/places", async (req, res) => {	
	const { title, address, photos, description,
		perks, extraInfo, checkIn, checkOut, maxGuests, price
	} = req.body;	

	try {
	    const userData = await getUserData(req)
		const newPlace = await PlaceModel.create({
					owner: userData.id,
						title,
						address,
						photos,
						description,
						perks,
						extraInfo,
						checkIn,
						checkOut,
						maxGuests, price,
				});
		res.json(newPlace);
				
	    
	} catch (error) {
	    res.status(422).send(error)

	}
});

app.get('/user-places', async(req, res) => {	
	const userData = await getUserData(req)
	res.json(await PlaceModel.find({owner: userData.id}))
	
})

app.get('/places/:id', async (req, res) => {
	const {id} = req.params
	res.json(await PlaceModel.findById(id))
})

app.put('/places', async (req,res) => {	
	const {id, title, address, photos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price} = req.body
	const placeDoc = await PlaceModel.findById(id)

	const user = await getUserData(req)
		
	if (placeDoc.owner.toString() === user.id){
		placeDoc.set({
			title,
			address,
			photos,
			description,
			perks,
			extraInfo,
			checkIn,
			checkOut,
			maxGuests,
			price,
		});

		await placeDoc.save()
		res.json('ok')			
	}
	
})

app.get('/places', async (req, res) => {
	res.json(await PlaceModel.find())
})

app.post('/booking', async (req, res) => {	
	const {place, checkIn, checkOut, guests,price} = req.body
	const user = await getUserData(req)
	
	Booking.create({place, checkIn, checkOut, guests, price, bookedBy: user.id}).then((doc) => {
		res.json(doc)
	}).catch((err) => { throw err })
	
})

app.get('/bookings', async (req, res) => {
    const userData = await getUserData(req)
	res.json(await Booking.find({bookedBy: userData.id}).populate('place'))
})

const port = process.env.PORT || 4000;
app.listen(port, ".0.0.0.0", () => console.log('server listening on port ' + port));
