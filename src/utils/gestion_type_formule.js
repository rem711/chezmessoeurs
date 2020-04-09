const { Type_Formule } = global.db


// ajoute en BDD et le retourne
const create = async (postType_Formule) => {
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
        type_formule = await Type_Formule.create({
            Nom : postType_Formule.Nom
        })
    }
    // sinon erreur
    else {
        throw 'Type de formule déjà existant.'
    }

    return type_formule
}

// TODO:modifie type formule
// modifie et retourne
// vérification unicité Nom
const modify = async () => {

}

// TODO:supprime type formule
// supprime le type
const destroy = async () => {

}

module.exports = {
    create,
    modify,
    destroy
}