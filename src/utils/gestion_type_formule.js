const { Type_Formule } = global.db


// ajoute en BDD et le retourne
const create = async (postType_Formule) => {
    let type_formule = undefined

    try {
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
            }
            catch(error) {
                throw new Error(error.errors[0].message)
            }
        }
        // sinon erreur
        else {
            throw new Error('Type de formule déjà existant.')
        }
    }
    catch(error) {
        throw new Error(error)
    }

    return type_formule
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