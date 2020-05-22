const bcrypt = require('bcryptjs')

const main = async (password) => {
    const paswwordEncrypted = await bcrypt.hash(password, 8)
    console.log(paswwordEncrypted)
}

const args = process.argv.slice(2)
if(args.length === 1 && args[0] !== '') {
    main(args[0])
}
else {
    console.log("Aucun mot de passe fourni!")
}