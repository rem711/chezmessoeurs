module.exports = (num) => {
    const numSize = num.toString().length
    let formatedNumber = ''

    // on ajoute des 0 en dessous de 1000
    if(numSize < 4) {
        const diff = 4 - numSize
        for(let i = 0; i < diff; i++) {
            formatedNumber += '0'
        }
    }
    formatedNumber += num

    return formatedNumber
}