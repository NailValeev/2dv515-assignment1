const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/*
// Set up mongoose connection
var mongoDB = process.env.MONGODB_URI
mongoose.connect(mongoDB, { useNewUrlParser: true, useCreateIndex: true }) // Because DeprecationWarning
mongoose.Promise = global.Promise
var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.on('connected', () => console.log('Mongoose connection is open.'))
db.on('disconnected', () => console.log('Mongoose connection is disconnected.'))
*/
const euclideanRouter = require('./routes/euclidean');
const pearsonRouter = require('./routes/pearson');

app.use('/euclidean', euclideanRouter);
app.use('/pearson', pearsonRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
