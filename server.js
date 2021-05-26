const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv/config');

const userRouter = require('./routers/user-router');
const candyRouter = require('./routers/candy-router');

const checkAccessToken = require('./middlewares/checkAccessToken');

require("dotenv").config({ path: path.join(__dirname, "../.env") });

const app = express();

const PORT = process.env.PORT || 3000;

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:admin@cluster0.mkibu.mongodb.net/super-online?retryWrites=true&w=majority',{ useCreateIndex: true , useNewUrlParser: true , useUnifiedTopology: true, })
        .then(() => { console.log('Connected to the Database successfully');})
        .catch(err => { console.error('Connection error', err.message) });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({ origin: ["https://super-online-client.herokuapp.com","http://localhost:8080"], useCredentials: true, }));
app.use('/uploads', express.static('uploads'));

app.use(checkAccessToken);

app.use('/api' , userRouter);
app.use('/api' , candyRouter);

app.listen(PORT, () => {
    console.log('Server is listening on Port:', PORT)
});
