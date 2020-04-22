/* global describe, beforeAll, beforeEach, afterAll, afterEach, test, expect */
require('../../src/app')
const { Type_Formule, Formules } = global.db
const { checksFormule, createAperitif, createCocktail, createBox, createBrunch, createFormules, modifyFormule, checksListeRecettes } = require('../../src/utils/gestion_formules')

describe("gestion_formules", () => {
    describe("checksFormule", () => {
        describe("Aperitif", () => {
            let formule = undefined
            let type_formule = undefined

            beforeAll(async () => {
                type_formule = await Type_Formule.findOne({
                    where : {
                        Id_Type_Formule : 1
                    }
                })
            })

            beforeEach(() => {
                formule = {
                    Id_Type_Formule : 1,
                    Nb_Convives : 8,
                    Nb_Pieces_Salees : 5,
                    Nb_Pieces_Sucrees : 0
                }
            })

            test("Doit vérifier que la Formule est correcte - Tout initialisé", async () => {    
                const res = await checksFormule(formule)
                expect(res).toEqual(type_formule)
            })

            test("Doit vérifier que la Formule est correcte - Id_Type_Formule non initialisé", async () => {     
                formule.Id_Type_Formule = undefined
                expect.assertions(1)
                
                try {
                    await checksFormule(formule)
                }
                catch(e) {
                    expect(e).toMatch('Le type de formule est invalide.')
                }
            })

            test("Doit vérifier que la Formule est incorrecte - Nb_Pieces_Salees  non initialisé", async () => {
                formule.Nb_Pieces_Salees = undefined
                expect.assertions(1)

                try {
                    await checksFormule(formule)
                }
                catch(e) {
                    expect(e).toMatch(`Le nombre de pièces par personne pour la formule ${type_formule.Nom} est incorrect.`)
                }
            })

            test("Doit vérifier que la Formule est correcte - Sucré non initialisé", async () => {     
                formule.Nb_Pieces_Sucrees = undefined
                const res = await checksFormule(formule)
                expect(res).toEqual(type_formule)
            })  
            
            test("Doit vérifier que la Formule est incorrecte - Erreur l'Id_Type_Formule", async () => {
                formule.Id_Type_Formule = 5
                expect.assertions(1)
                
                try {
                    await checksFormule(formule)
                }
                catch(e) {
                    expect(e).toMatch('Le type de formule est invalide.')
                }
            })

            test("Doit vérifier que la Formule est incorrecte - Erreur Nb_Convives", async () => {        
                formule.Nb_Convives = 3
                expect.assertions(1)
                
                try {
                    await checksFormule(formule)
                }
                catch(e) {
                    expect(e).toMatch(`Le nombre de convives pour la formule ${type_formule.Nom} est insuffisant.`)
                }
            })

            test("Doit vérifier que la Formule est incorrecte - Erreur Nb_Pieces_Salees", async () => {
                formule.Nb_Pieces_Salees = 3
                expect.assertions(1)

                try {
                    await checksFormule(formule)
                }
                catch(e) {
                    expect(e).toMatch(`Le nombre de pièces par personne pour la formule ${type_formule.Nom} est incorrect.`)
                }
            })
        })

        describe("Cocktail", () => {
            let formule = undefined
            let type_formule = undefined

            beforeAll(async () => {
                type_formule = await Type_Formule.findOne({
                    where : {
                        Id_Type_Formule : 2
                    }
                })
            })

            beforeEach(() => {
                formule = {
                    Id_Type_Formule : 2,
                    Nb_Convives : 8,
                    Nb_Pieces_Salees : 10,
                    Nb_Pieces_Sucrees : 2
                }
            })

            test("Doit vérifier que la Formule est correcte", async () => {
                const res = await checksFormule(formule)
                expect(res).toEqual(type_formule)
            })
            
            test("Doit vérifier que la Formule est incorrecte - Erreur Id_Type_Formule", async () => {
                formule.Id_Type_Formule = 5
                expect.assertions(1)
                
                try {
                    await checksFormule(formule)
                }
                catch(e) {
                    expect(e).toMatch('Le type de formule est invalide.')
                }
            })

            test("Doit vérifier que la Formule est incorrecte - Erreur Nb_Convives", async () => {
                formule.Nb_Convives = 5
                expect.assertions(1)
                
                try {
                    await checksFormule(formule)
                }
                catch(e) {
                    expect(e).toMatch(`Le nombre de convives pour la formule ${type_formule.Nom} est insuffisant.`)
                }
            })

            test("Doit vérifier que la Formule est incorrecte - Erreur Nb_Pieces_Salees", async () => {
                formule.Nb_Pieces_Salees = 6
                expect.assertions(1)
                
                try {
                    await checksFormule(formule)
                }
                catch(e) {
                    expect(e).toMatch(`Le nombre de pièces par personne pour la formule ${type_formule.Nom} est incorrect.`)
                }
            })

            test("Doit vérifier que la Formule est incorrecte - Erreur Nb_Pieces_Sucrees", async () => {
                formule.Nb_Pieces_Sucrees = 0
                expect.assertions(1)
                
                try {
                    await checksFormule(formule)
                }
                catch(e) {
                    expect(e).toMatch(`Le nombre de pièces par personne pour la formule ${type_formule.Nom} est incorrect.`)
                }
            })
        })
    
        describe("Box", () => {
            let formule = undefined
            let type_formule = undefined

            beforeAll(async () => {
                type_formule = await Type_Formule.findOne({
                    where : {
                        Id_Type_Formule : 3
                    }
                })
            })

            beforeEach(() => {
                formule = {
                    Id_Type_Formule : 3,
                    Nb_Convives : 8,
                    Nb_Pieces_Salees : 3,
                    Nb_Pieces_Sucrees : 1
                }
            })

            test("Doit vérifier que la Formule est correcte", async () => {
                const res = await checksFormule(formule)
                expect(res).toEqual(type_formule)
            })
            
            test("Doit vérifier que la Formule Box est incorrecte - Erreur Id_Type_Formule", async () => {
                formule.Id_Type_Formule = 5
                expect.assertions(1)
                
                try {
                    await checksFormule(formule)
                }
                catch(e) {
                    expect(e).toMatch('Le type de formule est invalide.')
                }
            })

            test("Doit vérifier que la Formule Box est incorrecte - Erreur Nb_Convives", async () => {
                formule.Nb_Convives = 5
                expect.assertions(1)

                try {
                    await checksFormule(formule)
                }
                catch(e) {
                    expect(e).toMatch(`Le nombre de convives pour la formule ${type_formule.Nom} est insuffisant.`)
                }
            })

            test("Doit vérifier que la Formule Box est incorrecte - Erreur Nb_Pieces_Salees", async () => {
                formule.Nb_Pieces_Salees = 6
                expect.assertions(1)
                
                try {
                    await checksFormule(formule)
                }
                catch(e) {
                    expect(e).toMatch(`Le nombre de pièces par personne pour la formule ${type_formule.Nom} est incorrect.`)
                }
            })

            test("Doit vérifier que la Formule Box est incorrecte - Erreur Nb_Pieces_Sucrees", async () => {
                formule.Nb_Pieces_Sucrees = 0
                expect.assertions(1)

                try {
                    await checksFormule(formule)
                }
                catch(e) {
                    expect(e).toMatch(`Le nombre de pièces par personne pour la formule ${type_formule.Nom} est incorrect.`)
                }
            })
        })
    
        describe("Brunch", () => {
            let formule = undefined
            let type_formule = undefined

            beforeAll(async () => {
                type_formule = await Type_Formule.findOne({
                    where : {
                        Id_Type_Formule : 4
                    }
                })
            })

            beforeEach(() => {
                formule = {
                    Id_Type_Formule : 4,
                    Nb_Convives : 16,
                    Nb_Pieces_Salees : 4,
                    Nb_Pieces_Sucrees : 2
                }
            })

            test("Doit vérifier que la Formule est correcte", async () => {
                const res = await checksFormule(formule)
                expect(res).toEqual(type_formule)
            })
            
            test("Doit vérifier que la Formule est incorrecte - Erreur Id_Type_Formule", async () => {
                formule.Id_Type_Formule = 5
                expect.assertions(1)
                
                try {
                    await checksFormule(formule)
                }
                catch(e) {
                    expect(e).toMatch('Le type de formule est invalide.')
                }
            })

            test("Doit vérifier que la Formule est incorrecte - Erreur Nb_Convives", async () => {
                formule.Nb_Convives = 5
                expect.assertions(1)

                try {
                    await checksFormule(formule)
                }
                catch(e) {
                    expect(e).toMatch(`Le nombre de convives pour la formule ${type_formule.Nom} est insuffisant.`)
                }
            })

            test("Doit vérifier que la Formule est incorrecte - Erreur Nb_Pieces_Salees", async () => {
                formule.Nb_Pieces_Salees = 9
                expect.assertions(1)

                try {
                    await checksFormule(formule)
                }
                catch(e) {
                    expect(e).toMatch(`Le nombre de pièces par personne pour la formule ${type_formule.Nom} est incorrect.`)
                }
            })

            test("Doit vérifier que la Formule est incorrecte - Erreur Nb_Pieces_Sucrees", async () => {
                formule.Nb_Pieces_Sucrees = 1
                expect.assertions(1)
                
                try {
                    await checksFormule(formule)
                }
                catch(e) {
                    expect(e).toMatch(`Le nombre de pièces par personne pour la formule ${type_formule.Nom} est incorrect.`)
                }
            })
        })
    })

    describe("checksListeRecettes", () => {
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
    })

    describe("Création/modification de formules", () => {
        let formulesCreated = []

        afterEach(async () => {
            await Formules.destroy({
                where : {
                    Id_Formule : formulesCreated
                }
            })
            formulesCreated = []
        })

        describe("createAperitif", () => {
            let formule = undefined
    
            beforeEach(() => {
                formule = {
                    Id_Type_Formule : 1,
                    Nb_Convives : 8,
                    Prix_HT : 64.0,
                    Nb_Pieces_Salees : 5,
                    Nb_Pieces_Sucrees : 0,
                    Nb_Boissons : 0
                }
            })
    
            test('Doit créer la Formule', async () => {
                const formuleRes = await createAperitif(formule)
                formulesCreated.push(formuleRes.Id_Formule)
                formule.Id_Formule = formuleRes.Id_Formule
            
                expect(JSON.parse(JSON.stringify(formuleRes))).toEqual(formule)
            })
            
            test('Ne doit pas créer la Formule', async () => {
                formule.Id_Type_Formule = 6
            
                expect.assertions(1)
                try {
                    await createAperitif(formule)
                }
                catch(e) {
                    expect(e).toMatch('Le type de formule est invalide.')
                }
            })
        })    
    
        describe("createCocktail", () => {
            let formule = undefined
    
            beforeEach(() => {
                formule = {
                    Id_Type_Formule : 2,
                    Nb_Convives : 8,
                    Prix_HT : 151.2,
                    Nb_Pieces_Salees : 10,
                    Nb_Pieces_Sucrees : 2,
                    Nb_Boissons : 0
                }
            })
    
            test('Doit créer la Formule', async () => {
                const formuleRes = await createCocktail(formule)
                formulesCreated.push(formuleRes.Id_Formule)
                formule.Id_Formule = formuleRes.Id_Formule
            
                expect(JSON.parse(JSON.stringify(formuleRes))).toEqual(formule)
            })
            
            test('Ne doit pas créer la Formule', async () => {
                formule.Id_Type_Formule = 6
            
                expect.assertions(1)
                try {
                    await createCocktail(formule)
                }
                catch(e) {
                    expect(e).toMatch('Le type de formule est invalide.')
                }
            })
        })
        
        describe("createBox", () => {
            let formule = undefined
    
            beforeEach(() => {
                formule = {
                    Id_Type_Formule : 3,
                    Nb_Convives : 8,
                    Prix_HT : 120.0,
                    Nb_Pieces_Salees : 3,
                    Nb_Pieces_Sucrees : 1,
                    Nb_Boissons : 0
                }
            })
    
            test('Doit créer la Formule', async () => {
                const formuleRes = await createBox(formule)
                formulesCreated.push(formuleRes.Id_Formule)
                formule.Id_Formule = formuleRes.Id_Formule
            
                expect(JSON.parse(JSON.stringify(formuleRes))).toEqual(formule)
            })
            
            test('Ne doit pas créer la Formule', async () => {
                formule.Id_Type_Formule = 6
            
                expect.assertions(1)
                try {
                    await createBox(formule)
                }
                catch(e) {
                    expect(e).toMatch('Le type de formule est invalide.')
                }
            })
        })
        
        describe("createBrunch", () => {
            let formule = undefined
    
            beforeEach(() => {
                formule = {
                    Id_Type_Formule : 4,
                    Nb_Convives : 16,
                    Prix_HT : 314.24,
                    Nb_Pieces_Salees : 4,
                    Nb_Pieces_Sucrees : 2,
                    Nb_Boissons : 0       
                }
            })
    
            test('Doit créer la Formule - Formule complète', async () => {
                const formuleRes = await createBrunch({ ...formule, isBrunchSale : true, isBrunchSucre : true })
                formulesCreated.push(formuleRes.Id_Formule)
                formule.Id_Formule = formuleRes.Id_Formule
            
                expect(JSON.parse(JSON.stringify(formuleRes))).toEqual(formule)
            })
    
            test('Doit créer la Formule - Formule salée uniquement', async () => {
                formule.Prix_HT = 202.88
                const formuleRes = await createBrunch({ ...formule, isBrunchSale : true })
                formulesCreated.push(formuleRes.Id_Formule)
                formule.Id_Formule = formuleRes.Id_Formule
                formule.Nb_Pieces_Sucrees = 0
            
                expect(JSON.parse(JSON.stringify(formuleRes))).toEqual(formule)
            })
    
            test('Doit créer la Formule - Formule sucrée uniquement', async () => {
                formule.Prix_HT = 111.36
                const formuleRes = await createBrunch({ ...formule, isBrunchSucre : true })
                formulesCreated.push(formuleRes.Id_Formule)
                formule.Id_Formule = formuleRes.Id_Formule
                formule.Nb_Pieces_Salees = 0
            
                expect(JSON.parse(JSON.stringify(formuleRes))).toEqual(formule)
            })
            
            test('Ne doit pas créer la Formule', async () => {
                formule.Id_Type_Formule = 5
                expect.assertions(1)
    
                try {
                    await createBrunch(formule)
                }
                catch(e) {
                    expect(e).toMatch('Le type de formule est invalide.')
                }
            })
        })

        describe("createFormules", () => {
            test('Doit créer les formules comme lors de la création d\'une Estimation - Toutes les Formules', async () => {
                const formulesRes = await createFormules({
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
    
                formulesCreated.push(formulesRes.Formule_Aperitif.Id_Formule)
                formulesCreated.push(formulesRes.Formule_Cocktail.Id_Formule)
                formulesCreated.push(formulesRes.Formule_Box.Id_Formule)
                formulesCreated.push(formulesRes.Formule_Brunch.Id_Formule)
            
                expect(typeof formulesRes.Formule_Aperitif.Id_Formule).toBe("number")
                expect(typeof formulesRes.Formule_Cocktail.Id_Formule).toBe("number")
                expect(typeof formulesRes.Formule_Box.Id_Formule).toBe("number")
                expect(typeof formulesRes.Formule_Brunch.Id_Formule).toBe("number")
            })
    
            test('Doit créer les formules comme lors de la création d\'une Estimation - Aperitif uniquement', async () => {
                const formulesRes = await createFormules({
                    isAperitif : true,
                    nbConvivesAperitif : 8,
                    nbPiecesSaleesAperitif : 5
                })
                formulesCreated.push(formulesRes.Formule_Aperitif.Id_Formule)
            
                expect(typeof formulesRes.Formule_Aperitif.Id_Formule).toBe("number")
                expect(formulesRes.Formule_Cocktail).toBe(null)
                expect(formulesRes.Formule_Box).toBe(null)
                expect(formulesRes.Formule_Brunch).toBe(null)
            })
    
            test('Doit créer les formules comme lors de la création d\'une Estimation - Cocktail uniquement', async () => {
                const formulesRes = await createFormules({
                    isCocktail : true,
                    nbConvivesCocktail : 8,
                    nbPiecesSaleesCocktail : 10,
                    nbPiecesSucreesCocktail : 2
                })
                formulesCreated.push(formulesRes.Formule_Cocktail.Id_Formule)
            
                expect(formulesRes.Formule_Aperitif).toBe(null)
                expect(typeof formulesRes.Formule_Cocktail.Id_Formule).toBe("number")
                expect(formulesRes.Formule_Box).toBe(null)
                expect(formulesRes.Formule_Brunch).toBe(null)
            })
    
            test('Doit créer les formules comme lors de la création d\'une Estimation - Box uniquement', async () => {
                const formulesRes = await createFormules({
                    isBox : true,
                    nbConvivesBox : 8
                })
                formulesCreated.push(formulesRes.Formule_Box.Id_Formule)
            
                expect(formulesRes.Formule_Aperitif).toBe(null)
                expect(formulesRes.Formule_Cocktail).toBe(null)
                expect(typeof formulesRes.Formule_Box.Id_Formule).toBe("number")
                expect(formulesRes.Formule_Brunch).toBe(null)
            })
    
            test('Doit créer les formules comme lors de la création d\'une Estimation - Brunch uniquement (petit salé & sucré)', async () => {
                const formulesRes = await createFormules({
                    isBrunch : true,
                    nbConvivesBrunch : 15,
                    typeBrunchSale : 'Petite Faim',
                    typeBrunchSucre : 'Petite Faim',
                    isBrunchSale : true,
                    isBrunchSucre : true
                })
                formulesCreated.push(formulesRes.Formule_Brunch.Id_Formule)
            
                expect(formulesRes.Formule_Aperitif).toBe(null)
                expect(formulesRes.Formule_Cocktail).toBe(null)
                expect(formulesRes.Formule_Box).toBe(null)
                expect(typeof formulesRes.Formule_Brunch.Id_Formule).toBe("number")
            })
    
            test('Doit créer les formules comme lors de la création d\'une Estimation - Brunch uniquement (grand salé & sucré)', async () => {
                const formulesRes = await createFormules({
                    isBrunch : true,
                    nbConvivesBrunch : 15,
                    typeBrunchSale : 'Grande Faim',
                    typeBrunchSucre : 'Grande Faim',
                    isBrunchSale : true,
                    isBrunchSucre : true
                })
                formulesCreated.push(formulesRes.Formule_Brunch.Id_Formule)
            
                expect(formulesRes.Formule_Aperitif).toBe(null)
                expect(formulesRes.Formule_Cocktail).toBe(null)
                expect(formulesRes.Formule_Box).toBe(null)
                expect(typeof formulesRes.Formule_Brunch.Id_Formule).toBe("number")
            })
            
            test('Doit échouer lors de la création des formules comme lors de la création d\'une Estimation - Erreur Aperitif', async () => {
                expect.assertions(1)
                
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
            })
    
            test('Doit échouer lors de la création des formules comme lors de la création d\'une Estimation - Erreur Cocktail', async () => {
                expect.assertions(1)
                
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
            })
    
            test('Doit échouer lors de la création des formules comme lors de la création d\'une Estimation - Erreur Box', async () => {
                expect.assertions(1)
                
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
            })
    
            test('Doit échouer lors de la création des formules comme lors de la création d\'une Estimation - Erreur Brunch', async () => {
                expect.assertions(1)
                
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
        })
    
        describe("modifyFormule", () => {
            let formules = undefined
    
            beforeEach(() => {
                formules = {
                    Formule_Aperitif : {
                        isAperitif : true,
                        Nb_Convives : 8,
                        Nb_Pieces_Salees : 5
                    },
                    Formule_Cocktail : {
                        isCocktail : true,
                        Nb_Convives : 8,
                        Nb_Pieces_Salees : 10,
                        Nb_Pieces_Sucrees : 2
                    },
                    Formule_Box : {
                        isBox : true,
                        Nb_Convives : 8
                    },
                    Formule_Brunch : {
                        isBrunch : true,
                        isBrunchSale : false,
                        isBrunchSucre : false,
                        Nb_Convives : 16,
                        Nb_Pieces_Salees : 4,
                        Nb_Pieces_Sucrees : 2
                    }
                }
            })
    
            describe("Sans formule préexistente", () => {
                test('Doit créer Aperitif', async () => {
                    const Formule_Aperitif = await modifyFormule(null, formules.Formule_Aperitif)
                    formulesCreated.push(Formule_Aperitif.Id_Formule)
    
                    expect(typeof Formule_Aperitif.Id_Formule).toBe("number")
                    expect(Formule_Aperitif.Nb_Convives).toBe(8)
                    expect(Formule_Aperitif.Nb_Pieces_Salees).toBe(5)
                    expect(Formule_Aperitif.Nb_Pieces_Sucrees).toBe(0)
                    expect(Formule_Aperitif.Prix_HT).toBe(64.0)
                })
    
                test('Doit créer Cocktail', async () => {
                    const Formule_Cocktail = await modifyFormule(null, formules.Formule_Cocktail)
                    formulesCreated.push(Formule_Cocktail.Id_Formule)
    
                    expect(typeof Formule_Cocktail.Id_Formule).toBe("number")
                    expect(Formule_Cocktail.Nb_Convives).toBe(8)
                    expect(Formule_Cocktail.Nb_Pieces_Salees).toBe(10)
                    expect(Formule_Cocktail.Nb_Pieces_Sucrees).toBe(2)
                    expect(Formule_Cocktail.Prix_HT).toBe(151.2)
                })
    
                test('Doit créer Box', async () => {
                    const Formule_Box = await modifyFormule(null, formules.Formule_Box)
                    formulesCreated.push(Formule_Box.Id_Formule)
    
                    expect(typeof Formule_Box.Id_Formule).toBe("number")
                    expect(Formule_Box.Nb_Convives).toBe(8)
                    expect(Formule_Box.Nb_Pieces_Salees).toBe(3)
                    expect(Formule_Box.Nb_Pieces_Sucrees).toBe(1)
                    expect(Formule_Box.Prix_HT).toBe(120.0)
                })
    
                test('Doit créer Brunch - salé & sucré', async () => {
                    formules.Formule_Brunch.isBrunchSale = true
                    formules.Formule_Brunch.isBrunchSucre = true
                    const Formule_Brunch = await modifyFormule(null, formules.Formule_Brunch)
                    formulesCreated.push(Formule_Brunch.Id_Formule)
    
                    expect(typeof Formule_Brunch.Id_Formule).toBe("number")
                    expect(Formule_Brunch.Nb_Convives).toBe(16)
                    expect(Formule_Brunch.Nb_Pieces_Salees).toBe(4)
                    expect(Formule_Brunch.Nb_Pieces_Sucrees).toBe(2)
                    expect(Formule_Brunch.Prix_HT).toBe(314.24)
                })
    
                test('Doit créer Brunch - salé (petit)', async () => {
                    formules.Formule_Brunch.isBrunchSale = true
                    formules.Formule_Brunch.Nb_Pieces_Sucrees = undefined
                    const Formule_Brunch = await modifyFormule(null, formules.Formule_Brunch)
                    formulesCreated.push(Formule_Brunch.Id_Formule)
    
                    expect(typeof Formule_Brunch.Id_Formule).toBe("number")
                    expect(Formule_Brunch.Nb_Convives).toBe(16)
                    expect(Formule_Brunch.Nb_Pieces_Salees).toBe(4)
                    expect(Formule_Brunch.Nb_Pieces_Sucrees).toBe(0)
                    expect(Formule_Brunch.Prix_HT).toBe(202.88)
                })
    
                test('Doit créer Brunch - salé (grand)', async () => {
                    formules.Formule_Brunch.isBrunchSale = true
                    formules.Formule_Brunch.Nb_Pieces_Sucrees = undefined
                    formules.Formule_Brunch.Nb_Pieces_Salees = 8
                    const Formule_Brunch = await modifyFormule(null, formules.Formule_Brunch)
                    formulesCreated.push(Formule_Brunch.Id_Formule)
    
                    expect(typeof Formule_Brunch.Id_Formule).toBe("number")
                    expect(Formule_Brunch.Nb_Convives).toBe(16)
                    expect(Formule_Brunch.Nb_Pieces_Salees).toBe(8)
                    expect(Formule_Brunch.Nb_Pieces_Sucrees).toBe(0)
                    expect(Formule_Brunch.Prix_HT).toBe(333.76)
                })
    
                test('Doit créer Brunch - sucré (petit)', async () => {
                    formules.Formule_Brunch.isBrunchSucre = true
                    formules.Formule_Brunch.Nb_Pieces_Salees = undefined
                    const Formule_Brunch = await modifyFormule(null, formules.Formule_Brunch)
                    formulesCreated.push(Formule_Brunch.Id_Formule)
    
                    expect(typeof Formule_Brunch.Id_Formule).toBe("number")
                    expect(Formule_Brunch.Nb_Convives).toBe(16)
                    expect(Formule_Brunch.Nb_Pieces_Salees).toBe(0)
                    expect(Formule_Brunch.Nb_Pieces_Sucrees).toBe(2)
                    expect(Formule_Brunch.Prix_HT).toBe(111.36)
                })
    
                test('Doit créer Brunch - sucré (grand)', async () => {
                    formules.Formule_Brunch.isBrunchSucre = true
                    formules.Formule_Brunch.Nb_Pieces_Salees = undefined
                    formules.Formule_Brunch.Nb_Pieces_Sucrees = 4
                    const Formule_Brunch = await modifyFormule(null, formules.Formule_Brunch)
                    formulesCreated.push(Formule_Brunch.Id_Formule)
    
                    expect(typeof Formule_Brunch.Id_Formule).toBe("number")
                    expect(Formule_Brunch.Nb_Convives).toBe(16)
                    expect(Formule_Brunch.Nb_Pieces_Salees).toBe(0)
                    expect(Formule_Brunch.Nb_Pieces_Sucrees).toBe(4)
                    expect(Formule_Brunch.Prix_HT).toBe(181.76)
                })
    
                test('Ne doit pas créer Aperitif', async () => {
                    formules.Formule_Aperitif.Nb_Pieces_Salees = 0
                    expect.assertions(1)
    
                    try {
                        await modifyFormule(null, formules.Formule_Aperitif)
                    }
                    catch(e) {
                        expect(e).toBe('Le nombre de pièces par personne pour la formule Apéritif est incorrect.')
                    }
                })
    
                test('Ne doit pas créer Cocktail', async () => {
                    formules.Formule_Cocktail.Nb_Pieces_Salees = 0
                    expect.assertions(1)
    
                    try {
                        await modifyFormule(null, formules.Formule_Cocktail)
                    }
                    catch(e) {
                        expect(e).toBe('Le nombre de pièces par personne pour la formule Cocktail est incorrect.')
                    }
                })
    
                test('Ne doit pas créer Box', async () => {
                    formules.Formule_Box.Nb_Convives = 3
                    expect.assertions(1)
    
                    try {
                        await modifyFormule(null, formules.Formule_Box)
                    }
                    catch(e) {
                        expect(e).toBe('Le nombre de convives pour la formule Box est insuffisant.')
                    }
                })
    
                test('Ne doit pas créer Brunch - ni salé ni sucré', async () => {
                    expect.assertions(1)
    
                    try {
                        await modifyFormule(null, formules.Formule_Brunch)
                    }
                    catch(e) {
                        expect(e).toBe('Un type de brunch doit être sélectionné.')
                    }
                })
            })
    
            describe("Avec formule préexistente", () => {
                test('Doit modifier Aperitif', async () => {
                    const oldFormule_Aperitif = await modifyFormule(null, formules.Formule_Aperitif)
                    formulesCreated.push(oldFormule_Aperitif.Id_Formule)
    
                    const newFormule_Aperitif = await modifyFormule(oldFormule_Aperitif, {
                        isAperitif : true,
                        Nb_Convives : 10,
                        Nb_Pieces_Salees : 9
                    })
                    formulesCreated.push(newFormule_Aperitif.Id_Formule)
    
                    expect(newFormule_Aperitif.Id_Formule).toBe(oldFormule_Aperitif.Id_Formule)
                    expect(newFormule_Aperitif.Nb_Convives).toBe(10)
                    expect(newFormule_Aperitif.Nb_Pieces_Salees).toBe(9)
                    expect(newFormule_Aperitif.Nb_Pieces_Sucrees).toBe(0)
                    expect(newFormule_Aperitif.Prix_HT).toBe(144.0)
                })
    
                test('Doit modifier Cocktail', async () => {
                    const oldFormule_Cocktail = await modifyFormule(null, formules.Formule_Cocktail)
                    formulesCreated.push(oldFormule_Cocktail.Id_Formule)
    
                    const newFormule_Cocktail = await modifyFormule(oldFormule_Cocktail, {
                        isCocktail : true,
                        Nb_Convives : 6,
                        Nb_Pieces_Salees : 14,
                        Nb_Pieces_Sucrees : 4
                    })
                    formulesCreated.push(newFormule_Cocktail.Id_Formule)
    
                    expect(newFormule_Cocktail.Id_Formule).toBe(oldFormule_Cocktail.Id_Formule)
                    expect(newFormule_Cocktail.Nb_Convives).toBe(6)
                    expect(newFormule_Cocktail.Nb_Pieces_Salees).toBe(14)
                    expect(newFormule_Cocktail.Nb_Pieces_Sucrees).toBe(4)
                    expect(newFormule_Cocktail.Prix_HT).toBe(169.2)
                })
    
                test('Doit modifier Box', async () => {
                    const oldFormule_Box = await modifyFormule(null, formules.Formule_Box)
                    formulesCreated.push(oldFormule_Box.Id_Formule)
    
                    const newFormule_Box = await modifyFormule(oldFormule_Box, {
                        isBox : true,
                        Nb_Convives : 10
                    })
                    formulesCreated.push(newFormule_Box.Id_Formule)
    
                    expect(newFormule_Box.Id_Formule).toBe(oldFormule_Box.Id_Formule)
                    expect(newFormule_Box.Nb_Convives).toBe(10)
                    expect(newFormule_Box.Nb_Pieces_Salees).toBe(3)
                    expect(newFormule_Box.Nb_Pieces_Sucrees).toBe(1)
                    expect(newFormule_Box.Prix_HT).toBe(150.0)
                })
    
                test('Doit modifier Brunch', async () => {
                    formules.Formule_Brunch.isBrunchSale = true
                    formules.Formule_Brunch.isBrunchSucre = true
    
                    const oldFormule_Brunch = await modifyFormule(null, formules.Formule_Brunch)
                    formulesCreated.push(oldFormule_Brunch.Id_Formule)
    
                    const newFormule_Brunch = await modifyFormule(oldFormule_Brunch, {
                        isBrunch : true,
                        isBrunchSale : true,
                        isBrunchSucre : false,
                        Nb_Convives : 20,
                        Nb_Pieces_Salees : 8,
                        Nb_Pieces_Sucrees : 2
                    })
                    formulesCreated.push(newFormule_Brunch.Id_Formule)
    
                    expect(newFormule_Brunch.Id_Formule).toBe(oldFormule_Brunch.Id_Formule)
                    expect(newFormule_Brunch.Nb_Convives).toBe(20)
                    expect(newFormule_Brunch.Nb_Pieces_Salees).toBe(8)
                    expect(newFormule_Brunch.Nb_Pieces_Sucrees).toBe(0)
                    expect(newFormule_Brunch.Prix_HT).toBe(417.2)
                })
    
                test('Ne doit pas modifier Brunch - ni salé ni sucré', async () => {
                    formules.Formule_Brunch.isBrunchSale = true
                    formules.Formule_Brunch.isBrunchSucre = true
    
                    const oldFormule_Brunch = await modifyFormule(null, formules.Formule_Brunch)
                    formulesCreated.push(oldFormule_Brunch.Id_Formule)
    
                    expect.assertions(1)
    
                    try {
                        await modifyFormule(oldFormule_Brunch, {
                            isBrunch : true,
                            isBrunchSale : false,
                            isBrunchSucre : false,
                            Nb_Convives : 20,
                            Nb_Pieces_Salees : 8,
                            Nb_Pieces_Sucrees : 2
                        })
                    }
                    catch(e) {
                        expect(e).toBe('Un type de brunch doit être sélectionné.')
                    }
                })
            })    
        })
    })   
})