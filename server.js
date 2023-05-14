'use strict';

//barebones server step 1: allows us to dotenv variables within our application
require('dotenv').config();

//barebones server step 2: these are also import statements but assigned to a variable so the variable can be used
const express = require('express');
const cors = require('cors');
const axios = require('axios');

//barebones server step 3: initializes express
const app = express();

//barebones server step 4: this passes an empty cors to allow any and all requests, .use is an express method
app.use(cors());

//barebones server step 5: allows access to sensitive variables in the .env file, adding || 3002 sets 3002 as a backup port
const port = process.env.PORT;

//barebones server step 6: .get is an express method (are other methods like PUT, POST, DELETE, etc)
app.get('/', (req, res) => {
    res.status(200).send('proof of life message');
})

//

//weather route per API documentation
app.get('/weather', (req, res, next) => {
    const url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHERBIT_KEY}&lat=${lat}&lon=${lon}`;
    axios.get(url)
        .then(obj => new Forecast(obj))

})

app.get('/movies', (req, res, next) => {
    const url = `https://api.themoviedb.org/3/movie/20?api_key=${process.env.MOVIEDB_KEY}`;
    axios.get(url)
        .then(obj => new Movie(obj))

})

//second route to read the static data
//for netlify as our front-end, replace localhost:3001 with http://render-app-name/weatherData (render is our host)
app.get('/weather', (request, response, next) => {
    try {
        const { lat, lon, searchQuery } = request.query;
        if (searchQuery === 'Seattle') {
            const formattedData = weatherData[0].data.map(obj => new Forecast(obj));
            response.status(200).send(formattedData);
        } else if (searchQuery === 'Paris') {
            const formattedData = weatherData[1].data.map(obj => new Forecast(obj));
            response.status(200).send(formattedData);
        } else if (searchQuery === 'Amman') {
            const formattedData = weatherData[2].data.map(obj => new Forecast(obj));
            response.status(200).send(formattedData);
        } else {
            response.status(404).send('City not found');
        }
    } catch (error) {
        next(error);
    }
})

//helps format our data from the API
class Forcast {
    constructor(obj){
        this.date = obj.valid_date;
        this.description = obj.weather.description;

    }
}

class Movie {
    constructor(obj){
        this.img = obj.image_url;
        this.popularity = obj.popularity;
    }
}

//catch-all route
app.get('*', (error, req, res, next) => {
    res.status(404).send('404 error')
})

//middleware for error-handling
app.use((error, req, res, next) => {
    res.status(500).send('Catch-all error')
})

//barebones server step 7: proof of life-ish
app.listen(port, () => console.log(`listening on ${port}`))