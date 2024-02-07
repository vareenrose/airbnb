const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
	place: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Place",
		required: true,
	},
	bookedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	checkIn: {
		type: Date,
		required: true,
	},
	checkOut: {
		type: Date,
		required: true,
	},
	guests: {
		type: Number,
		required: true,
	},
	price: { type: Number, required: true },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
