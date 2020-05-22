const bcrypt = require('bcryptjs')

const main = async (password) => {
    const paswwordEncrypted = await bcrypt.hash(password, 8)
    console.log(paswwordEncrypted)
}

main('test')