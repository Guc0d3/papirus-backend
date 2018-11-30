const Express = require('express')
const Path = require('path')
const accountings = require('./accountings')
const companies = require('./companies')
const contacts = require('./contacts')
const install = require('./install')
const inventories = require('./inventories')
const lineMessages = require('./line-messages')
const lineUsers = require('./line-users')
const lineWebhook = require('./line-webhook')
const upload = require('./upload')

const router = Express.Router()

router.use('/accountings', accountings)
router.use('/companies', companies)
router.use('/contacts', contacts)
router.use('/install', install)
router.use('/inventories', inventories)
router.use('/line-messages', lineMessages)
router.use('/line-users', lineUsers)
router.use('/line-webhook', lineWebhook)
router.use('/upload', upload)
router
  .get('/version', (req, res) => {
    res.status(200).send('1.0')
  })
  .get('*', (req, res) => {
    res.status(404).send()
  })

module.exports = router
