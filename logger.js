const { createLogger, format, transports } = require('winston')
const { combine, timestamp, printf, colorize } = format

const myFormat = printf(info => {
  return `${info.level}: ${info.message}`
})

const myTransports = {
  console: new transports.Console({ level: process.env.LOG_LEVEL }),
  file: new transports.File({
    filename: 'error.log',
    level: 'error'
  })
}

const logger = createLogger({
  format: combine(colorize(), myFormat),
  transports: [myTransports.console, myTransports.file],
  exitOnError: false
})

module.exports = logger
