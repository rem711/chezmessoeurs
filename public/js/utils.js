// prends la route (uri) et les paramètres (params) pour encoder une url
const createURL = (uri, params) => {
    const esc = encodeURIComponent;
    const query = Object.keys(params)
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&');
    return uri + '?' + query
}