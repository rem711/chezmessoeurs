module.exports = (req, res, next) => {
    if(req.secure) {
        return next()
    }

    return res.status(301).redirect('https://' + req.headers.host + req.url)
}