const mongoose = require('mongoose');

const candySchema = new mongoose.Schema({
    candyName: { type: String , required: true , unique : true },
    price: { type: Number , required: true },
    image: { type : String },
    count: { type: Number , default: 0 },
});

module.exports = mongoose.model('Candy' , candySchema);