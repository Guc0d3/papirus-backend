const AWS = require('aws-sdk')
const Multer = require('multer')
const MulterS3 = require('multer-s3')
const logger = require('./logger')

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
})

const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

const upload = Multer({
  storage: MulterS3({
    acl: 'public-read',
    bucket: process.env.AWS_S3_BUCKET_NAME,
    // contentType: MulterS3.AUTO_CONTENT_TYPE,
    s3,
    key: (req, file, cb) => {
      logger.debug(`file: ${JSON.stringify(file, null, 2)}`)
      const random = Math.floor(Math.random() * 900) + 100
      logger.debug(`random: ${random}`)
      const match = file.mimetype.match(/.*\/(.*)$/)
      const ext = match[1]
      logger.debug(`ext: ${ext}`)
      const newFilename =
        'files/' + Date.now().toString() + '-' + random + '.' + ext
      logger.debug('newFilename: ' + newFilename)
      cb(null, newFilename)
    }
  })
})

module.exports = upload
