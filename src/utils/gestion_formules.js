const { Formules, Type_Formule, Prix_Unitaire, Recettes } = global.db

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
    // let infos = undefined
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
                
                    // infos = clientInformationObject(undefined, 'ok')
            }
            else {
                // infos = clientInformationObject(`Le nombre de pièces par personne pour la formule ${type_formule.Nom} est incorrect.`)
                throw `Le nombre de pièces par personne pour la formule ${type_formule.Nom} est incorrect.`
            }
        }
        else {
            // infos = clientInformationObject(`Le nombre de convives pour la formule ${type_formule.Nom} est insuffisant.`, undefined)
            throw `Le nombre de convives pour la formule ${type_formule.Nom} est insuffisant.`
        }
    }
    else {
        // infos = clientInformationObject('Le type de formule est invalide.', undefined)
        throw 'Le type de formule est invalide.'
    }

    // return {
    //     infos,
    //     type_formule
    // }
    return type_formule
}

// crée une formule apéritif lors d'une estimation
const createAperitif = async (postFormule) => {
    let formule = undefined
    let type_formule = undefined

    // vérifie si les paramètres sont valides
    type_formule = await checksFormule(postFormule)
    if(type_formule !== undefined) {
        let Prix_HT = 0     
        // récupération des prix 
        const prixSaléApéritif = await Prix_Unitaire.findOne({
            where : {
                Nom_Type_Prestation : 'Pièce salée'
            }
        })        
        if(prixSaléApéritif !== null) {
            const prixParPersonne = postFormule.Nb_Pieces_Salees * prixSaléApéritif.Montant
            Prix_HT = prixParPersonne * postFormule.Nb_Convives
        }

        // on a toutes les infos d'une formule provenant d'une estimation pour créer celle-ci
        formule = await Formules.create({
            Id_Type_Formule : type_formule.Id_Type_Formule,
            Nb_Convives : postFormule.Nb_Convives,
            Prix_HT,
            Nb_Pieces_Salees : postFormule.Nb_Pieces_Salees
        })
    }
        
    return formule
}

// crée une formule cocktail lors d'une estimation
const createCocktail = async (postFormule) => {
    // let infos = undefined
    let formule = undefined
    let type_formule = undefined

    // vérifie si les paramètres sont valides
    type_formule = await checksFormule(postFormule)
    if(type_formule !== undefined) {
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
        let prixSaléParPersonne = 0
        let prixsucréParPersonne = 0
        if(prixSaléCocktail !== null && prixSucré !== null) {
            prixSaléParPersonne = postFormule.Nb_Pieces_Salees * prixSaléCocktail.Montant
            prixsucréParPersonne = postFormule.Nb_Pieces_Sucrees * prixSucré.Montant
            Prix_HT = prixSaléParPersonne * postFormule.Nb_Convives + prixsucréParPersonne * postFormule.Nb_Convives
        }

        // on a toutes les infos d'une formule provenant d'une estimation pour créer celle-ci
        formule = await Formules.create({
            Id_Type_Formule : type_formule.Id_Type_Formule,
            Nb_Convives : postFormule.Nb_Convives,
            Prix_HT,
            Nb_Pieces_Salees : postFormule.Nb_Pieces_Salees,
            Nb_Pieces_Sucrees : postFormule.Nb_Pieces_Sucrees
        })
    }

    return formule
}

// crée une formule box lors d'une estimation
const createBox = async (postFormule) => {
    let formule = undefined
    let type_formule = undefined

    // vérifie si les paramètres sont valides
    type_formule = await checksFormule(postFormule)
    if(type_formule !== undefined) {
        let Prix_HT = 0     
        // récupération des prix 
        const prixBox = await Prix_Unitaire.findOne({
            where : {
                Nom_Type_Prestation : 'Box'
            }
        })   

        if(prixBox !== null) {
            Prix_HT = prixBox.Montant * postFormule.Nb_Convives
        }

        // on a toutes les infos d'une formule provenant d'une estimation pour créer celle-ci
        formule = await Formules.create({
            Id_Type_Formule : type_formule.Id_Type_Formule,
            Nb_Convives : postFormule.Nb_Convives,
            Prix_HT,
            Nb_Pieces_Salees : postFormule.Nb_Pieces_Salees,
            Nb_Pieces_Sucrees : postFormule.Nb_Pieces_Sucrees
        })
    }

    return formule
}

// crée une formule brunch lors d'une estimation
const createBrunch = async (postFormule) => {
    let formule = undefined
    let type_formule = undefined

    // vérifie si les paramètres sont valides
    type_formule = await checksFormule(postFormule)
    if(type_formule !== undefined) {
        let Prix_HT = 0     
        let Nb_Pieces_Salees = 0
        let Nb_Pieces_Sucrees = 0

        // vérification du/des types de brunchs souhaité
        let prixBrunchSaléParPersonne = 0
        let prixBrunchSucréParPersonne = 0
        if(postFormule.isBrunchSale) {
            Nb_Pieces_Salees = postFormule.Nb_Pieces_Salees
            // choix petite ou grande faim, si nb pièces = min alors petit sinon grand brunch
            let typePrestationSalée = postFormule.Nb_Pieces_Salees == tableCorrespondanceTypes[type_formule.Nom].nbPieces['salées'].min ? 'Petit ' : 'Grand '
            typePrestationSalée += 'brunch salé'
            // const prixBrunchSalé = prix_unitaire.find(prestation => prestation.Nom_Type_Prestation === typePrestationSalée)
            const prixBrunchSalé = await Prix_Unitaire.findOne({
                where : {
                    Nom_Type_Prestation : typePrestationSalée
                }
            })
            if(prixBrunchSalé !== null) {
                prixBrunchSaléParPersonne = prixBrunchSalé.Montant
            }
        }
        if(postFormule.isBrunchSucre) {
            Nb_Pieces_Sucrees = postFormule.Nb_Pieces_Sucrees
            // choix petite ou grande faim, si nb pièces = min alors petit sinon grand brunch
            let typePrestationSucrée = postFormule.Nb_Pieces_Sucrees == tableCorrespondanceTypes[type_formule.Nom].nbPieces['sucrées'].min ? 'Petit ' : 'Grand '
            typePrestationSucrée += 'brunch sucré'
            // const prixBrunchSucré = prix_unitaire.find(prestation => prestation.Nom_Type_Prestation === typePrestationSucrée)
            const prixBrunchSucré = await Prix_Unitaire.findOne({
                where: {
                    Nom_Type_Prestation : typePrestationSucrée
                }
            })
            if(prixBrunchSucré !== null) {
                prixBrunchSucréParPersonne = prixBrunchSucré.Montant
            }
        }
        
        Prix_HT = postFormule.Nb_Convives * (prixBrunchSaléParPersonne + prixBrunchSucréParPersonne)

        // on a toutes les infos d'une formule provenant d'une estimation pour créer celle-ci
        formule = await Formules.create({
            Id_Type_Formule : type_formule.Id_Type_Formule,
            Nb_Convives : postFormule.Nb_Convives,
            Prix_HT,
            Nb_Pieces_Salees : Nb_Pieces_Salees,
            Nb_Pieces_Sucrees : Nb_Pieces_Sucrees
        })
    }

    return formule
}


// crée les différentes formules
// initialise les valeurs par défaut et certains paramètres avant de créer la formule
// prend en paramètre les informations provenant de l'estimation pour savoir ce qui doit être créé
const createFormules = async (post) => {
    let Formule_Aperitif = null
    let Formule_Cocktail = null
    let Formule_Box = null
    let Formule_Brunch = null

    if(post.isAperitif) {
        // initialise les valeurs pour un apéritif
        const paramsAperitif = {
            Id_Type_Formule : 1,
            Nb_Convives : post.nbConvivesAperitif,
            Nb_Pieces_Salees : post.nbPiecesSaleesAperitif,
            Nb_Pieces_Sucrees : 0
        }
        // crée la formule apéritif     
        Formule_Aperitif = await createAperitif(paramsAperitif)
        if(Formule_Aperitif === undefined) Formule_Aperitif = null
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
        Formule_Cocktail = await createCocktail(paramsCocktail)
        if(Formule_Cocktail === undefined) Formule_Cocktail = null
    }
    if(post.isBox) {
        // initialise les valeurs pour une box
        const paramsBox = {
            Id_Type_Formule : 3,
            Nb_Convives : post.nbConvivesBox,
            Nb_Pieces_Salees : tableCorrespondanceTypes['Box'].nbPieces['salées'].min,
            Nb_Pieces_Sucrees : tableCorrespondanceTypes['Box'].nbPieces['sucrées'].min
        }   
        // crée la formule box
        Formule_Box = await createBox(paramsBox)
        if(Formule_Box === undefined) Formule_Box = null
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
        Formule_Brunch = await createBrunch(paramsBrunch)
        if(Formule_Brunch === undefined) Formule_Brunch = null
    }

    return {
        Formule_Aperitif,
        Formule_Cocktail,
        Formule_Box,
        Formule_Brunch
    }
}

// TODO:
const modifyFormule = async (oldFormule, newFormule) => {
    // let infos = undefined
    let formule = undefined
    
    // s'il n'existait pas de formule on en crée une
    if(oldFormule === null) {
        const params = {
            Nb_Convives : newFormule.Nb_Convives            
        }
        if(newFormule.isAperitif) {
            // initialise les valeurs pour un apéritif
            params.Id_Type_Formule = 1
            params.Nb_Pieces_Salees = newFormule.Nb_Pieces_Salees
            params.Nb_Pieces_Sucrees = 0

            // const createRes = await createAperitif(params)
            // infos = createRes.infos
            // if(createRes.formule !== undefined) {
            //     formule = createRes.formule
            // }
            formule = await createAperitif(params)
        }
        if(newFormule.isCocktail) {
            // initialise les valeurs pour un cocktail
            params.Id_Type_Formule = 2
            params.Nb_Pieces_Salees = newFormule.Nb_Pieces_Salees
            params.Nb_Pieces_Sucrees = newFormule.Nb_Pieces_Sucrees

            // const createRes = await createCocktail(params)
            // infos = createRes.infos
            // if(createRes.formule !== undefined) {
            //     formule = createRes.formule
            // }
            formule = await createCocktail(params)
        }
        if(newFormule.isBox) {
            // initialise les valeurs pour une box
            params.Id_Type_Formule = 3
            params.Nb_Pieces_Salees = tableCorrespondanceTypes['Box'].nbPieces['salées'].min
            params.Nb_Pieces_Sucrees = tableCorrespondanceTypes['Box'].nbPieces['sucrées'].min

            // const createRes = await createBox(params)
            // infos = createRes.infos
            // if(createRes.formule !== undefined) {
            //     formule = createRes.formule
            // }
            formule = await createBox(params)
        }
        if(newFormule.isBrunch) {
            // initialise les valeurs pour un brunch
            params.Id_Type_Formule = 4
            if(!newFormule.isBrunchSale && !newFormule.isBrunchSucre) {
                // infos = clientInformationObject('Un type de brunch doit être sélectionné.')
                throw 'Un type de brunch doit être sélectionné.'
            }
            else {
                // dans le cas où le brunch salé n'est pas choisi, on initilise avec la valeur min pour passer les tests
                params.Nb_Pieces_Salees = newFormule.Nb_Pieces_Salees > 0 ? newFormule.Nb_Pieces_Salees : tableCorrespondanceTypes['Brunch'].nbPieces['salées'].min
                // dans le cas où le brunch sucré n'est pas choisi, on initilise avec la valeur min pour passer les tests
                params.Nb_Pieces_Sucrees = newFormule.Nb_Pieces_Sucrees > 0 ? newFormule.Nb_Pieces_Sucrees : tableCorrespondanceTypes['Brunch'].nbPieces['sucrées'].min
                params.isBrunchSale = newFormule.isBrunchSale
                params.isBrunchSucre = newFormule.isBrunchSucre

                // const createRes = await createBrunch(params)
                // infos = createRes.infos
                // if(createRes.formule !== undefined) {
                //     formule = createRes.formule
                // }
                formule = await createBrunch(params)
            }
        }
    }
    else {
        formule = oldFormule
        // affectation des nouvelles infos présentent lors de la création à l'ancienne formule
        formule.Nb_Convives = newFormule.Nb_Convives

        if(newFormule.isBrunch && !newFormule.isBrunchSale && !newFormule.isBrunchSucre) {
            // infos = clientInformationObject('Un type de brunch doit être sélectionné.')
            throw 'Un type de brunch doit être sélectionné.'
        }

        if(newFormule.isAperitif) {
            formule.Nb_Pieces_Salees = newFormule.Nb_Pieces_Salees
            formule.Nb_Pieces_Sucrees = 0
        }
        else if(newFormule.isBox) {
            formule.Nb_Pieces_Salees = tableCorrespondanceTypes['Box'].nbPieces['salées'].min
            formule.Nb_Pieces_Sucrees = tableCorrespondanceTypes['Box'].nbPieces['sucrées'].min
        }
        else {
            formule.Nb_Pieces_Salees = newFormule.Nb_Pieces_Salees
            formule.Nb_Pieces_Sucrees = newFormule.Nb_Pieces_Sucrees         
        }

        // on vérifie les modifs apportées
        await checksFormule(formule)            
    }

    // s'il n'y a pas d'erreur
    // FIXME:Modification du prix
    let Prix_HT = 0     
    if(newFormule.isAperitif) {
        // récupération des prix 
        const prixSaléApéritif = await Prix_Unitaire.findOne({
            where : {
                Nom_Type_Prestation : 'Pièce salée'
            }
        })        
        if(prixSaléApéritif !== null) {
            const prixParPersonne = newFormule.Nb_Pieces_Salees * prixSaléApéritif.Montant
            Prix_HT = prixParPersonne * newFormule.Nb_Convives
        }
    }
    if(newFormule.isCocktail) {
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
        let prixSaléParPersonne = 0
        let prixsucréParPersonne = 0
        if(prixSaléCocktail !== null && prixSucré !== null) {
            prixSaléParPersonne = newFormule.Nb_Pieces_Salees * prixSaléCocktail.Montant
            prixsucréParPersonne = newFormule.Nb_Pieces_Sucrees * prixSucré.Montant
            Prix_HT = prixSaléParPersonne * newFormule.Nb_Convives + prixsucréParPersonne * newFormule.Nb_Convives
        }
    }
    if(newFormule.isBox) {
        // récupération des prix 
        const prixBox = await Prix_Unitaire.findOne({
            where : {
                Nom_Type_Prestation : 'Box'
            }
        })   
        if(prixBox !== null) {
            Prix_HT = prixBox.Montant * newFormule.Nb_Convives
        }
    }
    if(newFormule.isBrunch) {
        let Nb_Pieces_Salees = 0
        let Nb_Pieces_Sucrees = 0

        // vérification du/des types de brunchs souhaité
        let prixBrunchSaléParPersonne = 0
        let prixBrunchSucréParPersonne = 0
        if(newFormule.isBrunchSale) {
            Nb_Pieces_Salees = newFormule.Nb_Pieces_Salees
            // choix petite ou grande faim, si nb pièces = min alors petit sinon grand brunch
            let typePrestationSalée = newFormule.Nb_Pieces_Salees == tableCorrespondanceTypes['Brunch'].nbPieces['salées'].min ? 'Petit ' : 'Grand '
            typePrestationSalée += 'brunch salé'
            // const prixBrunchSalé = prix_unitaire.find(prestation => prestation.Nom_Type_Prestation === typePrestationSalée)
            const prixBrunchSalé = await Prix_Unitaire.findOne({
                where : {
                    Nom_Type_Prestation : typePrestationSalée
                }
            })
            if(prixBrunchSalé !== null) {
                prixBrunchSaléParPersonne = prixBrunchSalé.Montant
            }
        }
        if(newFormule.isBrunchSucre) {
            Nb_Pieces_Sucrees = newFormule.Nb_Pieces_Sucrees
            // choix petite ou grande faim, si nb pièces = min alors petit sinon grand brunch
            let typePrestationSucrée = newFormule.Nb_Pieces_Sucrees == tableCorrespondanceTypes['Brunch'].nbPieces['sucrées'].min ? 'Petit ' : 'Grand '
            typePrestationSucrée += 'brunch sucré'
            // const prixBrunchSucré = prix_unitaire.find(prestation => prestation.Nom_Type_Prestation === typePrestationSucrée)
            const prixBrunchSucré = await Prix_Unitaire.findOne({
                where: {
                    Nom_Type_Prestation : typePrestationSucrée
                }
            })
            if(prixBrunchSucré !== null) {
                prixBrunchSucréParPersonne = prixBrunchSucré.Montant
            }
        }
        
        Prix_HT = newFormule.Nb_Convives * (prixBrunchSaléParPersonne + prixBrunchSucréParPersonne)
        formule.Nb_Pieces_Salees = Nb_Pieces_Salees
        formule.Nb_Pieces_Sucrees = Nb_Pieces_Sucrees
    }
    // affectation du prix
    formule.Prix_HT = Prix_HT

    // affectation des recettes
    formule.Liste_Id_Recettes_Salees = newFormule.Liste_Id_Recettes_Salees
    formule.Liste_Id_Recettes_Sucrees = newFormule.Liste_Id_Recettes_Sucrees
    formule.Liste_Id_Recettes_Boissons = newFormule.Liste_Id_Recettes_Boissons

    // vérification de l'existence des recettes
    if(formule.Liste_Id_Recettes_Salees !== null && formule.Liste_Id_Recettes_Salees !== '') {
        formule.Liste_Id_Recettes_Salees = await checksListeRecettes(formule.Liste_Id_Recettes_Salees)
    }
    if(formule.Liste_Id_Recettes_Sucrees !== null && formule.Liste_Id_Recettes_Sucrees !== '') {
        formule.Liste_Id_Recettes_Sucrees = await checksListeRecettes(formule.Liste_Id_Recettes_Sucrees)
    }
    if(formule.Liste_Id_Recettes_Boissons !== null && formule.Liste_Id_Recettes_Boissons !== '') {
        formule.Liste_Id_Recettes_Boissons = await checksListeRecettes(formule.Liste_Id_Recettes_Boissons)
    }

    await formule.save()
    
    return formule
}

const checksListeRecettes = async (listeRecettes) => {
    // on vérifie que la liste soit bien une string non vide
    if(typeof listeRecettes !== "string" || listeRecettes === '') return null

    // utiliser une liste de retour permet de sanitizer les données
    let returnedList = ''

    const tabRecettes = listeRecettes.split(';')
    for(const idRecette of tabRecettes) {
        if(idRecette !== '') {
            const recette = await Recettes.findOne({
                where: {
                    Id_Recette : idRecette
                }
            })
            if(recette === null) return null
            returnedList += `${idRecette};`
        }
    }

    // si tout s'est bien passé, la liste est ok
    return returnedList
}

module.exports = {
    tableCorrespondanceTypes,
    checksFormule,
    createAperitif,
    createCocktail,
    createBox,
    createBrunch,
    createFormules,
    modifyFormule,
    checksListeRecettes
}