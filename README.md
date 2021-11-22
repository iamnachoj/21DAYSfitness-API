# 21DAYSfitness-API
RESTful API for 21DAYS application. 
The 21DAYS API is a server-side component of a “workout” RESTful API, that includes a database created with MongoDB, the server, and the business logic layer.

The application provides authenticated users with access to different workout routines and its information. They can keep track of their progress, as well as common abilities as to change or delete their profile. The REST API will be accessed by CRUD operations.

It's User Interface (client-side) is built externally with React. See link to the app <a href="https://github.com/agusNiko/21DAYS-fitness-client">here</a>

## Tools
 - NodeJS
 - Express
 - MongoDB
 - 
## Getting Started
The easiest way to get started is to clone the repository:

Clone the repository `Git clone https://github.com/iamnachoj/21DAYSfitness-API/`

Change directory `cd 21DAYSfitness-API`

Install NPM dependencies `npm install`

Start the server `npm run start` Note: It is recommended to install nodemon for live reloading - It watches for any changes in your node.js app and automatically restarts the server

## Deployment
### Deployment to Heroku
Deployment is not yet available.

I used postman to test the api. To use postman, go to the project doc folder and import the docs file into your postman client to ease the testing

Don´t forget to check out the documentation endpoint (/Documentation) in order to know how to send every HTTP request.
