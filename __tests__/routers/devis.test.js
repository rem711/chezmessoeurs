/* global describe, beforeAll, beforeEach, afterAll, afterEach, test, expect */
const request = require('supertest')
const app = require('../../src/app')
const { Devis, Estimations, Clients, Formules } = global.db
const moment = require('moment')
const { createDevis, getListInfosDevis, validate } = require('../../src/routers/devis')

describe("Router devis", () => {  
    const devisCreated = []
    let cookie = undefined

    beforeAll(async () => {
        const response = await request(app).post('/authentification').send({ password : 'demo@2020crm-CMS' }).expect(302)
        
        cookie = response.header['set-cookie']
    })

    afterAll(async () => {
        await Devis.destroy({
            where : {
                Id_Devis : devisCreated
            }
        })
    })

    describe("Fonctions indépendantes", () => {
        describe("createDevis", () => {
            describe("Cas sans estimation", () => {
                let estimation = undefined
                
                beforeEach(() => {
                    estimation = {
                        isCreation: "true",
                        Id_Devis: undefined,
                        client : {
                            Nom_Prenom: "Client Test",
                            Adresse_Facturation: "adresse Facturation Client Test",
                            Email: "client-test@mail.com",
                            Telephone: "0000000000",
                            Type: "Professionnel"
                        },
                        Date_Evenement: "2020-04-20 08:00",
                        Adresse_Livraison: "",
                        Formule_Aperitif : {
                            isAperitif: true,
                            Nb_Convives: "8",
                            Nb_Pieces_Salees: "7",
                            Liste_Id_Recettes_Salees: ";;;;;;",
                            Liste_Id_Recettes_Boissons: ""
                        },
                        Formule_Cocktail : {
                            isCocktail: true,
                            Nb_Convives: "8",
                            Nb_Pieces_Salees: "9",
                            Nb_Pieces_Sucrees: "3",
                            Liste_Id_Recettes_Salees: ";;;;;;;;",
                            Liste_Id_Recettes_Sucrees: ";;",
                            Liste_Id_Recettes_Boissons: ""
                        },
                        Formule_Box : {
                            isBox: true,
                            Nb_Convives: "10",
                            Liste_Id_Recettes_Salees: "",
                            Liste_Id_Recettes_Sucrees: "",
                            Liste_Id_Recettes_Boissons: ""
                        },
                        Formule_Brunch : {
                            isBrunch: true,
                            isBrunchSale: true,
                            isBrunchSucre: true,
                            Nb_Convives: "19",
                            Nb_Pieces_Salees: "4",
                            Nb_Pieces_Sucrees: "4",
                            Liste_Id_Recettes_Salees: ";;;",
                            Liste_Id_Recettes_Sucrees: ";;;",
                            Liste_Id_Recettes_Boissons: ""
                        },
                        Commentaire: "",
                        Liste_Options: "",
                        Remise: null
                    }
                })

                test("Aperitif", async () => {
                    estimation.Formule_Cocktail.isCocktail = false
                    estimation.Formule_Box.isBox = false
                    estimation.Formule_Brunch.isBrunch = false

                    const devis = await createDevis(estimation)
                    devisCreated.push(devis.Id_Devis)

                    expect(devis.Id_Client).toBe(5)
                    expect(moment.utc(devis.Date_Evenement).toString()).toBe(moment.utc('2020-04-20 08:00').toString())
                    expect(devis.Adresse_Livraison).toBe('adresse Facturation Client Test')
                    expect(devis.Id_Estimation).toBe(null)
                    expect(typeof devis.Id_Formule_Aperitif).toBe("number")
                    expect(devis.Id_Formule_Cocktail).toBe(null)
                    expect(devis.Id_Formule_Box).toBe(null)
                    expect(devis.Id_Formule_Brunch).toBe(null)
                    expect(devis.Commentaire).toBe('')
                    expect(devis.Statut).toBe('En cours')
                    expect(devis.Liste_Options).toBe('')
                    expect(devis.Id_Remise).toBe(null)
                    expect(Number(devis.Prix_HT)).toBe(89.6)
                    expect(Number(devis.Prix_TTC)).toBe(98.56)
                })

                test("Cocktail", async () => {
                    estimation.Formule_Aperitif.isAperitif = false
                    estimation.Formule_Box.isBox = false
                    estimation.Formule_Brunch.isBrunch = false

                    const devis = await createDevis(estimation)
                    devisCreated.push(devis.Id_Devis)

                    expect(devis.Id_Client).toBe(5)
                    expect(moment.utc(devis.Date_Evenement).toString()).toBe(moment.utc('2020-04-20 08:00').toString())
                    expect(devis.Adresse_Livraison).toBe('adresse Facturation Client Test')
                    expect(devis.Id_Estimation).toBe(null)
                    expect(devis.Id_Formule_Aperitif).toBe(null)
                    expect(typeof devis.Id_Formule_Cocktail).toBe("number")
                    expect(devis.Id_Formule_Box).toBe(null)
                    expect(devis.Id_Formule_Brunch).toBe(null)
                    expect(devis.Commentaire).toBe('')
                    expect(devis.Statut).toBe('En cours')
                    expect(devis.Liste_Options).toBe('')
                    expect(devis.Id_Remise).toBe(null)
                    expect(Number(devis.Prix_HT)).toBe(150)
                    expect(Number(devis.Prix_TTC)).toBe(165)
                })

                test("Box", async () => {                    
                    estimation.Formule_Aperitif.isAperitif = false
                    estimation.Formule_Cocktail.isCocktail = false
                    estimation.Formule_Brunch.isBrunch = false

                    const devis = await createDevis(estimation)
                    devisCreated.push(devis.Id_Devis)

                    expect(devis.Id_Client).toBe(5)
                    expect(moment.utc(devis.Date_Evenement).toString()).toBe(moment.utc('2020-04-20 08:00').toString())
                    expect(devis.Adresse_Livraison).toBe('adresse Facturation Client Test')
                    expect(devis.Id_Estimation).toBe(null)
                    expect(devis.Id_Formule_Aperitif).toBe(null)
                    expect(devis.Id_Formule_Cocktail).toBe(null)
                    expect(typeof devis.Id_Formule_Box).toBe("number")
                    expect(devis.Id_Formule_Brunch).toBe(null)
                    expect(devis.Commentaire).toBe('')
                    expect(devis.Statut).toBe('En cours')
                    expect(devis.Liste_Options).toBe('')
                    expect(devis.Id_Remise).toBe(null)
                    expect(Number(devis.Prix_HT)).toBe(150)
                    expect(Number(devis.Prix_TTC)).toBe(165)
                })

                test("Brunch - Petite salé/Grand sucré", async () => {
                    estimation.Formule_Aperitif.isAperitif = false
                    estimation.Formule_Cocktail.isCocktail = false
                    estimation.Formule_Box.isBox = false
                    estimation.Adresse_Livraison = 'adresse Livraison Brunch Client Test'

                    const devis = await createDevis(estimation)
                    devisCreated.push(devis.Id_Devis)

                    expect(devis.Id_Client).toBe(5)
                    expect(moment.utc(devis.Date_Evenement).toString()).toBe(moment.utc('2020-04-20 08:00').toString())
                    expect(devis.Adresse_Livraison).toBe('adresse Livraison Brunch Client Test')
                    expect(devis.Id_Estimation).toBe(null)
                    expect(devis.Id_Formule_Aperitif).toBe(null)
                    expect(devis.Id_Formule_Cocktail).toBe(null)
                    expect(devis.Id_Formule_Box).toBe(null)
                    expect(typeof devis.Id_Formule_Brunch).toBe("number")
                    expect(devis.Commentaire).toBe('')
                    expect(devis.Statut).toBe('En cours')
                    expect(devis.Liste_Options).toBe('')
                    expect(devis.Id_Remise).toBe(null)
                    expect(Number(devis.Prix_HT)).toBe(456.76)
                    expect(Number(devis.Prix_TTC)).toBe(502.44)
                })

                test("Brunch - Grand salé/Petit sucré", async () => {
                    estimation.Formule_Aperitif.isAperitif = false
                    estimation.Formule_Cocktail.isCocktail = false
                    estimation.Formule_Box.isBox = false
                    estimation.Adresse_Livraison = 'adresse Livraison Brunch Client Test'
                    estimation.Formule_Brunch.Nb_Pieces_Salees = 8
                    estimation.Formule_Brunch.Nb_Pieces_Sucrees = 2

                    const devis = await createDevis(estimation)
                    devisCreated.push(devis.Id_Devis)

                    expect(devis.Id_Client).toBe(5)
                    expect(moment.utc(devis.Date_Evenement).toString()).toBe(moment.utc('2020-04-20 08:00').toString())
                    expect(devis.Adresse_Livraison).toBe('adresse Livraison Brunch Client Test')
                    expect(devis.Id_Estimation).toBe(null)
                    expect(devis.Id_Formule_Aperitif).toBe(null)
                    expect(devis.Id_Formule_Cocktail).toBe(null)
                    expect(devis.Id_Formule_Box).toBe(null)
                    expect(typeof devis.Id_Formule_Brunch).toBe("number")
                    expect(devis.Commentaire).toBe('')
                    expect(devis.Statut).toBe('En cours')
                    expect(devis.Liste_Options).toBe('')
                    expect(devis.Id_Remise).toBe(null)
                    expect(Number(devis.Prix_HT)).toBe(528.58)
                    expect(Number(devis.Prix_TTC)).toBe(581.44)
                })
            })

            describe("Cas depuis une estimation", () => {
                test("Aperitif", async () => {
                    let estimation = await Estimations.findOne({
                        where : {
                            Id_Estimation : 3
                        },
                        include : [
                            { model : Clients },
                            { model : Formules, as : 'Formule_Aperitif' },
                            { model : Formules, as : 'Formule_Cocktail' },
                            { model : Formules, as : 'Formule_Box' },
                            { model : Formules, as : 'Formule_Brunch' }
                        ]
                    })

                    const devis = await createDevis(estimation)
                    devisCreated.push(devis.Id_Devis)

                    expect(devis.Id_Client).toBe(5)
                    expect(moment.utc(devis.Date_Evenement).toString()).toBe(moment.utc('2020-08-27 19:00:00').toString())
                    expect(devis.Adresse_Livraison).toBe('adresse Facturation Client Test')
                    expect(devis.Id_Estimation).toBe(3)
                    expect(devis.Id_Formule_Aperitif).toBe(3)
                    expect(devis.Id_Formule_Cocktail).toBe(null)
                    expect(devis.Id_Formule_Box).toBe(null)
                    expect(devis.Id_Formule_Brunch).toBe(null)
                    expect(devis.Commentaire).toBe('Un produit sans lactose')
                    expect(devis.Statut).toBe('En cours')
                    expect(devis.Liste_Options).toBe(null)
                    expect(devis.Id_Remise).toBe(null)
                    expect(Number(devis.Prix_HT)).toBe(100.8)
                    expect(Number(devis.Prix_TTC)).toBe(110.88)

                    estimation = await Estimations.findOne({
                        where : {
                            Id_Estimation : 3
                        }
                    })

                    expect(estimation.Statut).toBe('Archivée')
                })

                test("Cocktail", async () => {
                    const estimation = await Estimations.findOne({
                        where : {
                            Id_Estimation : 4
                        },
                        include : [
                            { model : Clients },
                            { model : Formules, as : 'Formule_Aperitif' },
                            { model : Formules, as : 'Formule_Cocktail' },
                            { model : Formules, as : 'Formule_Box' },
                            { model : Formules, as : 'Formule_Brunch' }
                        ]
                    })

                    const devis = await createDevis(estimation)
                    devisCreated.push(devis.Id_Devis)

                    expect(devis.Id_Client).toBe(5)
                    expect(moment.utc(devis.Date_Evenement).toString()).toBe(moment.utc('2020-08-27 19:00:00').toString())
                    expect(devis.Adresse_Livraison).toBe('adresse Facturation Client Test')
                    expect(devis.Id_Estimation).toBe(4)
                    expect(devis.Id_Formule_Aperitif).toBe(null)
                    expect(devis.Id_Formule_Cocktail).toBe(4)
                    expect(devis.Id_Formule_Box).toBe(null)
                    expect(devis.Id_Formule_Brunch).toBe(null)
                    expect(devis.Commentaire).toBe(null)
                    expect(devis.Statut).toBe('En cours')
                    expect(devis.Liste_Options).toBe(null)
                    expect(devis.Id_Remise).toBe(null)
                    expect(Number(devis.Prix_HT)).toBe(168.75)
                    expect(Number(devis.Prix_TTC)).toBe(185.63)
                })

                test("Box", async () => {
                    const estimation = await Estimations.findOne({
                        where : {
                            Id_Estimation : 5
                        },
                        include : [
                            { model : Clients },
                            { model : Formules, as : 'Formule_Aperitif' },
                            { model : Formules, as : 'Formule_Cocktail' },
                            { model : Formules, as : 'Formule_Box' },
                            { model : Formules, as : 'Formule_Brunch' }
                        ]
                    })

                    const devis = await createDevis(estimation)
                    devisCreated.push(devis.Id_Devis)

                    expect(devis.Id_Client).toBe(5)
                    expect(moment.utc(devis.Date_Evenement).toString()).toBe(moment.utc('2020-08-27 19:00:00').toString())
                    expect(devis.Adresse_Livraison).toBe('adresse Facturation Client Test')
                    expect(devis.Id_Estimation).toBe(5)
                    expect(devis.Id_Formule_Aperitif).toBe(null)
                    expect(devis.Id_Formule_Cocktail).toBe(null)
                    expect(devis.Id_Formule_Box).toBe(5)
                    expect(devis.Id_Formule_Brunch).toBe(null)
                    expect(devis.Commentaire).toBe(null)
                    expect(devis.Statut).toBe('En cours')
                    expect(devis.Liste_Options).toBe(null)
                    expect(devis.Id_Remise).toBe(null)
                    expect(Number(devis.Prix_HT)).toBe(135)
                    expect(Number(devis.Prix_TTC)).toBe(148.5)
                })

                test("Brunch - Petit salé", async () => {
                    const estimation = await Estimations.findOne({
                        where : {
                            Id_Estimation : 6
                        },
                        include : [
                            { model : Clients },
                            { model : Formules, as : 'Formule_Aperitif' },
                            { model : Formules, as : 'Formule_Cocktail' },
                            { model : Formules, as : 'Formule_Box' },
                            { model : Formules, as : 'Formule_Brunch' }
                        ]
                    })

                    const devis = await createDevis(estimation)
                    devisCreated.push(devis.Id_Devis)

                    expect(devis.Id_Client).toBe(5)
                    expect(moment.utc(devis.Date_Evenement).toString()).toBe(moment.utc('2020-08-27 19:00:00').toString())
                    expect(devis.Adresse_Livraison).toBe('adresse Facturation Client Test')
                    expect(devis.Id_Estimation).toBe(6)
                    expect(devis.Id_Formule_Aperitif).toBe(null)
                    expect(devis.Id_Formule_Cocktail).toBe(null)
                    expect(devis.Id_Formule_Box).toBe(null)
                    expect(devis.Id_Formule_Brunch).toBe(6)
                    expect(devis.Commentaire).toBe(null)
                    expect(devis.Statut).toBe('En cours')
                    expect(devis.Liste_Options).toBe(null)
                    expect(devis.Id_Remise).toBe(null)
                    expect(Number(devis.Prix_HT)).toBe(240.92)
                    expect(Number(devis.Prix_TTC)).toBe(265.01)
                })

                test("Brunch - Grand salé", async () => {
                    const estimation = await Estimations.findOne({
                        where : {
                            Id_Estimation : 7
                        },
                        include : [
                            { model : Clients },
                            { model : Formules, as : 'Formule_Aperitif' },
                            { model : Formules, as : 'Formule_Cocktail' },
                            { model : Formules, as : 'Formule_Box' },
                            { model : Formules, as : 'Formule_Brunch' }
                        ]
                    })

                    const devis = await createDevis(estimation)
                    devisCreated.push(devis.Id_Devis)

                    expect(devis.Id_Client).toBe(5)
                    expect(moment.utc(devis.Date_Evenement).toString()).toBe(moment.utc('2020-08-27 19:00:00').toString())
                    expect(devis.Adresse_Livraison).toBe('adresse Facturation Client Test')
                    expect(devis.Id_Estimation).toBe(7)
                    expect(devis.Id_Formule_Aperitif).toBe(null)
                    expect(devis.Id_Formule_Cocktail).toBe(null)
                    expect(devis.Id_Formule_Box).toBe(null)
                    expect(devis.Id_Formule_Brunch).toBe(7)
                    expect(devis.Commentaire).toBe(null)
                    expect(devis.Statut).toBe('En cours')
                    expect(devis.Liste_Options).toBe(null)
                    expect(devis.Id_Remise).toBe(null)
                    expect(Number(devis.Prix_HT)).toBe(396.34)
                    expect(Number(devis.Prix_TTC)).toBe(435.97)
                })

                test("Brunch - Petit sucré", async () => {
                    const estimation = await Estimations.findOne({
                        where : {
                            Id_Estimation : 8
                        },
                        include : [
                            { model : Clients },
                            { model : Formules, as : 'Formule_Aperitif' },
                            { model : Formules, as : 'Formule_Cocktail' },
                            { model : Formules, as : 'Formule_Box' },
                            { model : Formules, as : 'Formule_Brunch' }
                        ]
                    })

                    const devis = await createDevis(estimation)
                    devisCreated.push(devis.Id_Devis)

                    expect(devis.Id_Client).toBe(5)
                    expect(moment.utc(devis.Date_Evenement).toString()).toBe(moment.utc('2020-08-27 19:00:00').toString())
                    expect(devis.Adresse_Livraison).toBe('adresse Facturation Client Test')
                    expect(devis.Id_Estimation).toBe(8)
                    expect(devis.Id_Formule_Aperitif).toBe(null)
                    expect(devis.Id_Formule_Cocktail).toBe(null)
                    expect(devis.Id_Formule_Box).toBe(null)
                    expect(devis.Id_Formule_Brunch).toBe(8)
                    expect(devis.Commentaire).toBe(null)
                    expect(devis.Statut).toBe('En cours')
                    expect(devis.Liste_Options).toBe(null)
                    expect(devis.Id_Remise).toBe(null)
                    expect(Number(devis.Prix_HT)).toBe(132.24)
                    expect(Number(devis.Prix_TTC)).toBe(145.46)
                })

                test("Brunch - Grand sucré", async () => {
                    const estimation = await Estimations.findOne({
                        where : {
                            Id_Estimation : 9
                        },
                        include : [
                            { model : Clients },
                            { model : Formules, as : 'Formule_Aperitif' },
                            { model : Formules, as : 'Formule_Cocktail' },
                            { model : Formules, as : 'Formule_Box' },
                            { model : Formules, as : 'Formule_Brunch' }
                        ]
                    })

                    const devis = await createDevis(estimation)
                    devisCreated.push(devis.Id_Devis)

                    expect(devis.Id_Client).toBe(5)
                    expect(moment.utc(devis.Date_Evenement).toString()).toBe(moment.utc('2020-08-27 19:00:00').toString())
                    expect(devis.Adresse_Livraison).toBe('adresse Facturation Client Test')
                    expect(devis.Id_Estimation).toBe(9)
                    expect(devis.Id_Formule_Aperitif).toBe(null)
                    expect(devis.Id_Formule_Cocktail).toBe(null)
                    expect(devis.Id_Formule_Box).toBe(null)
                    expect(devis.Id_Formule_Brunch).toBe(9)
                    expect(devis.Commentaire).toBe(null)
                    expect(devis.Statut).toBe('En cours')
                    expect(devis.Liste_Options).toBe(null)
                    expect(devis.Id_Remise).toBe(null)
                    expect(Number(devis.Prix_HT)).toBe(215.84)
                    expect(Number(devis.Prix_TTC)).toBe(237.42)
                })

                test("Brunch - Grand salé/Grand sucré", async () => {
                    const estimation = await Estimations.findOne({
                        where : {
                            Id_Estimation : 10
                        },
                        include : [
                            { model : Clients },
                            { model : Formules, as : 'Formule_Aperitif' },
                            { model : Formules, as : 'Formule_Cocktail' },
                            { model : Formules, as : 'Formule_Box' },
                            { model : Formules, as : 'Formule_Brunch' }
                        ]
                    })

                    const devis = await createDevis(estimation)
                    devisCreated.push(devis.Id_Devis)

                    expect(devis.Id_Client).toBe(5)
                    expect(moment.utc(devis.Date_Evenement).toString()).toBe(moment.utc('2020-08-27 19:00:00').toString())
                    expect(devis.Adresse_Livraison).toBe('adresse Facturation Client Test')
                    expect(devis.Id_Estimation).toBe(10)
                    expect(devis.Id_Formule_Aperitif).toBe(null)
                    expect(devis.Id_Formule_Cocktail).toBe(null)
                    expect(devis.Id_Formule_Box).toBe(null)
                    expect(devis.Id_Formule_Brunch).toBe(10)
                    expect(devis.Commentaire).toBe(null)
                    expect(devis.Statut).toBe('En cours')
                    expect(devis.Liste_Options).toBe(null)
                    expect(devis.Id_Remise).toBe(null)
                    expect(Number(devis.Prix_HT)).toBe(612.18)
                    expect(Number(devis.Prix_TTC)).toBe(673.4)
                })

                test("Aperitif, Cocktail, Box, Brunch", async () => {
                    const estimation = await Estimations.findOne({
                        where : {
                            Id_Estimation : 11
                        },
                        include : [
                            { model : Clients },
                            { model : Formules, as : 'Formule_Aperitif' },
                            { model : Formules, as : 'Formule_Cocktail' },
                            { model : Formules, as : 'Formule_Box' },
                            { model : Formules, as : 'Formule_Brunch' }
                        ]
                    })

                    const devis = await createDevis(estimation)
                    devisCreated.push(devis.Id_Devis)

                    expect(devis.Id_Client).toBe(5)
                    expect(moment.utc(devis.Date_Evenement).toString()).toBe(moment.utc('2020-08-27 19:00:00').toString())
                    expect(devis.Adresse_Livraison).toBe('adresse Facturation Client Test')
                    expect(devis.Id_Estimation).toBe(11)
                    expect(devis.Id_Formule_Aperitif).toBe(3)
                    expect(devis.Id_Formule_Cocktail).toBe(4)
                    expect(devis.Id_Formule_Box).toBe(5)
                    expect(devis.Id_Formule_Brunch).toBe(6)
                    expect(devis.Commentaire).toBe(null)
                    expect(devis.Statut).toBe('En cours')
                    expect(devis.Liste_Options).toBe(null)
                    expect(devis.Id_Remise).toBe(null)
                    expect(Number(devis.Prix_HT)).toBe(645.47)
                    expect(Number(devis.Prix_TTC)).toBe(710.02)
                })
            })
        })

        describe("getListInfosDevis", () => {

        })

        describe("validate", () => {
            beforeAll(async () => {
                await Formules.update(
                    {
                        Liste_Id_Recettes_Salees : null,
                        Liste_Id_Recettes_Sucrees : null,
                        Liste_Id_Recettes_Boissons : null
                    },
                    {
                        where : {
                            Id_Formule : [3, 4, 5, 10]
                        }
                    }
                )
            })

            test('Erreur - Mauvais ID', async () => {
                expect.assertions(1)
                try {
                    await validate(40000)
                }
                catch(e) {
                    expect(e).toBe('Le devis demandé n\'existe pas.')
                }
            })

            test('Erreur - Recettes Aperitif', async () => {
                const devis = await Devis.findOne({
                    where : {
                        Id_Devis : 2
                    },
                    include : [
                        { model : Clients },
                        { model : Formules, as : 'Formule_Aperitif' },
                        { model : Formules, as : 'Formule_Cocktail' },
                        { model : Formules, as : 'Formule_Box' },
                        { model : Formules, as : 'Formule_Brunch' }
                    ]
                })

                expect.assertions(1)
                try {
                    await validate(devis.Id_Devis)
                }
                catch(e) {
                    expect(e).toMatch('Les recettes de la formule Apéritif ne sont pas toutes renseignées.')
                }

                devis.Formule_Aperitif.Liste_Id_Recettes_Salees = "1;1;1;1;2;2;4;"
                await devis.Formule_Aperitif.save()
            })

            test('Erreur - Recettes Cocktail', async () => {
                const devis = await Devis.findOne({
                    where : {
                        Id_Devis : 2
                    },
                    include : [
                        { model : Clients },
                        { model : Formules, as : 'Formule_Aperitif' },
                        { model : Formules, as : 'Formule_Cocktail' },
                        { model : Formules, as : 'Formule_Box' },
                        { model : Formules, as : 'Formule_Brunch' }
                    ]
                })

                expect.assertions(2)
                try {
                    await validate(devis.Id_Devis)
                }
                catch(e) {
                    expect(e).toMatch('Les recettes salées de la formule Cocktail ne sont pas toutes renseignées.')
                }

                devis.Formule_Cocktail.Liste_Id_Recettes_Salees = "1;1;1;2;2;2;4;4;4;"
                await devis.Formule_Cocktail.save()

                try {
                    await validate(devis.Id_Devis)
                }
                catch(e) {
                    expect(e).toMatch('Les recettes sucrées de la formule Cocktail ne sont pas toutes renseignées.')
                }

                devis.Formule_Cocktail.Liste_Id_Recettes_Sucrees = "5;6;8;"
                await devis.Formule_Cocktail.save()
            })

            test('Erreur - Recettes Box (Formule identique pour tous)', async () => {
                const devis = await Devis.findOne({
                    where : {
                        Id_Devis : 2
                    },
                    include : [
                        { model : Clients },
                        { model : Formules, as : 'Formule_Aperitif' },
                        { model : Formules, as : 'Formule_Cocktail' },
                        { model : Formules, as : 'Formule_Box' },
                        { model : Formules, as : 'Formule_Brunch' }
                    ]
                })

                expect.assertions(2)
                try {
                    await validate(devis.Id_Devis)
                }
                catch(e) {
                    expect(e).toMatch('Les recettes salées de la formule Box ne sont pas toutes renseignées.')
                }

                devis.Formule_Box.Liste_Id_Recettes_Salees = "1;2;4;"
                await devis.Formule_Box.save()
                
                try {
                    await validate(devis.Id_Devis)
                }
                catch(e) {
                    expect(e).toMatch('Les recettes sucrées de la formule Box ne sont pas toutes renseignées.')
                }
            })

            test('Erreur - Recettes Box (Formule individuelle)', async () => {
                const devis = await Devis.findOne({
                    where : {
                        Id_Devis : 2
                    },
                    include : [
                        { model : Clients },
                        { model : Formules, as : 'Formule_Aperitif' },
                        { model : Formules, as : 'Formule_Cocktail' },
                        { model : Formules, as : 'Formule_Box' },
                        { model : Formules, as : 'Formule_Brunch' }
                    ]
                })

                devis.Formule_Box.Liste_Id_Recettes_Salees = "1;2;4;1;3;3;1;2;4;1;2;4;4;2;4;1;2;1;1;2;4;4;4;4;"
                devis.Formule_Box.Liste_Id_Recettes_Sucrees = "1;2;3;4;1;2;3;4;"
                await devis.Formule_Box.save()

                expect.assertions(2)
                try {
                    await validate(devis.Id_Devis)
                }
                catch(e) {
                    expect(e).toMatch('Les recettes salées de la formule Box ne sont pas toutes renseignées.')
                }

                devis.Formule_Box.Liste_Id_Recettes_Salees = "1;2;4;1;2;4;1;3;3;1;2;4;1;2;4;4;2;4;1;2;1;1;2;4;4;4;4;"
                await devis.Formule_Box.save()
                
                try {
                    await validate(devis.Id_Devis)
                }
                catch(e) {
                    expect(e).toMatch('Les recettes sucrées de la formule Box ne sont pas toutes renseignées.')
                }

                devis.Formule_Box.Liste_Id_Recettes_Sucrees = "1;2;3;4;1;2;3;4;1;"
                await devis.Formule_Box.save()
            })

            test('Erreur - Recettes Brunch', async () => {
                const devis = await Devis.findOne({
                    where : {
                        Id_Devis : 2
                    },
                    include : [
                        { model : Clients },
                        { model : Formules, as : 'Formule_Aperitif' },
                        { model : Formules, as : 'Formule_Cocktail' },
                        { model : Formules, as : 'Formule_Box' },
                        { model : Formules, as : 'Formule_Brunch' }
                    ]
                })

                expect.assertions(2)
                try {
                    await validate(devis.Id_Devis)
                }
                catch(e) {
                    expect(e).toMatch('Les recettes salées de la formule Brunch ne sont pas toutes renseignées.')
                }

                devis.Formule_Brunch.Liste_Id_Recettes_Salees = "1;1;1;1;2;2;3;4;"
                await devis.Formule_Brunch.save()
                
                try {
                    await validate(devis.Id_Devis)
                }
                catch(e) {
                    expect(e).toMatch('Les recettes sucrées de la formule Brunch ne sont pas toutes renseignées.')
                }

                devis.Formule_Brunch.Liste_Id_Recettes_Sucrees = "1;2;4;4;"
                await devis.Formule_Brunch.save()
            })

            test("Valide devis avec Aperitif, Cocktail, Box et Brunch", async () => {
                const devis = await Devis.findOne({
                    where : {
                        Id_Devis : 2
                    },
                    include : [
                        { model : Clients },
                        { model : Formules, as : 'Formule_Aperitif' },
                        { model : Formules, as : 'Formule_Cocktail' },
                        { model : Formules, as : 'Formule_Box' },
                        { model : Formules, as : 'Formule_Brunch' }
                    ]
                })

                const validatedDevis = await validate(devis.Id_Devis)

                expect(validatedDevis.Id_Devis).toBe(devis.Id_Devis)
            })
        })
    })

    describe("Routes", () => {
        describe("Patch - modifie devis", () => {
            let devis = undefined

            beforeEach(() => {
                devis = {
                    client : {
                        Nom_Prenom: "Client Test",
                        Adresse_Facturation: "adresse Facturation Client Test",
                        Email: "client-test@mail.com",
                        Telephone: "0000000000",
                        Type: "Professionnel"
                    },
                    Date_Evenement: "2020-08-27 19:00",
                    Adresse_Livraison: "",
                    Formule_Aperitif : {
                        isAperitif: true,
                        Nb_Convives: "9",
                        Nb_Pieces_Salees: "7",
                        Liste_Id_Recettes_Salees: "1;1;1;1;1;1",
                        Liste_Id_Recettes_Boissons: "1;1"
                    },
                    Formule_Cocktail : {
                        isCocktail: true,
                        Nb_Convives: "9",
                        Nb_Pieces_Salees: "9",
                        Nb_Pieces_Sucrees: "3",
                        Liste_Id_Recettes_Salees: "1;1;1;1;1;1;1;1",
                        Liste_Id_Recettes_Sucrees: "1;1",
                        Liste_Id_Recettes_Boissons: "2;2"
                    },
                    Formule_Box : {
                        isBox: true,
                        Nb_Convives: "9",
                        Liste_Id_Recettes_Salees: "1;2;3",
                        Liste_Id_Recettes_Sucrees: "4",
                        Liste_Id_Recettes_Boissons: "2;1"
                    },
                    Formule_Brunch : {
                        isBrunch: true,
                        isBrunchSale: true,
                        isBrunchSucre: true,
                        Nb_Convives: "19",
                        Nb_Pieces_Salees: "8",
                        Nb_Pieces_Sucrees: "4",
                        Liste_Id_Recettes_Salees: "1;1;1;1;1;1;1",
                        Liste_Id_Recettes_Sucrees: "2;2;2",
                        Liste_Id_Recettes_Boissons: "2;2"
                    },
                    Commentaire: "",
                    Liste_Options: "",
                    Remise: null
                }
            })

            test("Erreur - Pas d'ID", async () => {
                const response = await request(app).patch('/devis/undefined').set('Cookie', cookie).send().expect(200)
                expect(response.body.infos.error).toBe("Une erreur s'est produite, veuillez réessayer plus tard")
            })

            describe("Sans devis existant", () => {
                beforeEach(() => {
                    devis.isCreation =  "true"
                    devis.Id_Devis =  undefined
                })

                test("Crée un devis complet", async () => {
                    const response = await request(app).patch(`/devis/${devis.Id_Devis}`).set('Cookie', cookie).send(devis).expect(200)

                    const devisSent = response.body.devis
                    const infos = response.body.infos
                    devisCreated.push(devisSent.Id_Devis)

                    expect(infos.message).toBe('Le devis a bien été créé.')
                    expect(devisSent.Id_Client).toBe(5)
                    expect(moment.utc(devisSent.Date_Evenement).toString()).toBe(moment.utc('2020-08-27 19:00').toString())
                    expect(devisSent.Adresse_Livraison).toBe('adresse Facturation Client Test')
                    expect(devisSent.Id_Estimation).toBe(null)
                    expect(typeof devisSent.Id_Formule_Aperitif).toBe("number")
                    expect(typeof devisSent.Id_Formule_Cocktail).toBe("number")
                    expect(typeof devisSent.Id_Formule_Box).toBe("number")
                    expect(typeof devisSent.Id_Formule_Brunch).toBe("number")
                    expect(devisSent.Commentaire).toBe('')
                    expect(devisSent.Statut).toBe('En cours')
                    expect(devisSent.Liste_Options).toBe('')
                    expect(devisSent.Id_Remise).toBe(null)
                    expect(Number(devisSent.Prix_HT)).toBe(1016.73)
                    expect(Number(devisSent.Prix_TTC)).toBe(1118.4)
                })

                test("Crée un devis complet avec options", async () => {
                    devis.Liste_Options = '8;10'

                    const response = await request(app).patch(`/devis/${devis.Id_Devis}`).set('Cookie', cookie).send(devis).expect(200)

                    const devisSent = response.body.devis
                    const infos = response.body.infos
                    devisCreated.push(devisSent.Id_Devis)

                    expect(infos.message).toBe('Le devis a bien été créé.')
                    expect(devisSent.Id_Client).toBe(5)
                    expect(moment.utc(devisSent.Date_Evenement).toString()).toBe(moment.utc('2020-08-27 19:00').toString())
                    expect(devisSent.Adresse_Livraison).toBe('adresse Facturation Client Test')
                    expect(devisSent.Id_Estimation).toBe(null)
                    expect(typeof devisSent.Id_Formule_Aperitif).toBe("number")
                    expect(typeof devisSent.Id_Formule_Cocktail).toBe("number")
                    expect(typeof devisSent.Id_Formule_Box).toBe("number")
                    expect(typeof devisSent.Id_Formule_Brunch).toBe("number")
                    expect(devisSent.Commentaire).toBe('')
                    expect(devisSent.Statut).toBe('En cours')
                    expect(devisSent.Liste_Options).toBe('8;10')
                    expect(devisSent.Id_Remise).toBe(null)
                    expect(Number(devisSent.Prix_HT)).toBe(1206.73)
                    expect(Number(devisSent.Prix_TTC)).toBe(1327.4)
                })

                test("Crée un devis complet avec remise", async () => {
                    devis.Remise = {
                        Nom : "Réduction client régulier (50€)",
                        IsPourcent : false,
                        Valeur : 50
                    }

                    let response = await request(app).patch(`/devis/${devis.Id_Devis}`).set('Cookie', cookie).send(devis).expect(200)

                    let devisSent = response.body.devis
                    let infos = response.body.infos
                    devisCreated.push(devisSent.Id_Devis)

                    expect(infos.message).toBe('Le devis a bien été créé.')
                    expect(devisSent.Id_Client).toBe(5)
                    expect(moment.utc(devisSent.Date_Evenement).toString()).toBe(moment.utc('2020-08-27 19:00').toString())
                    expect(devisSent.Adresse_Livraison).toBe('adresse Facturation Client Test')
                    expect(devisSent.Id_Estimation).toBe(null)
                    expect(typeof devisSent.Id_Formule_Aperitif).toBe("number")
                    expect(typeof devisSent.Id_Formule_Cocktail).toBe("number")
                    expect(typeof devisSent.Id_Formule_Box).toBe("number")
                    expect(typeof devisSent.Id_Formule_Brunch).toBe("number")
                    expect(devisSent.Commentaire).toBe('')
                    expect(devisSent.Statut).toBe('En cours')
                    expect(devisSent.Liste_Options).toBe('')
                    expect(typeof devisSent.Id_Remise).toBe("number")
                    expect(Number(devisSent.Prix_HT)).toBe(966.73)
                    expect(Number(devisSent.Prix_TTC)).toBe(1063.4)


                    devis.Remise = {
                        Nom : "Remise de Pâcques",
                        IsPourcent : true,
                        Valeur : 10
                    }

                    response = await request(app).patch(`/devis/${devis.Id_Devis}`).set('Cookie', cookie).send(devis).expect(200)

                    devisSent = response.body.devis
                    infos = response.body.infos
                    devisCreated.push(devisSent.Id_Devis)

                    expect(infos.message).toBe('Le devis a bien été créé.')
                    expect(devisSent.Id_Client).toBe(5)
                    expect(moment.utc(devisSent.Date_Evenement).toString()).toBe(moment.utc('2020-08-27 19:00').toString())
                    expect(devisSent.Adresse_Livraison).toBe('adresse Facturation Client Test')
                    expect(devisSent.Id_Estimation).toBe(null)
                    expect(typeof devisSent.Id_Formule_Aperitif).toBe("number")
                    expect(typeof devisSent.Id_Formule_Cocktail).toBe("number")
                    expect(typeof devisSent.Id_Formule_Box).toBe("number")
                    expect(typeof devisSent.Id_Formule_Brunch).toBe("number")
                    expect(devisSent.Commentaire).toBe('')
                    expect(devisSent.Statut).toBe('En cours')
                    expect(devisSent.Liste_Options).toBe('')
                    expect(typeof devisSent.Id_Remise).toBe("number")
                    expect(Number(devisSent.Prix_HT)).toBe(915.06)
                    expect(Number(devisSent.Prix_TTC)).toBe(1006.56)
                })

                test("Erreur pour créer un devis complet", async () => {
                    devis.Formule_Aperitif.Nb_Convives = 1

                    const response = await request(app).patch(`/devis/${devis.Id_Devis}`).set('Cookie', cookie).send(devis).expect(200)

                    const devisSent = response.body.devis
                    const infos = response.body.infos

                    expect(devisSent).toBe(undefined)
                    expect(infos.error).toBe('Le nombre de convives pour la formule Apéritif est insuffisant.')
                })

                test("Erreur Pas d'adresse de facturation", async () => {
                    devis.client.Adresse_Facturation = ''

                    const response = await request(app).patch(`/devis/${devis.Id_Devis}`).set('Cookie', cookie).send(devis).expect(200)
                    const infos = response.body.infos
                    
                    expect(infos.error).toBe("L'adresse de facturation doit être renseignée.")
                })
            })

            describe("Avec devis existant", () => {
                beforeEach((done) => {
                    devis.isCreation =  "false"
                    devis.Id_Devis =  "2"
                    done()
                })

                test("Modifie devis complet (avec modifications)", async () => {                    
                    devis.Formule_Aperitif.Nb_Convives = 10
                    devis.Formule_Cocktail.Nb_Convives = 10
                    devis.Formule_Box.Nb_Convives = 10
                    devis.Formule_Brunch.Nb_Convives = 20

                    const response = await request(app).patch(`/devis/${devis.Id_Devis}`).set('Cookie', cookie).send(devis).expect(200)

                    const devisSent = response.body.devis
                    const infos = response.body.infos

                    expect(infos.message).toBe('Le devis a bien été modifié.')
                    expect(devisSent.Id_Client).toBe(5)
                    expect(moment.utc(devisSent.Date_Evenement).toString()).toBe(moment.utc('2020-08-27 19:00').toString())
                    expect(devisSent.Adresse_Livraison).toBe('adresse Facturation Client Test')
                    expect(devisSent.Id_Estimation).toBe(null)
                    expect(typeof devisSent.Id_Formule_Aperitif).toBe("number")
                    expect(devisSent.Formule_Aperitif.Nb_Convives).toBe(10)
                    expect(typeof devisSent.Id_Formule_Cocktail).toBe("number")
                    expect(devisSent.Formule_Cocktail.Nb_Convives).toBe(10)
                    expect(typeof devisSent.Id_Formule_Box).toBe("number")
                    expect(devisSent.Formule_Box.Nb_Convives).toBe(10)
                    expect(typeof devisSent.Id_Formule_Brunch).toBe("number")
                    expect(devisSent.Formule_Brunch.Nb_Convives).toBe(20)
                    expect(devisSent.Commentaire).toBe('')
                    expect(devisSent.Statut).toBe('En cours')
                    expect(devisSent.Liste_Options).toBe(null)
                    expect(devisSent.Id_Remise).toBe(null)
                    expect(Number(devisSent.Prix_HT)).toBe(1093.9)
                    expect(Number(devisSent.Prix_TTC)).toBe(1203.29)

                    devis.client.Adresse_Facturation = ''
                    devis.Formule_Aperitif.Nb_Convives = 9
                    devis.Formule_Cocktail.Nb_Convives = 9
                    devis.Formule_Box.Nb_Convives = 9
                    devis.Formule_Brunch.Nb_Convives = 19

                    await request(app).patch(`/devis/${devis.Id_Devis}`).set('Cookie', cookie).send(devis).expect(200)
                    expect(response.body.infos.error).toBe(undefined)
                    expect(response.body.devis.Client.Adresse_Facturation).toBe('adresse Facturation Client Test')
                })

                test("Modifie devis complet (sans modification)", async () => {
                    await request(app).patch(`/devis/${devis.Id_Devis}`).set('Cookie', cookie).send(devis).expect(200)
                })

                test("Erreur pour modifier devis complet", async () => {
                    devis.Formule_Aperitif.Nb_Convives = 1

                    const response = await request(app).patch(`/devis/${devis.Id_Devis}`).set('Cookie', cookie).send(devis).expect(200)

                    const devisSent = response.body.devis
                    const infos = response.body.infos
                    const devisDB = await Devis.findOne({
                        where : { 
                            Id_Devis : 2 
                        },
                        include : [
                            { model : Clients },
                            { model : Formules, as : 'Formule_Aperitif' },
                            { model : Formules, as : 'Formule_Cocktail' },
                            { model : Formules, as : 'Formule_Box' },
                            { model : Formules, as : 'Formule_Brunch' }
                        ]
                    })

                    expect(infos.error).toBe('Le nombre de convives pour la formule Apéritif est insuffisant.')
                    expect(devisSent.Id_Devis).toBe(2)
                    expect(devisDB.Formule_Aperitif.Nb_Convives).toBe(9)
                    expect(devisDB.Formule_Cocktail.Nb_Convives).toBe(9)
                    expect(devisDB.Formule_Box.Nb_Convives).toBe(9)
                    expect(devisDB.Formule_Brunch.Nb_Convives).toBe(19)
                    expect(Number(devisDB.Prix_HT)).toBe(1016.73)
                    expect(Number(devisDB.Prix_TTC)).toBe(1118.4)
                })
            })
        })
    })
})