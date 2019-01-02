const express = require('express')
const lodash = require('lodash')
const db = require('../db')

const router = express.Router()

router
  .delete('/:id', (req, res) => {
    db.transaction(async trx => {
      await trx('contacts')
        .del()
        .where('id', parseInt(req.params.id))
      res.sendStatus(204)
    }).catch(err => {
      console.dir(err)
      res.sendStatus(500)
    })
  })
  .patch('/:id', (req, res) => {
    db.transaction(async trx => {
      const rows = await trx('contacts')
        .update({
          code: req.body.code,
          name: req.body.name,
          address: req.body.address,
          phone: req.body.phone,
          tax_code: req.body['tax-code'],
          prefix: req.body.prefix,
          avatar: req.body.avatar,
          updated_at: db.fn.now()
        })
        .where('id', parseInt(req.params.id))
        .returning('*')
      res
        .status(200)
        .json(lodash.mapKeys(rows[0], (value, key) => lodash.camelCase(key)))
    }).catch(err => {
      console.dir(err)
      res.sendStatus(500)
    })
  })
  .post('/', (req, res) => {
    db.transaction(async trx => {
      const rows = await trx('contacts')
        .insert({
          company_id: parseInt(req.body['company-id']),
          code: req.body.code,
          name: req.body.name,
          address: req.body.address,
          phone: req.body.phone,
          tax_code: parseInt(req.body['tax-code']),
          prefix: req.body.prefix,
          avatar: req.body.avatar
        })
        .returning('*')
      res
        .status(201)
        .json(lodash.mapKeys(rows[0], (value, key) => lodash.camelCase(key)))
    }).catch(err => {
      console.dir(err)
      res.sendStatus(500)
    })
  })

module.exports = router
