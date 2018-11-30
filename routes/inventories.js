const Express = require('express')
const Lodash = require('lodash')
const db = require('../db')

const router = Express.Router()

router
  .delete('/:id', (req, res) => {
    db.transaction(async trx => {
      await trx('inventories')
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
      const rows = await trx('inventories')
        .update({
          code: req.body.code,
          name: req.body.name,
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
      const rows = await trx('inventories')
        .insert({
          company_id: parseInt(req.body.company_id),
          code: req.body.code,
          name: req.body.name,
          weight: req.body.weight || 0,
          cost: req.body.cost || 0
        })
        .returning('*')
      const inventory = Lodash.mapKeys(rows[0], (value, key) =>
        Lodash.camelCase(key)
      )
      await trx('transactions').insert({
        company_id: parseInt(req.body.company_id),
        inventory_id: inventory.id,
        weight: inventory.weight,
        cost: inventory.cost
      })
      res.status(201).json(inventory)
    }).catch(err => {
      console.dir(err)
      res.sendStatus(500)
    })
  })

module.exports = router
