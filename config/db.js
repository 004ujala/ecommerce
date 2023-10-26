const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
        console.log('db connected successfully'.bgGreen.white);
    } catch (error) {
        console.log(`error in db connecting`.bgRed.white);
    }
}


module.exports = connectDB;