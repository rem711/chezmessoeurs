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

// fait les vérification avant de vouloir créer une formule
// renvoie les infos et le type de formule s'il existe
const checksFormule = async (postFormule) => {
    let infos = undefined
    let type_formule = undefined

    // contrôle pour la clause where
    postFormule.Id_Type_Formule = postFormule.Id_Type_Formule === undefined ? '' : postFormule.Id_Type_Formule

    // récupération du type de formule
    type_formule = await Type_Formule.findOne({
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
                
                    infos = errorHandler(undefined, 'ok')
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
        type_formule
    }
}

// crée une formule apéritif lors d'une estimation
const createAperitif = async (postFormule) => {
    let infos = undefined
    let formule = undefined
    let type_formule = undefined

    // vérifie si les paramètres sont valides
    const checks = await checksFormule(postFormule)
    infos = checks.infos
    if(infos.message === 'ok') {
        type_formule = checks.type_formule

        let Prix_HT = 0     
        // récupération des prix 
        const prixSaléApéritif = await Prix_Unitaire.findOne({
            where : {
                Nom_Type_Prestation : 'Pièce salée'
            }
        })         
        const prixParPersonne = postFormule.Nb_Pieces_Salees * prixSaléApéritif.Montant

        Prix_HT = prixParPersonne * postFormule.Nb_Convives

        // on a toutes les infos d'une formule provenant d'une estimation pour créer celle-ci
        try {
            formule = await Formules.create({
                Id_Type_Formule : type_formule.Id_Type_Formule,
                Nb_Convives : postFormule.Nb_Convives,
                Prix_HT,
                Nb_Pieces_Salees : postFormule.Nb_Pieces_Salees
            })
        }
        catch(error) {
            infos = errorHandler(error.errors[0].message, undefined)
        }
    }

    return {
        infos, 
        formule
    }
}

// crée une formule cocktail lors d'une estimation
const createCocktail = async (postFormule) => {
    let infos = undefined
    let formule = undefined
    let type_formule = undefined

    // vérifie si les paramètres sont valides
    const checks = await checksFormule(postFormule)
    infos = checks.infos
    if(infos.message === 'ok') {
        type_formule = checks.type_formule

        let Prix_HT = 0     
        // récupération des prix 
        const prixSaléCocktail = await Prix_Unitaire.findOne({
            where : {
                Nom_Type_Prestation : 'Pièce salée'
            }
        })   
        const prixSucré = await Prix_Unitaire.findOne({
            where : {
                Nom_Type_Prestation : 'Pièce sucrée'
            }
        })   

        const prixSaléParPersonne = postFormule.Nb_Pieces_Salees * prixSaléCocktail.Montant
        const prixsucréParPersonne = postFormule.Nb_Pieces_Sucrees * prixSucré.Montant

        Prix_HT = prixSaléParPersonne * postFormule.Nb_Convives + prixsucréParPersonne * postFormule.Nb_Convives

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

    return {
        infos, 
        formule
    }
}

// crée une formule box lors d'une estimation
const createBox = async (postFormule) => {
    let infos = undefined
    let formule = undefined
    let type_formule = undefined

    // vérifie si les paramètres sont valides
    const checks = await checksFormule(postFormule)
    infos = checks.infos
    if(infos.message === 'ok') {
        type_formule = checks.type_formule

        let Prix_HT = 0     
        // récupération des prix 
        const prixBox = await Prix_Unitaire.findOne({
            where : {
                Nom_Type_Prestation : 'Box'
            }
        })   

        Prix_HT = prixBox.Montant * postFormule.Nb_Convives

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

    return {
        infos, 
        formule
    }
}

// crée une formule brunch lors d'une estimation
const createBrunch = async (postFormule) => {
    let infos = undefined
    let formule = undefined
    let type_formule = undefined

    // vérifie si les paramètres sont valides
    const checks = await checksFormule(postFormule)
    infos = checks.infos
    if(infos.message === 'ok') {
        type_formule = checks.type_formule

        let Prix_HT = 0     

        // vérification du/des types de brunchs souhaité
        let prixBrunchSaléParPersonne = 0
        let prixBrunchSucréParPersonne = 0
        if(postFormule.isBrunchSale) {
            // choix petite ou grande faim, si nb pièces = min alors petit sinon grand brunch
            let typePrestationSalée = postFormule.Nb_Pieces_Salees == tableCorrespondanceTypes[type_formule.Nom].nbPieces['salées'].min ? 'Petit ' : 'Grand '
            typePrestationSalée += 'brunch salé'
            // const prixBrunchSalé = prix_unitaire.find(prestation => prestation.Nom_Type_Prestation === typePrestationSalée)
            const prixBrunchSalé = await Prix_Unitaire.findOne({
                where : {
                    Nom_Type_Prestation : typePrestationSalée
                }
            })
            prixBrunchSaléParPersonne = prixBrunchSalé.Montant * postFormule.Nb_Convives
        }
        if(postFormule.isBrunchSucre) {
            // choix petite ou grande faim, si nb pièces = min alors petit sinon grand brunch
            let typePrestationSucrée = postFormule.Nb_Pieces_Sucrees == tableCorrespondanceTypes[type_formule.Nom].nbPieces['sucrées'].min ? 'Petit ' : 'Grand '
            typePrestationSucrée += 'brunch sucré'
            // const prixBrunchSucré = prix_unitaire.find(prestation => prestation.Nom_Type_Prestation === typePrestationSucrée)
            const prixBrunchSucré = await Prix_Unitaire.findOne({
                where: {
                    Nom_Type_Prestation : typePrestationSucrée
                }
            })
            prixBrunchSucréParPersonne = prixBrunchSucré.Montant * postFormule.Nb_Convives
        }
        
        Prix_HT = prixBrunchSaléParPersonne + prixBrunchSucréParPersonne

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

    return {
        infos, 
        formule
    }
}


// crée les différentes formules
// initialise les valeurs par défaut et certains paramètres avant de créer la formule
// prend en paramètre les informations provenant de l'estimation pour savoir ce qui doit être créé
const createFormules = async (post) => {
    let infos = undefined
    
    let idFormuleAperitif = null
    let idFormuleCocktail = null
    let idFormuleBox = null
    let idFormuleBrunch = null

    if(post.isAperitif) {
        // initialise les valeurs pour un apéritif
        const paramsAperitif = {
            Id_Type_Formule : 1,
            Nb_Convives : post.nbConvivesAperitif,
            Nb_Pieces_Salees : post.nbPiecesSaleesAperitif,
            Nb_Pieces_Sucrees : 0
        }
        // crée la formule apéritif
        const aperitif = await createAperitif(paramsAperitif)
        infos = aperitif.infos
        if(aperitif.formule !== undefined) {
            idFormuleAperitif = aperitif.formule.Id_Formule
        }        
    }
    if(post.isCocktail) {
        // initialise les valeurs pour un cocktail
        const paramsCocktail = {
            Id_Type_Formule : 2,
            Nb_Convives : post.nbConvivesCocktail,
            Nb_Pieces_Salees : post.nbPiecesSaleesCocktail,
            Nb_Pieces_Sucrees : post.nbPiecesSucreesCocktail
        }
        // crée la formule cocktail
        const cocktail = await createCocktail(paramsCocktail)
        infos = cocktail.infos
        if(cocktail.formule !== undefined) {
            idFormuleCocktail = cocktail.formule.Id_Formule
        }
    }
    if(post.isBox) {
        // initialise les valeurs pour une box
        const paramsBox = {
            Id_Type_Formule : 3,
            Nb_Convives : post.nbConvivesBox,
            Nb_Pieces_Salees : tableCorrespondanceTypes['Box'].nbPieces['salées'].min,
            Nb_Pieces_Sucrees : tableCorrespondanceTypes['Box'].nbPieces['sucrées'].min
        }   
        //crée la formule box
        const box = await createBox(paramsBox)
        infos = box.infos
        if(box.formule !== undefined) {
            idFormuleBox = box.formule.Id_Formule
        }
    }
    if(post.isBrunch) {
        // init pièces salées
        let Nb_Pieces_Salees = 0
        if(post.typeBrunchSale === undefined || post.typeBrunchSale === 'Petite Faim') {
            Nb_Pieces_Salees = tableCorrespondanceTypes['Brunch'].nbPieces['salées'].min
        }
        if(post.typeBrunchSale === 'Grande Faim') {
            Nb_Pieces_Salees = tableCorrespondanceTypes['Brunch'].nbPieces['salées'].max
        }   

        // init pièces sucrées
        let Nb_Pieces_Sucrees = 0
        if(post.typeBrunchSucre === undefined || post.typeBrunchSucre === 'Petite Faim') {
            Nb_Pieces_Sucrees = tableCorrespondanceTypes['Brunch'].nbPieces['sucrées'].min
        }
        if(post.typeBrunchSucre === 'Grande Faim') {
            Nb_Pieces_Sucrees = tableCorrespondanceTypes['Brunch'].nbPieces['sucrées'].max
        } 

        // initialise les valeurs pour un brunch
        const paramsBrunch = {
            Id_Type_Formule : 4,
            Nb_Convives : post.nbConvivesBrunch,
            Nb_Pieces_Salees,
            Nb_Pieces_Sucrees,
            isBrunchSale : post.isBrunchSale,
            isBrunchSucre : post.isBrunchSucre
        }
        // crée la formule brunch
        const brunch = await createBrunch(paramsBrunch)
        infos = brunch.infos
        if(brunch.formule !== undefined) {
            idFormuleBrunch = brunch.formule.Id_Formule
        }
    }

    return {
        infos,
        idFormuleAperitif,
        idFormuleCocktail,
        idFormuleBox,
        idFormuleBrunch
    }
}

// crée une formule pour une estimation
// voir pour découpage en plusieurs fonction selon le type de formule
// const create = async (postFormule) => {
//     let infos = undefined
//     let formule = undefined

//     // contrôle pour la clause where
//     postFormule.Id_Type_Formule = postFormule.Id_Type_Formule === undefined ? '' : postFormule.Id_Type_Formule

//     // récupération du type de formule
//     const type_formule = await Type_Formule.findOne({
//         where : {
//             Id_Type_Formule : postFormule.Id_Type_Formule
//         }
//     })

//     // type de formule existant
//     if(type_formule !== null) {
//         // vérification du nombre de convives selon le type de formule
//         if(postFormule.Nb_Convives >= tableCorrespondanceTypes[type_formule.Nom].nbMinConvives) {
//             // init à zéro si undefined
//             postFormule.Nb_Pieces_Salees = postFormule.Nb_Pieces_Salees === undefined ? 0 : postFormule.Nb_Pieces_Salees
//             postFormule.Nb_Pieces_Sucrees = postFormule.Nb_Pieces_Sucrees === undefined ? 0 : postFormule.Nb_Pieces_Sucrees
//             // vérification que le nombre de pièces salées et sucrées soient entre le min et le max
//             if(
//                 (postFormule.Nb_Pieces_Salees >= tableCorrespondanceTypes[type_formule.Nom].nbPieces['salées'].min && postFormule.Nb_Pieces_Salees <= tableCorrespondanceTypes[type_formule.Nom].nbPieces['salées'].max) 
//                     && 
//                 (postFormule.Nb_Pieces_Sucrees >= tableCorrespondanceTypes[type_formule.Nom].nbPieces['sucrées'].min && postFormule.Nb_Pieces_Sucrees <= tableCorrespondanceTypes[type_formule.Nom].nbPieces['sucrées'].max)
//                 ) {
//                 let Prix_HT = 0     
//                 // récupération des prix 
//                 const prix_unitaire = await Prix_Unitaire.findAll({
//                     where : {
//                         isOption : false
//                     }
//                 })          
//                 // calcul du prix HT en fonction du type de formule
//                 switch(type_formule.Nom) {
//                     case 'Apéritif' :
//                         const prixSaléApéritif = prix_unitaire.find(prestation => prestation.Nom_Type_Prestation === 'Pièce salée')
//                         const prixParPersonne = postFormule.Nb_Pieces_Salees * prixSaléApéritif.Montant

//                         Prix_HT = prixParPersonne * postFormule.Nb_Convives
//                         break;
//                     case 'Cocktail' :                        
//                         const prixSaléCocktail = prix_unitaire.find(prestation => prestation.Nom_Type_Prestation === 'Pièce salée')
//                         const prixSaléParPersonne = postFormule.Nb_Pieces_Salees * prixSaléCocktail.Montant
//                         const prixSucré = prix_unitaire.find(prestation => prestation.Nom_Type_Prestation === 'Pièce sucrée')
//                         const prixsucréParPersonne = postFormule.Nb_Pieces_Sucrees * prixSucré.Montant

//                         Prix_HT = prixSaléParPersonne * postFormule.Nb_Convives + prixsucréParPersonne * postFormule.Nb_Convives
//                         break;
//                     case 'Box' :
//                         const prixBox = prix_unitaire.find(prestation => prestation.Nom_Type_Prestation === 'Box')
//                         Prix_HT = prixBox.Montant * postFormule.Nb_Convives
//                         break;
//                     case 'Brunch' :
//                         // choix petite ou grande faim, si nb pièces = min alors petit sinon grand brunch
//                         let typePrestationSalée = postFormule.Nb_Pieces_Salees == tableCorrespondanceTypes[type_formule.Nom].nbPieces['salées'].min ? 'Petit ' : 'Grand '
//                         typePrestationSalée += 'brunch salé'
//                         let typePrestationSucrée = postFormule.Nb_Pieces_Sucrees == tableCorrespondanceTypes[type_formule.Nom].nbPieces['sucrées'].min ? 'Petit ' : 'Grand '
//                         typePrestationSucrée += 'brunch sucré'

//                         const prixBrunchSalé = prix_unitaire.find(prestation => prestation.Nom_Type_Prestation === typePrestationSalée)
//                         const prixBrunchSaléParPersonne = prixBrunchSalé.Montant * postFormule.Nb_Convives
//                         const prixBrunchSucré = prix_unitaire.find(prestation => prestation.Nom_Type_Prestation === typePrestationSucrée)
//                         const prixBrunchSucréParPersonne = prixBrunchSucré.Montant * postFormule.Nb_Convives
                        
//                         Prix_HT = prixBrunchSaléParPersonne + prixBrunchSucréParPersonne
//                         break;
//                 }

//                 // on a toutes les infos d'une formule provenant d'une estimation pour créer celle-ci
//                 try {
//                     formule = await Formules.create({
//                         Id_Type_Formule : type_formule.Id_Type_Formule,
//                         Nb_Convives : postFormule.Nb_Convives,
//                         Prix_HT,
//                         Nb_Pieces_Salees : postFormule.Nb_Pieces_Salees,
//                         Nb_Pieces_Sucrees : postFormule.Nb_Pieces_Sucrees
//                     })
//                 }
//                 catch(error) {
//                     infos = errorHandler(error.errors[0].message, undefined)
//                 }
//             }
//             else {
//                 infos = errorHandler(`Le nombre de pièces par personne pour la formule ${type_formule.Nom} est incorrect.`)
//             }
//         }
//         else {
//             infos = errorHandler(`Le nombre de convives pour la formule ${type_formule.Nom} est insuffisant.`, undefined)
//         }
//     }
//     else {
//         infos = errorHandler('Le type de formule est invalide.', undefined)
//     }

//     return {
//         infos,
//         formule
//     }
// }

// TODO
const modify = async (postFormule) => {

}

module.exports = {
    createFormules,
    modify
}