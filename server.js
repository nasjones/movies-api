require('dotenv').config()

const express = require('express')
const morgan = require('helmet')
const cors = require('cors')
const helmet = require('helmet')
const app = express()
const MOVIES = require('./movies.json')

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
})

function getMovie(req, res) {
    let response = MOVIES
    if (req.query.genre) {
        response = response.filter(movie =>
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
    }

    if (req.query.country) {
        response = response.filter(movie =>
            movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        )
    }

    if (req.query.vote) {
        let vote = parseFloat(vote)
        response = response.filter(movie =>
            movie.avg >= vote)
    }

    res.json(response)
}


app.get('/movie', getMovie)

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})