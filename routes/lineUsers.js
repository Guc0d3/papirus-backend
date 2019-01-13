const express = require('express')
const moment = require('moment')
const _ = require('lodash')
const db = require('../db')
const logger = require('../logger')

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
      res
        .status(200)
        .json(rows.map(row => _.mapKeys(row, (value, key) => _.camelCase(key))))
    } catch (err) {
      console.dir(err)
      res.sendStatus(500)
    }
  })
  .get('/:id', async (req, res) => {
    try {
      const rows = await db('line_users').where('id', parseInt(req.params.id))
      res.status(200).json(_.mapKeys(rows[0], (value, key) => _.camelCase(key)))
    } catch (err) {
      console.dir(err)
      res.sendStatus(500)
    }
  })
  .patch('/:id', (req, res) => {
    logger.debug('req.body: ' + JSON.stringify(req.body, null, 2))
    db.transaction(async trx => {
      const rows = await trx('line_users')
        .update({
          name: req.body.name,
          group_code: req.body.groupCode,
          expired_at: req.body.expiredAt,
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
