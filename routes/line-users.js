const Express = require('express')
const Lodash = require('lodash')
const db = require('../db')

const router = Express.Router()
router
  .get('/', async (req, res) => {
    try {
      const dataRows = await db('line_users')
        .selectSearch(
          ['display_name', 'status_message', 'name'],
          req.query.search
        )
        .selectPagination(req.query)
      const countRows = await db('line_messages')
        .selectSearch(
          ['display_name', 'status_message', 'name'],
          req.query.search
        )
        .count('id as i')
      res.setHeader('x-total-count', countRows[0].i)
      res.status(200).json(dataRows)
    } catch (err) {
      console.dir(err)
      res.sendStatus(500)
    }
  })
  .patch('/:id', (req, res) => {
    db.transaction(async trx => {
      const rows = await trx('line_users')
        .update({
          name: req.body.name,
          group_code: req.body.group_code,
          expired_at: req.body.expired_at,
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

module.exports = router
