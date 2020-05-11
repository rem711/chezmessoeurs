// check if the variable is set
module.exports = (val) => {
    if(val === '' || val === undefined || val === 'undefined') {
        return false
    }

    return true
}