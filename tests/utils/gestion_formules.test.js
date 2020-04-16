/* global test, expect */
require('../../src/app')
const { Type_Formule } = global.db
const { checksFormule, createAperitif, createCocktail, createBox, createBrunch, createFormules, modifyFormule, checksListeRecettes } = require('../../src/utils/gestion_formules')

test("Doit vérifier que la Formule Aperitif est correcte", async () => {
    const formule = {
        Id_Type_Formule : 1,
        Nb_Convives : 8,
        Nb_Pieces_Salees : 5,
        Nb_Pieces_Sucrees : 0
    }

    const type_formule = await Type_Formule.findOne({
        where : {
            Id_Type_Formule : 1
        }
    })

    // cas de base
    let res = await checksFormule(formule)
    expect(res).toEqual(type_formule)

    // cas sans toutes les valeurs initialisées
    formule.Nb_Pieces_Sucrees = undefined
    res = await checksFormule(formule)
    expect(res).toEqual(type_formule)
})

test("Doit vérifier que la Formule Aperitif est incorrect", async () => {
    const formule = {
        Id_Type_Formule : 5,
        Nb_Convives : 3,
        Nb_Pieces_Salees : 3,
        Nb_Pieces_Sucrees : 0
    }

    const type_formule = await Type_Formule.findOne({
        where : {
            Id_Type_Formule : 1
        }
    })

    expect.assertions(3)

    // erreur de l'Id_Type_Formule    
    try {
        await checksFormule(formule)
    }
    catch(e) {
        expect(e).toMatch('Le type de formule est invalide.')
    }

    formule.Id_Type_Formule = 1

    // erreur du Nb_Convives
    try {
        await checksFormule(formule)
    }
    catch(e) {
        expect(e).toMatch(`Le nombre de convives pour la formule ${type_formule.Nom} est insuffisant.`)
    }

    formule.Nb_Convives = 8

    // erreur du Nb_Pieces_Salees
    try {
        await checksFormule(formule)
    }
    catch(e) {
        expect(e).toMatch(`Le nombre de pièces par personne pour la formule ${type_formule.Nom} est incorrect.`)
    }
})

test('Doit créer la Formule Aperitif', async () => {
    const formule = {
        Id_Type_Formule : 1,
        Nb_Convives : 8,
        Prix_HT : 64.0,
        Nb_Pieces_Salees : 5,
        Nb_Pieces_Sucrees : 0,
        Nb_Boissons : 0
    }

    const formuleRes = await createAperitif(formule)
    formule.Id_Formule = formuleRes.Id_Formule

    expect(JSON.parse(JSON.stringify(formuleRes))).toEqual(formule)

    await formuleRes.destroy()
})

test('Ne doit pas créer la Formule Aperitif', async () => {
    const formule = {
        Id_Type_Formule : 6,
        Nb_Convives : 8,
        Prix_HT : 64.0,
        Nb_Pieces_Salees : 5,
        Nb_Pieces_Sucrees : 0,
        Nb_Boissons : 0
    }

    expect.assertions(1)
    try {
        await createAperitif(formule)
    }
    catch(e) {
        expect(e).toMatch('Le type de formule est invalide.')
    }
})

test("Doit vérifier que la Formule Cocktail est correcte", async () => {
    const formule = {
        Id_Type_Formule : 2,
        Nb_Convives : 8,
        Nb_Pieces_Salees : 10,
        Nb_Pieces_Sucrees : 2
    }

    const type_formule = await Type_Formule.findOne({
        where : {
            Id_Type_Formule : 2
        }
    })

    // cas de base
    const res = await checksFormule(formule)
    expect(res).toEqual(type_formule)
})

test("Doit vérifier que la Formule Cocktail est incorrect", async () => {
    const formule = {
        Id_Type_Formule : 5,
        Nb_Convives : 5,
        Nb_Pieces_Salees : 6,
        Nb_Pieces_Sucrees : 0
    }

    const type_formule = await Type_Formule.findOne({
        where : {
            Id_Type_Formule : 2
        }
    })

    expect.assertions(4)

    // erreur de l'Id_Type_Formule    
    try {
        await checksFormule(formule)
    }
    catch(e) {
        expect(e).toMatch('Le type de formule est invalide.')
    }

    formule.Id_Type_Formule = 2

    // erreur du Nb_Convives
    try {
        await checksFormule(formule)
    }
    catch(e) {
        expect(e).toMatch(`Le nombre de convives pour la formule ${type_formule.Nom} est insuffisant.`)
    }

    formule.Nb_Convives = 8

    // erreur du Nb_Pieces_Salees
    try {
        await checksFormule(formule)
    }
    catch(e) {
        expect(e).toMatch(`Le nombre de pièces par personne pour la formule ${type_formule.Nom} est incorrect.`)
    }

    formule.Nb_Pieces_Salees = 10

    // erreur du Nb_Pieces_Sucrees
    try {
        await checksFormule(formule)
    }
    catch(e) {
        expect(e).toMatch(`Le nombre de pièces par personne pour la formule ${type_formule.Nom} est incorrect.`)
    }
})

test('Doit créer la Formule Cocktail', async () => {
    const formule = {
        Id_Type_Formule : 2,
        Nb_Convives : 8,
        Prix_HT : 151.2,
        Nb_Pieces_Salees : 10,
        Nb_Pieces_Sucrees : 2,
        Nb_Boissons : 0
    }

    const formuleRes = await createCocktail(formule)
    formule.Id_Formule = formuleRes.Id_Formule

    expect(JSON.parse(JSON.stringify(formuleRes))).toEqual(formule)

    await formuleRes.destroy()
})

test('Ne doit pas créer la Formule Cocktail', async () => {
    const formule = {
        Id_Type_Formule : 6,
        Nb_Convives : 8,
        Prix_HT : 64.0,
        Nb_Pieces_Salees : 5,
        Nb_Pieces_Sucrees : 0,
        Nb_Boissons : 0
    }

    expect.assertions(1)
    try {
        await createCocktail(formule)
    }
    catch(e) {
        expect(e).toMatch('Le type de formule est invalide.')
    }
})

test("Doit vérifier que la Formule Box est correcte", async () => {
    const formule = {
        Id_Type_Formule : 3,
        Nb_Convives : 8,
        Nb_Pieces_Salees : 3,
        Nb_Pieces_Sucrees : 1
    }

    const type_formule = await Type_Formule.findOne({
        where : {
            Id_Type_Formule : 3
        }
    })

    // cas de base
    const res = await checksFormule(formule)
    expect(res).toEqual(type_formule)
})

test("Doit vérifier que la Formule Box est incorrect", async () => {
    const formule = {
        Id_Type_Formule : 5,
        Nb_Convives : 5,
        Nb_Pieces_Salees : 6,
        Nb_Pieces_Sucrees : 0
    }

    const type_formule = await Type_Formule.findOne({
        where : {
            Id_Type_Formule : 3
        }
    })

    expect.assertions(4)

    // erreur de l'Id_Type_Formule    
    try {
        await checksFormule(formule)
    }
    catch(e) {
        expect(e).toMatch('Le type de formule est invalide.')
    }

    formule.Id_Type_Formule = 3

    // erreur du Nb_Convives
    try {
        await checksFormule(formule)
    }
    catch(e) {
        expect(e).toMatch(`Le nombre de convives pour la formule ${type_formule.Nom} est insuffisant.`)
    }

    formule.Nb_Convives = 8

    // erreur du Nb_Pieces_Salees
    try {
        await checksFormule(formule)
    }
    catch(e) {
        expect(e).toMatch(`Le nombre de pièces par personne pour la formule ${type_formule.Nom} est incorrect.`)
    }

    formule.Nb_Pieces_Salees = 3

    // erreur du Nb_Pieces_Sucrees
    try {
        await checksFormule(formule)
    }
    catch(e) {
        expect(e).toMatch(`Le nombre de pièces par personne pour la formule ${type_formule.Nom} est incorrect.`)
    }
})

test('Doit créer la Formule Box', async () => {
    const formule = {
        Id_Type_Formule : 3,
        Nb_Convives : 8,
        Prix_HT : 120.0,
        Nb_Pieces_Salees : 3,
        Nb_Pieces_Sucrees : 1,
        Nb_Boissons : 0
    }

    const formuleRes = await createBox(formule)
    formule.Id_Formule = formuleRes.Id_Formule

    expect(JSON.parse(JSON.stringify(formuleRes))).toEqual(formule)

    await formuleRes.destroy()
})

test('Ne doit pas créer la Formule Box', async () => {
    const formule = {
        Id_Type_Formule : 6,
        Nb_Convives : 8,
        Prix_HT : 64.0,
        Nb_Pieces_Salees : 5,
        Nb_Pieces_Sucrees : 0,
        Nb_Boissons : 0
    }

    expect.assertions(1)
    try {
        await createBox(formule)
    }
    catch(e) {
        expect(e).toMatch('Le type de formule est invalide.')
    }
})

test("Doit vérifier que la Formule Brunch est correcte", async () => {
    const formule = {
        Id_Type_Formule : 4,
        Nb_Convives : 16,
        Nb_Pieces_Salees : 4,
        Nb_Pieces_Sucrees : 2
    }

    const type_formule = await Type_Formule.findOne({
        where : {
            Id_Type_Formule : 4
        }
    })

    // cas de base
    const res = await checksFormule(formule)
    expect(res).toEqual(type_formule)
})

test("Doit vérifier que la Formule Brunch est incorrect", async () => {
    const formule = {
        Id_Type_Formule : 5,
        Nb_Convives : 5,
        Nb_Pieces_Salees : 9,
        Nb_Pieces_Sucrees : 1
    }

    const type_formule = await Type_Formule.findOne({
        where : {
            Id_Type_Formule : 4
        }
    })

    expect.assertions(4)

    // erreur de l'Id_Type_Formule    
    try {
        await checksFormule(formule)
    }
    catch(e) {
        expect(e).toMatch('Le type de formule est invalide.')
    }

    formule.Id_Type_Formule = 4

    // erreur du Nb_Convives
    try {
        await checksFormule(formule)
    }
    catch(e) {
        expect(e).toMatch(`Le nombre de convives pour la formule ${type_formule.Nom} est insuffisant.`)
    }

    formule.Nb_Convives = 16

    // erreur du Nb_Pieces_Salees
    try {
        await checksFormule(formule)
    }
    catch(e) {
        expect(e).toMatch(`Le nombre de pièces par personne pour la formule ${type_formule.Nom} est incorrect.`)
    }

    formule.Nb_Pieces_Salees = 4

    // erreur du Nb_Pieces_Sucrees
    try {
        await checksFormule(formule)
    }
    catch(e) {
        expect(e).toMatch(`Le nombre de pièces par personne pour la formule ${type_formule.Nom} est incorrect.`)
    }
})

test('Doit créer la Formule Brunch', async () => {
    const formule = {
        Id_Type_Formule : 4,
        Nb_Convives : 16,
        Prix_HT : 314.24,
        Nb_Pieces_Salees : 4,
        Nb_Pieces_Sucrees : 2,
        Nb_Boissons : 0       
    }

    // cas complet
    let formuleRes = await createBrunch({ ...formule, isBrunchSale : true, isBrunchSucre : true })
    formule.Id_Formule = formuleRes.Id_Formule

    expect(JSON.parse(JSON.stringify(formuleRes))).toEqual(formule)

    await formuleRes.destroy()


    // cas salé seulement
    formule.Prix_HT = 202.88
    formuleRes = await createBrunch({ ...formule, isBrunchSale : true })
    formule.Id_Formule = formuleRes.Id_Formule
    formule.Nb_Pieces_Sucrees = 0

    expect(JSON.parse(JSON.stringify(formuleRes))).toEqual(formule)

    await formuleRes.destroy()


    // cas sucré seulement
    formule.Prix_HT = 111.36
    formule.Nb_Pieces_Sucrees = 2
    formuleRes = await createBrunch({ ...formule, isBrunchSucre : true })
    formule.Id_Formule = formuleRes.Id_Formule
    formule.Nb_Pieces_Salees = 0

    expect(JSON.parse(JSON.stringify(formuleRes))).toEqual(formule)

    await formuleRes.destroy()
})

test('Ne doit pas créer la Formule Brunch', async () => {
    const formule = {
        Id_Type_Formule : 6,
        Nb_Convives : 8,
        Prix_HT : 64.0,
        Nb_Pieces_Salees : 5,
        Nb_Pieces_Sucrees : 0,
        Nb_Boissons : 0
    }

    expect.assertions(1)
    try {
        await createBrunch(formule)
    }
    catch(e) {
        expect(e).toMatch('Le type de formule est invalide.')
    }
})

test('Doit retourner une liste de recettes correctes', async () => {
    const listeRecettes = '1;2;3;'

    const resListeRecettes = await checksListeRecettes(listeRecettes)

    expect(resListeRecettes).toEqual(listeRecettes)
})

test('Doit retourner une liste de recettes vide', async () => {
    const listeRecettes = '-1;-2;-3;'

    const resListeRecettes = await checksListeRecettes(listeRecettes)
    expect(resListeRecettes).toBe(null)
})

test('Doit lancer une erreur plutôt que de renvoyer une liste de recettes valides', async () => {
    const listeRecettes = '1,2,3,'

    expect.assertions(1)
    try {
        await checksListeRecettes(listeRecettes)
    }
    catch(e) {
        expect(e.name).toBe('SequelizeValidationError')
    }
})

test('Doit créer les formules comme lors de la création d\'une Estimation', async () => {
    // cas Aperitif
    let formuleRes = await createFormules({
        isAperitif : true,
        nbConvivesAperitif : 8,
        nbPiecesSaleesAperitif : 5
    })

    expect(typeof formuleRes.Formule_Aperitif.Id_Formule).toBe("number")
    expect(formuleRes.Formule_Cocktail).toBe(null)
    expect(formuleRes.Formule_Box).toBe(null)
    expect(formuleRes.Formule_Brunch).toBe(null)

    await formuleRes.Formule_Aperitif.destroy()


    // cas Cocktail
    formuleRes = await createFormules({
        isCocktail : true,
        nbConvivesCocktail : 8,
        nbPiecesSaleesCocktail : 10,
        nbPiecesSucreesCocktail : 2
    })

    expect(formuleRes.Formule_Aperitif).toBe(null)
    expect(typeof formuleRes.Formule_Cocktail.Id_Formule).toBe("number")
    expect(formuleRes.Formule_Box).toBe(null)
    expect(formuleRes.Formule_Brunch).toBe(null)

    await formuleRes.Formule_Cocktail.destroy()


    // cas Box
    formuleRes = await createFormules({
        isBox : true,
        nbConvivesBox : 8
    })

    expect(formuleRes.Formule_Aperitif).toBe(null)
    expect(formuleRes.Formule_Cocktail).toBe(null)
    expect(typeof formuleRes.Formule_Box.Id_Formule).toBe("number")
    expect(formuleRes.Formule_Brunch).toBe(null)

    await formuleRes.Formule_Box.destroy()


    // cas Brunch
    formuleRes = await createFormules({
        isBrunch : true,
        nbConvivesBrunch : 15,
        typeBrunchSale : 'Petite Faim',
        typeBrunchSucre : 'Petite Faim',
        isBrunchSale : true,
        isBrunchSucre : true
    })

    expect(formuleRes.Formule_Aperitif).toBe(null)
    expect(formuleRes.Formule_Cocktail).toBe(null)
    expect(formuleRes.Formule_Box).toBe(null)
    expect(typeof formuleRes.Formule_Brunch.Id_Formule).toBe("number")

    await formuleRes.Formule_Brunch.destroy()


    // cas toutes les formules
    formuleRes = await createFormules({
        isAperitif : true,
        nbConvivesAperitif : 8,
        nbPiecesSaleesAperitif : 5,
        isCocktail : true,
        nbConvivesCocktail : 8,
        nbPiecesSaleesCocktail : 10,
        nbPiecesSucreesCocktail : 2,
        isBox : true,
        nbConvivesBox : 8,
        isBrunch : true,
        nbConvivesBrunch : 15,
        typeBrunchSale : 'Petite Faim',
        typeBrunchSucre : 'Petite Faim',
        isBrunchSale : true,
        isBrunchSucre : true
    })

    expect(typeof formuleRes.Formule_Aperitif.Id_Formule).toBe("number")
    expect(typeof formuleRes.Formule_Cocktail.Id_Formule).toBe("number")
    expect(typeof formuleRes.Formule_Box.Id_Formule).toBe("number")
    expect(typeof formuleRes.Formule_Brunch.Id_Formule).toBe("number")

    await formuleRes.Formule_Aperitif.destroy()
    await formuleRes.Formule_Cocktail.destroy()
    await formuleRes.Formule_Box.destroy()
    await formuleRes.Formule_Brunch.destroy()
})

test('Doit échouer lors de la création des formules comme lors de la création d\'une Estimation', async () => {
    expect.assertions(4)

    // erreur pour Aperitif
    try {
        await createFormules({
            isAperitif : true,
            nbConvivesAperitif : 3,
            nbPiecesSaleesAperitif : 5,
            isCocktail : true,
            nbConvivesCocktail : 8,
            nbPiecesSaleesCocktail : 10,
            nbPiecesSucreesCocktail : 2,
            isBox : true,
            nbConvivesBox : 8,
            isBrunch : true,
            nbConvivesBrunch : 15,
            typeBrunchSale : 'Petite Faim',
            typeBrunchSucre : 'Petite Faim',
            isBrunchSale : true,
            isBrunchSucre : true
        })
    }
    catch(e) {
        expect(e).toBe('Le nombre de convives pour la formule Apéritif est insuffisant.')
    }

    // erreur pour Cocktail
    try {
        await createFormules({
            isAperitif : true,
            nbConvivesAperitif : 8,
            nbPiecesSaleesAperitif : 5,
            isCocktail : true,
            nbConvivesCocktail : 8,
            nbPiecesSaleesCocktail : 5,
            nbPiecesSucreesCocktail : 2,
            isBox : true,
            nbConvivesBox : 8,
            isBrunch : true,
            nbConvivesBrunch : 15,
            typeBrunchSale : 'Petite Faim',
            typeBrunchSucre : 'Petite Faim',
            isBrunchSale : true,
            isBrunchSucre : true
        })
    }
    catch(e) {
        expect(e).toBe('Le nombre de pièces par personne pour la formule Cocktail est incorrect.')
    }

    // erreur pour Box
    try {
        await createFormules({
            isAperitif : true,
            nbConvivesAperitif : 8,
            nbPiecesSaleesAperitif : 5,
            isCocktail : true,
            nbConvivesCocktail : 8,
            nbPiecesSaleesCocktail : 10,
            nbPiecesSucreesCocktail : 2,
            isBox : true,
            nbConvivesBox : 4,
            isBrunch : true,
            nbConvivesBrunch : 15,
            typeBrunchSale : 'Petite Faim',
            typeBrunchSucre : 'Petite Faim',
            isBrunchSale : true,
            isBrunchSucre : true
        })
    }
    catch(e) {
        expect(e).toBe('Le nombre de convives pour la formule Box est insuffisant.')
    }

    // erreur pour Brunch
    try {
        await createFormules({
            isAperitif : true,
            nbConvivesAperitif : 8,
            nbPiecesSaleesAperitif : 5,
            isCocktail : true,
            nbConvivesCocktail : 8,
            nbPiecesSaleesCocktail : 10,
            nbPiecesSucreesCocktail : 2,
            isBox : true,
            nbConvivesBox : 8,
            isBrunch : true,
            nbConvivesBrunch : 10,
            typeBrunchSale : 'Petite Faim',
            typeBrunchSucre : 'Petite Faim',
            isBrunchSale : true,
            isBrunchSucre : true
        })
    }
    catch(e) {
        expect(e).toBe('Le nombre de convives pour la formule Brunch est insuffisant.')
    }
})

test('Doit modifier une formule', async () => {
    // création Aperitif
    const Formule_Aperitif = await modifyFormule(null, {
        isAperitif : true,
        Nb_Convives : 8,
        Nb_Pieces_Salees : 5
    })
    expect(typeof Formule_Aperitif.Id_Formule).toBe("number")
    expect(Formule_Aperitif.Nb_Convives).toBe(8)
    expect(Formule_Aperitif.Nb_Pieces_Salees).toBe(5)
    expect(Formule_Aperitif.Nb_Pieces_Sucrees).toBe(0)
    expect(Formule_Aperitif.Prix_HT).toBe(64.0)


    await Formule_Aperitif.destroy()
})

test('Ne doit pas modifier une formule', async () => {

})