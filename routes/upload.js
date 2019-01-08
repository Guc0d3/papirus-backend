const express = require('express')
const logger = require('../logger')
const upload = require('../upload')

const router = express.Router()
router.post('/', upload.single('file'), function(req, res) {
  logger.debug('POST /upload')
  logger.debug('req.file: ' + JSON.stringify(req.file, null, 2))
  try {
    if (!req.file) {
      throw new Error('No file received')
    }
    return res.status(200).send(req.file.key.replace(/^(files\/)/, ''))
  } catch (err) {
    console.dir(err)
    res.sendStatus(500)
  }
})

module.exports = router
