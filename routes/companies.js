const Express = require('express')
const Lodash = require('lodash')
const db = require('../db')

const router = Express.Router()

router
  .delete('/:id', (req, res) => {
    db.transaction(async trx => {
      const deletedRows = await trx('companies')
        .del()
        .where('id', parseInt(req.params.id))
        .returning('*')
      if (deletedRows[0].is_active) {
        const maxRows = await trx('companies').max('id as i')
        await trx('companies')
          .update({
            is_active: true,
            updated_at: db.fn.now()
          })
          .where('id', maxRows[0].i)
      }
      await trx('accountings')
        .del()
        .where('company_id', parseInt(req.params.id))
      res.sendStatus(204)
    }).catch(err => {
      console.dir(err)
      res.sendStatus(500)
    })
  })
  .get('/', async (req, res) => {
    try {
      const dataRows = await db('companies').selectPagination(req.query)
      const countRows = await db('companies').count('id as i')
      res.setHeader('x-total-count', countRows[0].i)
      res.status(200).json(dataRows)
    } catch (err) {
      console.dir(err)
      res.sendStatus(500)
    }
  })
  .get('/:id/accountings', async (req, res) => {
    try {
      const dataRows = await db('accountings')
        .selectSearch(['code', 'name'], req.query.search)
        .selectPagination(req.query)
        .where('company_id', parseInt(req.params.id))
      const countRows = await db('accountings')
        .selectSearch(['code', 'name'], req.query.search)
        .where('company_id', parseInt(req.params.id))
        .count('id as i')
      res.setHeader('x-total-count', countRows[0].i)
      res.status(200).json(dataRows)
    } catch (err) {
      console.dir(err)
      res.sendStatus(500)
    }
  })
  .get('/:id/contacts', async (req, res) => {
    try {
      const dataRows = await db('contacts')
        .selectSearch(['address', 'code', 'name'], req.query.search)
        .selectPagination(req.query)
        .where('company_id', parseInt(req.params.id))
      const countRows = await db('contacts')
        .selectSearch(['address', 'code', 'name'], req.query.search)
        .count('id as i')
      res.setHeader('x-total-count', countRows[0].i)
      res.status(200).json(dataRows)
    } catch (err) {
      console.dir(err)
      res.sendStatus(500)
    }
  })
  .get('/:id/inventories', async (req, res) => {
    try {
      const dataRows = await db('inventories')
        .selectSearch(['code', 'name'], req.query.search)
        .selectPagination(req.query)
        .where('company_id', parseInt(req.params.id))
      const countRows = await db('inventories')
        .selectSearch(['code', 'name'], req.query.search)
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
      if (req.body.is_active) {
        await trx('companies')
          .update({
            is_active: false,
            updated_at: db.fn.now()
          })
          .whereNot('id', parseInt(req.params.id))
      }
      const rows = await trx('companies')
        .update(
          Lodash.omitBy(
            {
              code: req.body.code,
              name: req.body.name,
              address: req.body.address,
              phone: req.body.phone,
              tax_code: req.body.tax_code,
              avatar: req.body.avatar,
              is_active: req.body.is_active,
              updated_at: db.fn.now()
            },
            Lodash.isUndefined
          )
        )
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
      const cpRows = await trx('companies')
        .insert({
          code: req.body.code,
          name: req.body.name,
          address: req.body.address,
          phone: req.body.phone,
          tax_code: req.body.tax_code,
          avatar: req.body.avatar,
          is_active: false
        })
        .returning('*')
      const newCompany = Lodash.mapKeys(cpRows[0], (value, key) =>
        Lodash.camelCase(key)
      )
      const acRows = await trx('accountings').where(
        'company_id',
        parseInt(req.body.prototype_id)
      )
      await trx('accountings').insert(
        acRows.map(row => {
          return {
            code: row.code,
            company_id: newCompany.id,
            is_safe: row.is_safe,
            name: row.name
          }
        })
      )
      const ctRows = await trx('contacts').where(
        'company_id',
        parseInt(req.body.prototype_id)
      )
      if (ctRows.length > 0) {
        await trx('contacts').insert(
          ctRows.map(row => {
            return {
              address: row.address,
              avatar: row.avatar,
              code: row.code,
              company_id: newCompany.id,
              name: row.name,
              phone: row.phone,
              prefix: row.prefix,
              tax_code: row.tax_code
            }
          })
        )
      }
      res.status(201).json(newCompany)
    }).catch(err => {
      console.dir(err)
      res.sendStatus(500)
    })
  })

module.exports = router
