import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import {json} from 'body-parser';
import consola from 'consola';

//import application constant
import {DB, PORT} from './constants';

//initialize express application
const app = express();

// main async function 
const main = () => {
  try{
     //connect with DB
      mongoose.connect(DB, {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true})
     //start application listening for request on server
  } catch (err){}
};

main();