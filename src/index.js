import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import {json} from 'body-parser';
import consola from 'consola';

//import application constant
import {DB, PORT} from './constants';

// Router exports
import UserApis from './apis/users';

//initialize express application
const app = express();

// apply application middleware
app.use(cors());
app.use(json());

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