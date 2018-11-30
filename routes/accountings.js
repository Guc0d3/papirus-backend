const Express = require('express')
const db = require('../db')

const router = Express.Router()

router
  .delete('/:id', (req, res) => {
    db.transaction(async trx => {
      await trx('accountings')
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
      const rows = await trx('accountings')
        .update({
          code: req.body.code,
          name: req.body.name,
          updated_at: db.fn.now()
        })
        .where('id', parseInt(req.params.id))
        .returning('*')
      res.status(200).json(rows[0])
    }).catch(err => {
      console.dir(err)
      res.sendStatus(500)
    })
  })
  .post('/', (req, res) => {
    db.transaction(async trx => {
      const rows = await trx('accountings')
        .insert({
          company_id: parseInt(req.body.company_id),
          code: req.body.code,
          name: req.body.name,
          is_safe: false
        })
        .returning('*')
      res.status(201).json(rows[0])
    }).catch(err => {
      console.dir(err)
      res.sendStatus(500)
    })
  })

module.exports = router
