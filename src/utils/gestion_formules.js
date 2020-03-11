const { Formules, Type_Formule, Prix_Unitaire } = global.db
const errorHandler = require('../utils/errorHandler')

const tableCorrespondanceTypes = {
    'Apéritif' : {
        nbMinConvives : 6,
        nbPieces : {
            'salées' : {
                min : 4,
                max : 16
            },
            'sucrées' : {
                min : 0,
                max : 0
            }
        }
    },
    'Cocktail' : {
        nbMinConvives : 6,
        nbPieces : {
            'salées' : {
                min : 8,
                max : 16
            },
            'sucrées' : {
                min : 1,
                max : 5
            }
        }
    },
    'Box' : {
        nbMinConvives : 6,
        nbPieces : {
            'salées' : {
                min : 3,
                max : 3
            },
            'sucrées' : {
                min : 1,
                max : 1
            }
        }
    },
    'Brunch' : {
        nbMinConvives : 15,
        nbPieces : {
            'salées' : {
                min : 4,
                max : 8
            },
            'sucrées' : {
                min : 2,
                max : 4
            }
        }
    }
}

// crée une formule pour une estimation
// voir pour découpage en plusieurs fonction selon le type de formule
const create = async (postFormule) => {
    let infos = undefined
    let formule = undefined

    // contrôle pour la clause where
    postFormule.Id_Type_Formule = postFormule.Id_Type_Formule === undefined ? '' : postFormule.Id_Type_Formule

    // récupération du type de formule
    const type_formule = await Type_Formule.findOne({
        where : {
            Id_Type_Formule : postFormule.Id_Type_Formule
        }
    })

    // type de formule existant
    if(type_formule !== null) {
        // vérification du nombre de convives selon le type de formule
        if(postFormule.Nb_Convives >= tableCorrespondanceTypes[type_formule.Nom].nbMinConvives) {
            // init à zéro si undefined
            postFormule.Nb_Pieces_Salees = postFormule.Nb_Pieces_Salees === undefined ? 0 : postFormule.Nb_Pieces_Salees
            postFormule.Nb_Pieces_Sucrees = postFormule.Nb_Pieces_Sucrees === undefined ? 0 : postFormule.Nb_Pieces_Sucrees
            // vérification que le nombre de pièces salées et sucrées soient entre le min et le max
            if(
                (postFormule.Nb_Pieces_Salees >= tableCorrespondanceTypes[type_formule.Nom].nbPieces['salées'].min && postFormule.Nb_Pieces_Salees <= tableCorrespondanceTypes[type_formule.Nom].nbPieces['salées'].max) 
                    && 
                (postFormule.Nb_Pieces_Sucrees >= tableCorrespondanceTypes[type_formule.Nom].nbPieces['sucrées'].min && postFormule.Nb_Pieces_Sucrees <= tableCorrespondanceTypes[type_formule.Nom].nbPieces['sucrées'].max)
                ) {
                let Prix_HT = 0     
                // récupération des prix 
                const prix_unitaire = await Prix_Unitaire.findAll({
                    where : {
                        isOption : false
                    }
                })          
                // calcul du prix HT en fonction du type de formule
                switch(type_formule.Nom) {
                    case 'Apéritif' :
                        const prixSaléApéritif = prix_unitaire.find(prestation => prestation.Nom_Type_Prestation === 'Pièce salée')
                        const prixParPersonne = postFormule.Nb_Pieces_Salees * prixSaléApéritif.Montant

                        Prix_HT = prixParPersonne * postFormule.Nb_Convives
                        break;
                    case 'Cocktail' :                        
                        const prixSaléCocktail = prix_unitaire.find(prestation => prestation.Nom_Type_Prestation === 'Pièce salée')
                        const prixSaléParPersonne = postFormule.Nb_Pieces_Salees * prixSaléCocktail.Montant
                        const prixSucré = prix_unitaire.find(prestation => prestation.Nom_Type_Prestation === 'Pièce sucrée')
                        const prixsucréParPersonne = postFormule.Nb_Pieces_Sucrees * prixSucré.Montant

                        Prix_HT = prixSaléParPersonne * postFormule.Nb_Convives + prixsucréParPersonne * postFormule.Nb_Convives
                        break;
                    case 'Box' :
                        const prixBox = prix_unitaire.find(prestation => prestation.Nom_Type_Prestation === 'Box')
                        Prix_HT = prixBox.Montant * postFormule.Nb_Convives
                        break;
                    case 'Brunch' :
                        // choix petite ou grande faim, si nb pièces = min alors petit sinon grand brunch
                        let typePrestationSalée = postFormule.Nb_Pieces_Salees == tableCorrespondanceTypes[type_formule.Nom].nbPieces['salées'].min ? 'Petit ' : 'Grand '
                        typePrestationSalée += 'brunch salé'
                        let typePrestationSucrée = postFormule.Nb_Pieces_Sucrees == tableCorrespondanceTypes[type_formule.Nom].nbPieces['sucrées'].min ? 'Petit ' : 'Grand '
                        typePrestationSucrée += 'brunch sucré'

                        const prixBrunchSalé = prix_unitaire.find(prestation => prestation.Nom_Type_Prestation === typePrestationSalée)
                        const prixBrunchSaléParPersonne = prixBrunchSalé.Montant * postFormule.Nb_Convives
                        const prixBrunchSucré = prix_unitaire.find(prestation => prestation.Nom_Type_Prestation === typePrestationSucrée)
                        const prixBrunchSucréParPersonne = prixBrunchSucré.Montant * postFormule.Nb_Convives
                        
                        Prix_HT = prixBrunchSaléParPersonne + prixBrunchSucréParPersonne
                        break;
                }

                // on a toutes les infos d'une formule provenant d'une estimation pour créer celle-ci
                try {
                    formule = await Formules.create({
                        Id_Type_Formule : type_formule.Id_Type_Formule,
                        Nb_Convives : postFormule.Nb_Convives,
                        Prix_HT,
                        Nb_Pieces_Salees : postFormule.Nb_Pieces_Salees,
                        Nb_Pieces_Sucrees : postFormule.Nb_Pieces_Sucrees
                    })
                }
                catch(error) {
                    infos = errorHandler(error.errors[0].message, undefined)
                }
            }
            else {
                infos = errorHandler(`Le nombre de pièces par personne pour la formule ${type_formule.Nom} est incorrect.`)
            }
        }
        else {
            infos = errorHandler(`Le nombre de convives pour la formule ${type_formule.Nom} est insuffisant.`, undefined)
        }
    }
    else {
        infos = errorHandler('Le type de formule est invalide.', undefined)
    }

    return {
        infos,
        formule
    }
}

// TODO
const modify = async (postFormule) => {

}

module.exports = {
    create,
    modify
}