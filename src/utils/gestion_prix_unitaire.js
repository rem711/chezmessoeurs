const { Prix_Unitaire } = global.db

// gestion des prix par pièce

// gestion des options
const checksListeOptions = async (listeOptions) => {
    // on vérifie que la liste soit bien une string non vide
    if(typeof listeOptions !== "string" || listeOptions === '') return null

    // utiliser une liste de retour permet de sanitizer les données
    let returnedList = ''

    const tabOptions = listeOptions.split(';')
    for(const idOption of tabOptions) {
        if(idOption !== '') {
            const recette = await Prix_Unitaire.findOne({
                where: {
                    Id_Prix_Unitaire : idOption,
                    IsOption : 1
                }
            })
            if(recette === null) return null
            returnedList += `${idOption};`
        }
    }

    // si tout s'est bien passé, la liste est ok
    return returnedList
}

module.exports = {
    checksListeOptions
}