// const winston = require('winston')

// var logger = new winston.Logger({
//   levels: process.env.LOG_LEVEL,
//   transports: [
//     new winston.transports.Console({ json: false, timestamp: true }),
//     new winston.transports.File({
//       filename: __dirname + '/debug.log',
//       json: false
//     })
//   ],
//   exceptionHandlers: [
//     new winston.transports.Console({ json: false, timestamp: true }),
//     new winston.transports.File({
//       filename: __dirname + '/exceptions.log',
//       json: false
//     })
//   ],
//   exitOnError: false
// })

// module.exports = logger

const winston = require('winston')

const transports = {
  console: new winston.transports.Console({ level: process.env.LOG_LEVEL }),
  file: new winston.transports.File({
    filename: 'combined.log',
    level: 'error'
  })
}

const logger = winston.createLogger({
  transports: [transports.console, transports.file]
})

module.exports = logger
