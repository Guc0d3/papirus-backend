const AWS = require('aws-sdk')
const express = require('express')
const Multer = require('multer')
const MulterS3 = require('multer-s3')

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})
const s3 = new AWS.S3()

const upload = Multer({
  storage: MulterS3({
    acl: 'public-read',
    bucket: process.env.AWS_S3_BUCKET_NAME,
    contentType: MulterS3.AUTO_CONTENT_TYPE,
    s3,
    key: (req, file, cb) => {
      cb(null, 'files/' + Date.now().toString() + '-' + file.originalname)
    }
  })
})

const router = express.Router()
router.post('/', upload.single('file'), function(req, res) {
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
