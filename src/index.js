// require('dotenv').config({path: './env'});

import dotenv from "dotenv"
dotenv.config({
	path: './env'
})

import connectDB from './db/indexdb.js';

connectDB()







/*
import express from 'express';
const app = express();

; (async () => { 
	try {
		await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`); 
		app.on("error", (error) => {
			console.log("Application not able to talk DB:", error);
			throw error;
		});

		app.listen(procees.env.PORT, () => {
			console.log(`App is listening on port ${process.env.PORT}`);
		 })


	} catch (error) {
		console.log("ERROR: ", error);
	}
} )()

*/