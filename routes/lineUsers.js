const express = require('express')
const _ = require('lodash')
const db = require('../db')

const router = express.Router()
router
  .get('/', async (req, res) => {
    try {
      let rows = await db('line_users')
        .selectSearch(
          ['display_name', 'status_message', 'name'],
          req.query.search
        )
        .count('id as i')
      res.setHeader('x-total-count', rows[0].i)
      rows = await db('line_users')
        .selectSearch(
          ['display_name', 'status_message', 'name'],
          req.query.search
        )
        .selectPagination(req.query)
      const data = rows.map(row =>
        _.mapKeys(row, (value, key) => _.camelCase(key))
      )
      res.status(200).json(data)
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
          group_code: req.body['group_code'],
          expired_at: req.body['expired_at'],
          updated_at: db.fn.now()
        })
        .where('id', parseInt(req.params.id))
        .returning('*')
      res.status(200).json(_.mapKeys(rows[0], (value, key) => _.camelCase(key)))
    }).catch(err => {
      console.dir(err)
      res.sendStatus(500)
    })
  })

module.exports = router
