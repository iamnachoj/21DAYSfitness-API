import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import {json} from 'body-parser';
import consola from 'consola';
import passport from 'passport';

//import application constant
import {DB, PORT} from './constants';

// Router imports
import UserApis from './apis/users';

// Import passport middleware
require("./middlewares/passport-middleware");

//initialize express application
const app = express();

// apply application middleware
app.use(cors());
app.use(json());
app.use(passport.initialize());

//Inject Sub router and apis
app.use('/users', UserApis)

// main async function 
const main = async () => {
  try{
      // Connect with DB
      await mongoose.connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      consola.success('DATABASE CONNECTED...')
      app.listen(PORT, () => {consola.success('DATABASE CONNECTED ON PORT ' + PORT)});
     //start application listening for request on server
  } catch (err){
    consola.error('database not connected. ' + err.message)
  }
};

main();