const { Type_Formule } = global.db
const errorHandler = require('../utils/errorHandler')


// ajoute en BDD et le retourne
const create = async (postType_Formule) => {
    let infos = undefined
    let type_formule = undefined

    // controle pour la clause where
    postType_Formule.Nom = postType_Formule.Nom === undefined ? '' : postType_Formule.Nom

    // vérification unicité Nom
    const temp_type_formule = await Type_Formule.findOne({
        where : {
            Nom : postType_Formule.Nom
        }
    })

    // si n'existe pas encore on le crée
    if(temp_type_formule === null) {
        try {
            type_formule = await Type_Formule.create({
                Nom : postType_Formule.Nom
            })
            infos = errorHandler(undefined, 'Le type de formule a été créé.')
        }
        catch(error) {
            infos = errorHandler(error.errors[0].message, undefined)
        }
    }
    // sinon erreur
    else {
        infos = errorHandler('Type de formule déjà existant.', undefined)
    }

    console.log('infos : ', infos)
    console.log('type_formule : ', type_formule)
    return {
        infos,
        type_formule
    }
}

// TODO
// modifie et retourne
// vérification unicité Nom
const modify = async () => {

}

// TODO
// supprime le type
const destroy = async () => {

}

module.exports = {
    create,
    modify,
    destroy
}