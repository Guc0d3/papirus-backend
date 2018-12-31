require('dotenv').config()

const BodyParser = require('body-parser')
const cors = require('cors')
const Express = require('express')
const routes = require('./routes')

const app = Express()
app.use(
  cors({
    exposedHeaders: 'x-total-count'
  })
)
app.use(BodyParser.json())
app.use(BodyParser.urlencoded({ extended: true }))
app.use('/', routes)

const port = process.env.API_PORT || 3000

const listener = app.listen(port, () => {
  console.log(
    'Papirus APIs is running on ' +
      listener.address().address +
      ':' +
      listener.address().port
  )
  console.log('')
})
