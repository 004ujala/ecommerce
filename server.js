const express = require('express');
// use for env file creation in nodeJs
const dontenv = require('dotenv').config();
const colors = require('colors');
// use for checking particular request hits
const morgan = require('morgan')
const connectDB = require('./config/db');
const authRoute = require('./routes/authRoute');
const categoryRoute = require('./routes/categoryRoute');
const productRoute = require('./routes/productRoute');
// for preventing cross origin errors of different ports
const cors = require('cors');


const app = express();
connectDB();

// configure
app.use(morgan('dev'));  //to check the hit req
app.use(express.json());
app.use(cors());

// routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/product', productRoute);


const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`.bgGreen.white);
})