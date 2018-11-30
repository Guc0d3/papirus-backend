const Aws = require('aws-sdk')
const Express = require('express')
const Fs = require('fs')
const Path = require('path')
const db = require('../db')
const lineClient = require('../line-client')

const router = Express.Router()
router.post('/', async (req, res) => {
  try {
    const text = req.body.events[0].message.text
    const message = req.body.events[0].message
    const userCode = req.body.events[0].source.userId
    const replyToken = req.body.events[0].replyToken
    if (replyToken === '00000000000000000000000000000000') {
      return res.sendStatus(200)
    }
    console.log('# LINE_WEBHOOK')
    console.log('Event:', {
      replyToken,
      text: message.text,
      userId: userCode
    })
    const sender = await lineClient.getUserProfile(userCode)
    console.log('Sender:', sender.displayName)
    if (message.type === 'text') {
      await db('line_messages').insert({
        sender: sender.displayName,
        reciver: 'Bot',
        text: message.text
      })
    } else if (message.type === 'image') {
      console.log('fileName:', message.fileName)
      console.log('fileSize:', message.fileSize)
      const buffer = await lineClient.retrieveMessageContent(message.id)
      const filename = message.id
      const s3 = new Aws.S3({
        params: { Bucket: process.env.S3_BUCKET_NAME }
      })
      const uploadFilename = Date.now().toString() + '-' + filename
      s3.createBucket(() => {
        s3.upload(
          {
            ACL: 'public-read',
            Key: 'files/' + uploadFilename,
            Body: buffer
          },
          (err, data) => {
            if (err) throw err
            console.log('data', data)
            db('line_messages').insert({
              sender: sender.displayName,
              reciver: 'Bot',
              image: uploadFilename
            })
          }
        )
      })
    }
    let rows = null
    rows = await db('line_users').where('code', userCode)
    if (rows.length === 0) {
      // new user
      console.log('- Sender is new user:')
      let expiredAt = new Date()
      expiredAt.setDate(expiredAt.getDate() + 1 + 7)
      await db('line_users').insert({
        code: userCode,
        display_name: sender.displayName,
        picture_url: sender.pictureUrl,
        status_message: sender.statusMessage,
        name: null,
        group_code: 'g',
        expired_at: expiredAt.toISOString().substr(0, 10)
      })
    } else {
      rows = await db('line_users')
        .where('code', userCode)
        .whereNot('display_name', sender.displayName)
      if (rows.length > 0) {
        await db('line_users')
          .update({
            display_name: sender.displayName,
            updated_at: db.fn.now()
          })
          .where('code', userCode)
      }
    }

    if (message.text === '/location') {
      console.log('TODO')
    } else if (message.text === '/price') {
      console.log('TODO')
    } else {
      await pushText(sender, 'Bot พร้อมให้บริการ กรุณาเลือกคำสั่ง')
    }
    res.sendStatus(200)
  } catch (err) {
    console.dir(err)
    res.sendStatus(500)
  }
})

const pushText = async (reciver, text) => {
  if (reciver) {
    await lineClient.pushText(reciver.userId, text)
  }
  await db('line_messages').insert({
    sender: 'Bot',
    reciver: (reciver || '').displayName,
    text
  })
}

module.exports = router
