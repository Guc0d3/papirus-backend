const KnexQueryBuilder = require('knex/lib/query/builder')
const _ = require('lodash')
const logger = require('./logger')

KnexQueryBuilder.prototype.selectPagination = function({
  fields = '',
  page,
  perPage = 20,
  sort
}) {
  const fields_ = fields.split(',').map(field => field.trim())
  const offset = page == null ? null : (page - 1) * perPage
  const limit = page == null ? null : perPage
  const sort_ = sort == null ? null : _.snakeCase(sort.replace('-', ''))
  const direction = sort == null ? null : sort[0] === '-' ? 'desc' : 'asc'
  if (fields_.length > 0) {
    this.select(...fields_)
  }
  if (offset != null) {
    this.offset(offset)
  }
  if (limit != null) {
    this.limit(limit)
  }
  if (sort_ != null) {
    const timestampTypes = ['created_at', 'expired_at', 'updated_at']
    logger.debug('sort_: ' + sort_)
    logger.debug(
      'timestampTypes.indexOf(sort_): ' + timestampTypes.indexOf(sort_)
    )
    if (timestampTypes.indexOf(sort_) > -1) {
      this.orderBy(sort_, direction)
    } else {
      this.orderByRaw(sort_ + ' COLLATE "th_TH" ' + direction)
    }
  }
  return this
}

KnexQueryBuilder.prototype.selectSearch = function(columns, search) {
  if (search && search.trim().length > 0) {
    this.where(builder => {
      columns.forEach((column, index) => {
        if (index === 0) {
          builder.where(column, 'like', '%' + search + '%')
        } else {
          builder.orWhere(column, 'like', '%' + search + '%')
        }
      })
    })
  }
  return this
}

const db = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.POSTGRESQL_HOST,
    user: process.env.POSTGRESQL_USER,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DATABASE
  },
  pool: { min: 2, max: 20 },
  acquireConnectionTimeout: 300000
})

db.queryBuilder = function() {
  return new KnexQueryBuilder(db.client)
}

module.exports = db
