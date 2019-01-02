const express = require('express')
const accountings = require('./accountings')
const companies = require('./companies')
const contacts = require('./contacts')
const install = require('./install')
const inventories = require('./inventories')
const lineMessages = require('./lineMessages')
const lineUsers = require('./lineUsers')
const lineWebhook = require('./lineWebhook')
const upload = require('./upload')

const router = express.Router()

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
    res.status(200).send(process.env.API_VERSION || 1)
  })
  .get('*', (req, res) => {
    res.status(404).send()
  })

module.exports = router
