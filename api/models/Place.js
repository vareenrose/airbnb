const mongoose = require('mongoose')

const PlaceSchema = new mongoose.Schema({
    owner: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    title: String,
    address: String,
    photos: [String],
    description: String,
    perks: [String],
    extraInfo: String,
    checkIn: String,
    checkOut: String,
    maxGuests: Number,
    price: Number,
})

const PlaceModel = mongoose.model('Place', PlaceSchema)
// PlaceModel.createIndexes({title: 'text', description: 'text', address: 'text'}).then(err => {
//     if (err) console.log(err)
// }) 
module.exports = PlaceModel