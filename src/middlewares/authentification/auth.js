const whiteListUrls = [
    '/authentification',
    '/estimations'
]

const whiteListMethods = [
    'POST',
    'OPTIONS'
]
const auth = (req, res, next) => {
    if((whiteListUrls.includes(req.originalUrl) && whiteListMethods.includes(req.method)) || req.session.authenticated) {
        return next()
    }
    
    res.render('auth', {})
}

module.exports = auth