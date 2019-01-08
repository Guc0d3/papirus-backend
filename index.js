require('dotenv').config()

const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const routes = require('./routes')

const app = express()
app.use(
  cors({
    exposedHeaders: 'x-total-count'
  })
)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use('/', routes)

const port = process.env.API_PORT || 3000

const listener = app.listen(port, () => {
  console.log('Papirus APIs is running on port ' + listener.address().port)
})
