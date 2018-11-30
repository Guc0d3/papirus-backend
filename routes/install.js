const Express = require('express')
const Lodash = require('lodash')
const db = require('../db')
const lineClient = require('../line-client')
const { accountings, companies, contacts } = require('../install-items')

const router = Express.Router()
router
  .get('/', async (req, res) => {
    try {
      await install(req.query.line_admin_uid)
      res.sendStatus(200)
    } catch (err) {
      console.dir(err)
      res.sendStatus(500)
    }
  })
  .post('/', async (req, res) => {
    try {
      await install(req.body.line_admin_uid)
      res.sendStatus(200)
    } catch (err) {
      console.dir(err)
      res.sendStatus(500)
    }
  })

// const createTable = async () => {
//   console.log('create table')
//   const results = await Promise.all([
//     db.schema.createTable('accountings', table => {
//       table.increments()
//       table.integer('company_id')
//       table.string('code')
//       table.string('name')
//       table.boolean('is_safe')
//       table.timestamps(true, true)
//     }),
//     db.schema.createTable('companies', table => {
//       table.increments()
//       table.string('code')
//       table.string('name')
//       table.string('address')
//       table.string('phone')
//       table.string('tax_code')
//       table.string('avatar')
//       table.boolean('is_active')
//       table.timestamps(true, true)
//     }),
//     db.schema.createTable('contacts', table => {
//       table.increments()
//       table.integer('company_id')
//       table.string('code')
//       table.string('name')
//       table.string('address')
//       table.string('phone')
//       table.string('tax_code')
//       table.string('prefix')
//       table.string('avatar')
//       table.timestamps(true, true)
//     }),
//     db.schema.createTable('inventories', table => {
//       table.increments()
//       table.integer('company_id')
//       table.string('code')
//       table.string('name')
//       table.decimal('weight', 12, 2)
//       table.decimal('cost', 14, 4)
//       table.timestamps(true, true)
//     }),
//     db.schema.createTable('line_messages', table => {
//       table.increments()
//       table.string('sender')
//       table.string('reciver')
//       table.string('text')
//       table.string('image')
//       table.timestamp('created_at').defaultTo(db.fn.now())
//     }),
//     db.schema.createTable('line_users', table => {
//       table.increments()
//       table.string('code')
//       table.string('display_name')
//       table.string('picture_url')
//       table.string('status_message')
//       table.string('name')
//       table.string('group_code', 1)
//       table.date('expired_at')
//       table.timestamps(true, true)
//     }),
//     db.schema.createTable('transactions', table => {
//       table.increments()
//       table.integer('company_id')
//       table.integer('inventory_id')
//       table.decimal('weight', 12, 2)
//       table.decimal('cost', 14, 4)
//       table.timestamps(true, true)
//     })
//   ])
//   return results
// }

const createTable = async () => {
  console.log('create table')
  const result = await db.transaction(async trx => {
    console.log('[ ] begin transaction')
    await trx.schema.createTable('accountings', table => {
      table.increments()
      table.integer('company_id')
      table.string('code')
      table.string('name')
      table.boolean('is_safe')
      table.timestamps(true, true)
    })
    console.log('[ ] create table accountings')
    await trx.schema.createTable('companies', table => {
      table.increments()
      table.string('code')
      table.string('name')
      table.string('address')
      table.string('phone')
      table.string('tax_code')
      table.string('avatar')
      table.boolean('is_active')
      table.timestamps(true, true)
    })
    console.log('[ ] create table companies')
    await trx.schema.createTable('contacts', table => {
      table.increments()
      table.integer('company_id')
      table.string('code')
      table.string('name')
      table.string('address')
      table.string('phone')
      table.string('tax_code')
      table.string('prefix')
      table.string('avatar')
      table.timestamps(true, true)
    })
    console.log('[ ] create table contacts')
    await trx.schema.createTable('inventories', table => {
      table.increments()
      table.integer('company_id')
      table.string('code')
      table.string('name')
      table.decimal('weight', 12, 2)
      table.decimal('cost', 14, 4)
      table.timestamps(true, true)
    })
    console.log('[ ] create table inventories')
    await trx.schema.createTable('line_messages', table => {
      table.increments()
      table.string('sender')
      table.string('reciver')
      table.string('text')
      table.string('image')
      table.timestamp('created_at').defaultTo(trx.fn.now())
    })
    console.log('[ ] create table line_messages')
    await trx.schema.createTable('line_users', table => {
      table.increments()
      table.string('code')
      table.string('display_name')
      table.string('picture_url')
      table.string('status_message')
      table.string('name')
      table.string('group_code', 1)
      table.date('expired_at')
      table.timestamps(true, true)
    })
    console.log('[ ] create table line_users')
    await trx.schema.createTable('transactions', table => {
      table.increments()
      table.integer('company_id')
      table.integer('inventory_id')
      table.decimal('weight', 12, 2)
      table.decimal('cost', 14, 4)
      table.timestamps(true, true)
    })
    console.log('[ ] create table transactions')
    return true
  })
  return result
}

const dropTable = async () => {
  console.log('drop table')
  const result = await db.transaction(async trx => {
    await trx.schema.dropTableIfExists('accountings')
    console.log('[ ] drop table accountings')
    await trx.schema.dropTableIfExists('companies')
    console.log('[ ] drop table companies')
    await trx.schema.dropTableIfExists('contacts')
    console.log('[ ] drop table contacts')
    await trx.schema.dropTableIfExists('inventories')
    console.log('[ ] drop table inventories')
    await trx.schema.dropTableIfExists('line_messages')
    console.log('[ ] drop table line_messages')
    await trx.schema.dropTableIfExists('line_users')
    console.log('[ ] drop table line_users')
    await trx.schema.dropTableIfExists('transactions')
    console.log('[ ] drop table transactions')
    return true
  })
  // const results = await Promise.all([
  //   db.schema.dropTableIfExists('accountings'),
  //   db.schema.dropTableIfExists('companies'),
  //   db.schema.dropTableIfExists('contacts'),
  //   db.schema.dropTableIfExists('inventories'),
  //   db.schema.dropTableIfExists('line_messages'),
  //   db.schema.dropTableIfExists('line_users'),
  //   db.schema.dropTableIfExists('transactions')
  // ])
  return result
}

const insertData = async () => {
  console.log('insert data')
  const results = await db
    .transaction(async trx => {
      let results = []
      let rows = null

      rows = accountings.map(item => {
        return Lodash.mapKeys(item, (value, key) => Lodash.snakeCase(key))
      })
      results.push(await trx('accountings').insert(rows))

      rows = companies.map(item => {
        return Lodash.mapKeys(item, (value, key) => Lodash.snakeCase(key))
      })
      results.push(await trx('companies').insert(rows))

      rows = contacts.map(item => {
        return Lodash.mapKeys(item, (value, key) => Lodash.snakeCase(key))
      })
      results.push(await trx('contacts').insert(rows))

      let expiredAt = new Date()
      expiredAt.setFullYear(expiredAt.getFullYear() + 100)

      let profile = await lineClient.getUserProfile(
        process.env.LINE_ADMIN_UID_0
      )
      results.push(
        await trx('line_users').insert({
          code: profile.userId,
          display_name: profile.displayName,
          picture_url: profile.pictureUrl,
          status_message: profile.statusMessage,
          name: 'Administrator',
          group_code: 'a',
          expired_at: expiredAt.toISOString().substr(0, 10)
        })
      )
      profile = await lineClient.getUserProfile(process.env.LINE_ADMIN_UID_1)
      results.push(
        await trx('line_users').insert({
          code: profile.userId,
          display_name: profile.displayName,
          picture_url: profile.pictureUrl,
          status_message: profile.statusMessage,
          name: 'Administrator',
          group_code: 'a',
          expired_at: expiredAt.toISOString().substr(0, 10)
        })
      )

      return results
    })
    .catch(err => {
      throw err
    })
  return results
}

const install = async lineAdminUId => {
  console.log('')
  console.log('install')
  console.log('=======')
  console.log('')
  if (lineAdminUId !== process.env.LINE_ADMIN_UID_0) {
    throw new Error('Permission: Deny (Administration Only)')
  }
  const results = await dropTable()
    .then(() => createTable())
    .then(() => insertData())
  return results
}

module.exports = router
