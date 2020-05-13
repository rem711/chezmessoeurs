const whiteList = [
    {
        url : '/css/login.css',
        method : 'GET'
    },
    {
        url : '/img/logo_cmstraiteur.png',
        method : 'GET'
    },
    {
        url : '/img/backgroundchezmessoeurs.png',
        method : 'GET'
    },
    {
        url : '/authentification',
        method : 'POST'
    },
    {
        url : '/estimations',
        method : 'OPTIONS'
    },
    {
        url : '/estimations',
        method : 'POST'
    }
]

const isAcessible = (url, method) => {
    for(let elt of whiteList) {
        if(elt.url === url && elt.method === method) {
            return true
        }
    }

    return false
}

const auth = (req, res, next) => {    
    return next()
    if(req.session.authenticated || isAcessible(req.originalUrl, req.method)) {
        return next()
    }
    
    return res.status(401).render('auth', {})
}

module.exports = auth