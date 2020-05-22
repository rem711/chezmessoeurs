module.exports = (req, res, next) => {
    if(req.secure) {
        return next()
    }

    return res.redirect('https://' + req.headers.host + req.url)
}