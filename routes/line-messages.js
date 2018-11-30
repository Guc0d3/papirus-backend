const Express = require('express')
const Lodash = require('lodash')
const db = require('../db')
const lineClient = require('../line-client')

const router = Express.Router()
router
  .get('/', async (req, res) => {
    try {
      const dataRows = await db('line_messages')
        .selectSearch(['sender', 'reciver', 'text'], req.query.search)
        .selectPagination(req.query)
      const countRows = await db('line_messages')
        .selectSearch(['sender', 'text'], req.query.search)
        .count('id as i')
      res.setHeader('x-total-count', countRows[0].i)
      res.status(200).json(dataRows)
    } catch (err) {
      console.dir(err)
      res.sendStatus(500)
    }
  })
  .post('/', async (req, res) => {
    try {
      const rows = await db('line_users')
        .whereIn('code', req.body.codes)
        .orWhereIn('group_code', req.body.groups)
      rows.forEach(async row => {
        const reciver = await lineClient.getUserProfile(row.code)
        if (req.body.text) {
          await lineClient.pushText(row.code, req.body.text)
          await db('line_messages').insert({
            sender: 'Bot',
            reciver: reciver.displayName,
            text: req.body.text
          })
        } else {
          const imageUrl =
            'https://s3-' +
            process.env.AWS_REGION +
            '.amazonaws.com/' +
            process.env.S3_BUCKET_NAME +
            '/files/' +
            req.body.image
          await lineClient.pushImage(row.code, {
            originalContentUrl: imageUrl,
            previewImageUrl: imageUrl
          })
          await db('line_messages').insert({
            sender: 'Bot',
            reciver: reciver.displayName,
            image: req.body.image
          })
        }
      })
      res.sendStatus(201)
    } catch (err) {
      console.dir(err)
      res.sendStatus(500)
    }
  })

module.exports = router
