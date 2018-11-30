const Express = require('express')
const Lodash = require('lodash')
const db = require('../db')

const router = Express.Router()

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
          tax_code: req.body.tax_code,
          prefix: req.body.prefix,
          avatar: req.body.avatar,
          updated_at: db.fn.now()
        })
        .where('id', parseInt(req.params.id))
        .returning('*')
      res
        .status(200)
        .json(Lodash.mapKeys(rows[0], (value, key) => Lodash.camelCase(key)))
    }).catch(err => {
      console.dir(err)
      res.sendStatus(500)
    })
  })
  .post('/', (req, res) => {
    db.transaction(async trx => {
      const rows = await trx('contacts')
        .insert({
          company_id: parseInt(req.body.company_id),
          code: req.body.code,
          name: req.body.name,
          address: req.body.address,
          phone: req.body.phone,
          tax_code: req.body.tax_code,
          prefix: req.body.prefix,
          avatar: req.body.avatar
        })
        .returning('*')
      res
        .status(201)
        .json(Lodash.mapKeys(rows[0], (value, key) => Lodash.camelCase(key)))
    }).catch(err => {
      console.dir(err)
      res.sendStatus(500)
    })
  })

module.exports = router
