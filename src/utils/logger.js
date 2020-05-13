const { createLogger, transports, format } = require('winston')
require('winston-daily-rotate-file')
const path = require('path')

const logFolder = path.join(__dirname, '../../logs/infos/')
const errorFolder = path.join(__dirname, '../../logs/errors/')
const combinedFolder = path.join(__dirname, '../../logs/combinedLogs/')

const customFormat = format.combine(   
    format.errors({ stack : true }), 
    format.splat(),
    format.timestamp({
        format : 'YYYY-MM-DD HH:mm:ss'
    }),
    format.align(),
    format.printf(info => {
        if(info.stack) return `[${info.level}][${info.timestamp}] ${info.message} \n${info.stack}`

        return `[${info.level}][${info.timestamp}] ${info.message}`
    })
)

const errorTransporter = new (transports.DailyRotateFile)({
    level : 'warn',
    handleExceptions : true,
    datePattern : 'YYYY-MM-DD',
    zippedArchive : true,
    filename : '%DATE%.log',
    dirname : errorFolder,
    maxSize : '100m',
    maxFiles : '31d',
    utc : true,
    format : customFormat
})

const infoFilter = format((info, opts) => {
    return info.level === 'info' ? info : false
})

const logger = createLogger({
    format : customFormat,
    transports : [],
    exceptionHandlers : [
        errorTransporter
    ],
    exitOnError : false
})

if(process.env.NODE_ENV === 'production') {
    logger.add(new (transports.DailyRotateFile)({
        name : 'ALL logs',
        level : 'silly',
        datePattern : 'YYYY-MM-DD',
        zippedArchive : true,
        filename : '%DATE%.log',
        dirname : combinedFolder,
        maxSize : '500m',
        maxFiles : '10d',
        utc : true
    }))

    logger.add(new (transports.DailyRotateFile)({
        name : 'INFO logs',
        level : 'info',
        datePattern : 'YYYY-MM-DD',
        zippedArchive : true,
        filename : '%DATE%.log',
        dirname : logFolder,
        maxSize : '100m',
        maxFiles : '31d',
        utc : true,
        format : format.combine(
            infoFilter(),
            customFormat
        )
    }))

    logger.add(errorTransporter)
}

if(process.env.NODE_ENV === 'development') {
    logger.add(new transports.Console({
        level : 'silly',
        format : format.combine(
            format.colorize(),
            customFormat
        )
    }))
}

// pour rendre le stream accessible par d'autres libs
// on retire le dernier \n inséré par morgan afin d'éviter les sauts de lignes inutiles
logger.stream = {
    write : msg => logger.verbose(msg.substring(0, msg.lastIndexOf('\n')))
}

module.exports = logger