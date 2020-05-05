const app = require('./src/app')
const port = process.env.PORT
const logger = require('./src/utils/logger')

app.listen(port,  () => {
    // console.log('Server up on port ' + port)
    logger.info('Server up on port ' + port)
})