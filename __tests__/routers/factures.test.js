/* global describe, beforeAll, beforeEach, afterAll, afterEach, test, expect */
const request = require('supertest')
const app = require('../../src/app')
const { Factures, Devis } = global.db
const moment = require('moment')
const { formatNumeroFacture, createFacture } = require('../../src/routers/factures')

describe("Router Factures", () => {
    let cookie = undefined

    beforeAll(async () => {
        const response = await request(app).post('/authentification/login').send({ password : 'demo@2020crm-CMS' }).expect(302)
        
        cookie = response.header['set-cookie']
    })
    
    describe("Fonctions indépendantes", () => {
        test("formatNumeroFacture", () => {
            expect(formatNumeroFacture(1)).toBe('0001')
            expect(formatNumeroFacture(10)).toBe('0010')
            expect(formatNumeroFacture(100)).toBe('0100')
            expect(formatNumeroFacture(1000)).toBe('1000')
            expect(formatNumeroFacture(10000)).toBe('10000')
            expect(formatNumeroFacture(100000)).toBe('100000')
        })

        describe("createFacture", () => {
            const idFacturesCreated = []
            afterEach(async () => {
                await Factures.update(
                    {
                        Statut : 'Annulée'
                    },
                    {
                        where : {
                            Id_Facture : idFacturesCreated
                        }
                    }
                )
            })

            test("Echoue car la devis est incorrect", async () => {
                expect.assertions(3)

                try {
                    await createFacture(undefined)
                }
                catch(error) {
                    expect(error).toBe('Une erreur est survenue lors de la création de la facture.')
                }

                let devis = await Devis.findOne({
                    where : {
                        Id_Devis : 46000
                    }
                })
                try {
                    await createFacture(devis)
                }
                catch(error) {
                    expect(error).toBe('Une erreur est survenue lors de la création de la facture.')
                }

                devis = {
                    Id_Devis : 1
                }
                try {
                    await createFacture(devis)
                }
                catch(error) {
                    expect(error).toBe('Une erreur est survenue lors de la création de la facture.')
                }
            })

            test("Echoue car facture existente pour ce devis", async () => {
                let devis = await Devis.findOne({
                    where : {
                        Id_Devis : 1
                    }
                })
                
                const facture = await createFacture(devis)
                idFacturesCreated.push(facture.Id_Facture)

                expect.assertions(1)
                try {
                    await createFacture(devis)
                }
                catch(error) {
                    expect(error).toMatch('correspond déjà au devis')
                }
            })

            test("Crée une facture", async () => {
                const devis = await Devis.findOne({
                    where : {
                        Id_Devis : 1
                    }
                })
    
                const facture = await createFacture(devis)
                idFacturesCreated.push(facture.Id_Facture)

                expect(facture.Id_Client).toBe(devis.Id_Client)
                expect(facture.Date_Evenement).toBe(devis.Date_Evenement)
                expect(facture.Adresse_Livraison).toBe(devis.Adresse_Livraison)
                expect(facture.Id_Devis).toBe(devis.Id_Devis)
                expect(facture.Id_Formule_Aperitif).toBe(devis.Id_Formule_Aperitif)
                expect(facture.Id_Formule_Cocktail).toBe(devis.Id_Formule_Cocktail)
                expect(facture.Id_Formule_Box).toBe(devis.Id_Formule_Box)
                expect(facture.Id_Formule_Brunch).toBe(devis.Id_Formule_Brunch)
                expect(facture.Commentaire).toBe(devis.Commentaire)
                expect(facture.Statut).toBe('En attente')
                expect(facture.Liste_Options).toBe(devis.Liste_Options)
                expect(facture.Id_Remise).toBe(devis.Id_Remise)
                expect(facture.Prix_HT).toBe(devis.Prix_HT)
                expect(facture.Prix_TTC).toBe(devis.Prix_TTC)
                expect(facture.Acompte).toBe(0)
                expect(facture.Reste_A_Payer).toBe(facture.Prix_TTC)
                expect(facture.Paiement_En_Retard).toBe('Non')
                expect(facture.Nb_Relances).toBe(0)
                expect(facture.Date_Derniere_Relance).toBe(null)
            })
        })
    })

    describe("Routes", () => {
        let realFacture = undefined

        const annulefactures = async () => {
            await Factures.update(
                {
                    Statut : 'Annulée'
                },
                {
                    where : {
                        Id_Devis : 1
                    }
                }
            )
        }

        beforeAll(async () => {
            const devis = await Devis.findOne({
                where : {
                    Id_Devis : 1
                }
            })

            realFacture = await createFacture(devis)
        })

        afterAll(async () => {
            await annulefactures()
        })

        describe("get /factures/Id_Facture", () => {
            beforeEach(async () => {
                await annulefactures()
            })

            test("Id_Facture = undefined", async () => {
                const response = await request(app).get(`/factures/undefined`).set('Cookie', cookie).send().expect(200)
                const { infos, facture } = response.body

                expect(infos.error).toBe("L'identifiant est incorrect ou la facture n'existe pas.")
                expect(facture).toBe(undefined)
            })

            test("Id_Facture = 0", async () => {
                const response = await request(app).get(`/factures/0`).set('Cookie', cookie).send().expect(200)
                const { infos, facture } = response.body

                expect(infos.error).toBe("L'identifiant est incorrect ou la facture n'existe pas.")
                expect(facture).toBe(undefined)
            })

            test("Id_Facture = inconnu", async () => {
                const response = await request(app).get(`/factures/46000`).set('Cookie', cookie).send().expect(200)
                const { infos, facture } = response.body

                expect(infos.error).toBe("L'identifiant est incorrect ou la facture n'existe pas.")
                expect(facture).toBe(undefined)
            })

            test("Obtient la facture demandée", async () => {
                const response = await request(app).get(`/factures/${realFacture.Id_Facture}`).set('Cookie', cookie).send().expect(200)
                const { infos, facture } = response.body

                expect(infos).toBe(undefined)
                expect(facture.Id_Facture).toBe(realFacture.Id_Facture)
                expect(facture.Numero_Facture).toBe(realFacture.Numero_Facture)
            })
        })

        describe("patch /factures/Id_Facture", () => {
            test("Id_Facture = undefined", async () => {
                const response = await request(app).patch(`/factures/undefined`).set('Cookie', cookie).send().expect(200)
                const { infos, facture } = response.body

                expect(infos.error).toBe("L'identifiant est incorrect ou la facture n'existe pas.")
                expect(facture).toBe(undefined)
            })

            test("Id_Facture = 0", async () => {
                const response = await request(app).patch(`/factures/0`).set('Cookie', cookie).send().expect(200)
                const { infos, facture } = response.body

                expect(infos.error).toBe("L'identifiant est incorrect ou la facture n'existe pas.")
                expect(facture).toBe(undefined)
            })

            test("Id_Facture = inconnu", async () => {
                const response = await request(app).patch(`/factures/46000`).set('Cookie', cookie).send().expect(200)
                const { infos, facture } = response.body

                expect(infos.error).toBe("L'identifiant est incorrect ou la facture n'existe pas.")
                expect(facture).toBe(undefined)
            })

            test("Echoue avec statut incorrect", async () => {
                const response = await request(app).patch(`/factures/${realFacture.Id_Facture}`).set('Cookie', cookie).send({
                    Statut : 'Annulée'
                }).expect(200)

                const { infos } = response.body

                expect(infos.error).toBe("Le statut de la facture est incorrect.")
            })

            test("Echoue avec acompte négatif", async () => {
                const response = await request(app).patch(`/factures/${realFacture.Id_Facture}`).set('Cookie', cookie).send({
                    Statut : 'En attente de paiement',
                    Acompte : -13
                }).expect(200)

                const { infos } = response.body

                expect(infos.error).toBe("La valeur de l'acompte ne peut pas être négative.")
            })

            test("Modifie la facture", async () => {
                let response = await request(app).patch(`/factures/${realFacture.Id_Facture}`).set('Cookie', cookie).send({
                    Statut : 'Payée',
                    Acompte : realFacture.Prix_TTC
                }).expect(200)

                let { infos, facture } = response.body

                expect(infos.error).toBe(undefined)
                expect(infos.message).toBe('La facture a bien été modifiée.')
                expect(facture.Statut).toBe('Payée')
                expect(facture.Acompte).toBe(realFacture.Prix_TTC)
                expect(facture.Reste_A_Payer).toBe(0)

                response = await request(app).patch(`/factures/${realFacture.Id_Facture}`).set('Cookie', cookie).send({
                    Statut : 'En attente de paiement',
                    Acompte : realFacture.Prix_TTC
                }).expect(200)

                infos = response.body.infos
                facture = response.body.facture

                expect(infos.error).toBe(undefined)
                expect(infos.message).toBe('La facture a bien été modifiée.')
                expect(facture.Statut).toBe('Payée')
                expect(facture.Acompte).toBe(realFacture.Prix_TTC)
                expect(facture.Reste_A_Payer).toBe(0)
            })
        })

        describe("patch /factures/archive/Id_Facture", () => {
            test("Id_Facture = undefined", async () => {
                const response = await request(app).patch(`/factures/archive/undefined`).set('Cookie', cookie).send().expect(200)
                const { infos, facture } = response.body

                expect(infos.error).toBe("L'identifiant est incorrect ou la facture n'existe pas.")
                expect(facture).toBe(undefined)
            })

            test("Id_Facture = 0", async () => {
                const response = await request(app).patch(`/factures/archive/0`).set('Cookie', cookie).send().expect(200)
                const { infos, facture } = response.body

                expect(infos.error).toBe("L'identifiant est incorrect ou la facture n'existe pas.")
                expect(facture).toBe(undefined)
            })

            test("Id_Facture = inconnu", async () => {
                const response = await request(app).patch(`/factures/archive/46000`).set('Cookie', cookie).send().expect(200)
                const { infos, facture } = response.body

                expect(infos.error).toBe("L'identifiant est incorrect ou la facture n'existe pas.")
                expect(facture).toBe(undefined)
            })

            test("Echoue car archive une facture annulée", async () => {
                await Factures.update(
                    {
                        Statut : 'Annulée'
                    },
                    {   
                        where : {
                            Id_Facture : realFacture.Id_Facture
                        }
                    }
                )

                const response = await request(app).patch(`/factures/archive/${realFacture.Id_Facture}`).set('Cookie', cookie).send().expect(200)

                const { infos, facture } = response.body

                expect(infos.error).toBe('La facture ne peut pas être archivée.')
                expect(facture).toBe(undefined)
            })

            test("Archive une facture", async () => {
                await Factures.update(
                    {
                        Statut : 'En attente'
                    },
                    {   
                        where : {
                            Id_Facture : realFacture.Id_Facture
                        }
                    }
                )

                const response = await request(app).patch(`/factures/archive/${realFacture.Id_Facture}`).set('Cookie', cookie).send().expect(200)

                const { infos, facture } = response.body

                expect(infos.message).toBe('La facture a bien été archivée.')
                expect(facture.Statut).toBe('Archivée')
            })
        })

        describe('get /factures/validate/Id_Facture/Numero_Facture', () => {
            test("Id_Facture = undefined", async () => {
                const response = await request(app).get(`/factures/validate/undefined/${realFacture.Numero_Facture}`).set('Cookie', cookie).send().expect(200)
                const { infos } = response.body

                expect(infos.error).toBe("L'identifiant est incorrect ou la facture n'existe pas.")
            })

            test("Id_Facture = 0", async () => {
                const response = await request(app).get(`/factures/validate/0/${realFacture.Numero_Facture}`).set('Cookie', cookie).send().expect(200)
                const { infos } = response.body

                expect(infos.error).toBe("L'identifiant est incorrect ou la facture n'existe pas.")
            })

            test("Id_Facture = inconnu", async () => {
                const response = await request(app).get(`/factures/validate/46000/${realFacture.Numero_Facture}`).set('Cookie', cookie).send().expect(200)
                const { infos } = response.body

                expect(infos.error).toBe("Le numéro de facture est incorrect.")
            })

            test("Numero_Facture = inconnu", async () => {
                const response = await request(app).get(`/factures/validate/${realFacture.Id_Facture}/021305498`).set('Cookie', cookie).send().expect(200)
                const { infos } = response.body

                expect(infos.error).toBe("Le numéro de facture est incorrect.")
            })

            test("Valide l'Id_Facture et le Numero_Facture", async () => {
                const response = await request(app).get(`/factures/validate/${realFacture.Id_Facture}/${realFacture.Numero_Facture}`).set('Cookie', cookie).send().expect(200)
                const { infos } = response.body

                expect(infos.message).toBe("ok")
            })
        })

        describe('post /factures/Id_Facture', () => {
            test("Id_Facture = undefined", async () => {
                const response = await request(app).post(`/factures/undefined`).set('Cookie', cookie).send().expect(200)
                const { infos } = response.body

                expect(infos.error).toBe("L'identifiant est incorrect ou la facture n'existe pas.")
            })

            test("Id_Facture = 0", async () => {
                const response = await request(app).post(`/factures/0`).set('Cookie', cookie).send().expect(200)
                const { infos } = response.body

                expect(infos.error).toBe("L'identifiant est incorrect ou la facture n'existe pas.")
            })

            test("Id_Facture = inconnu", async () => {
                const response = await request(app).post(`/factures/46000`).set('Cookie', cookie).send().expect(200)
                const { infos } = response.body

                expect(infos.error).toBe("L'identifiant est incorrect ou la facture n'existe pas.")
            })

            test("Echoue car facture déjà payée", async () => {
                await Factures.update(
                    {
                        Reste_A_Payer : 0
                    },
                    {
                        where : {
                            Id_Facture : realFacture.Id_Facture
                        }
                    }
                )

                const response = await request(app).post(`/factures/${realFacture.Id_Facture}`).set('Cookie', cookie).send().expect(200)
                const { infos } = response.body

                expect(infos.error).toBe('La facture a déjà été réglée.')
            })

            test("Envoie la relance", async () => {
                await Factures.update(
                    {
                        Reste_A_Payer : realFacture.Prix_TTC
                    },
                    {
                        where : {
                            Id_Facture : realFacture.Id_Facture
                        }
                    }
                )

                const response = await request(app).post(`/factures/${realFacture.Id_Facture}`).set('Cookie', cookie).send().expect(200)
                const { infos, facture } = response.body

                expect(infos.message).toBe('La relance a bien été envoyée.')
                expect(facture.Nb_Relances).toBe(1)
                expect(moment.utc(facture.Date_Derniere_Relance).format('DD/MM/YYYY')).toBe(moment.utc().format('DD/MM/YYYY'))
            })
        })

        describe('patch /factures/cancel/Id_Facture', () => {
            test("Id_Facture = undefined", async () => {
                const response = await request(app).patch(`/factures/cancel/undefined`).set('Cookie', cookie).send().expect(200)
                const { infos } = response.body

                expect(infos.error).toBe("L'identifiant est incorrect ou la facture n'existe pas.")
            })

            test("Id_Facture = 0", async () => {
                const response = await request(app).patch(`/factures/cancel/0`).set('Cookie', cookie).send().expect(200)
                const { infos } = response.body

                expect(infos.error).toBe("L'identifiant est incorrect ou la facture n'existe pas.")
            })

            test("Id_Facture = inconnu", async () => {
                const response = await request(app).patch(`/factures/cancel/46000`).set('Cookie', cookie).send().expect(200)
                const { infos } = response.body

                expect(infos.error).toBe("L'identifiant est incorrect ou la facture n'existe pas.")
            })

            test("Id_Facture = inconnu", async () => {
                const response = await request(app).patch(`/factures/cancel/${realFacture.Id_Facture}`).set('Cookie', cookie).send().expect(200)
                const { infos, facture, urlAvoir } = response.body

                expect(infos.message).toBe(`La facture ${realFacture.Numero_Facture} a été annulée.`)
                expect(facture.Statut).toBe('Annulée')
                expect(facture.Client.Dernier_Statut).toBe('Facture annulée')
                expect(urlAvoir).toBe(undefined)
            })
        })

        describe('delete /factures/id', () => {
            test("Id_Facture = undefined", async () => {
                const response = await request(app).delete(`/factures/undefined`).set('Cookie', cookie).send().expect(200)
                const { infos } = response.body

                expect(infos.error).toBe("L'identifiant est incorrect ou la facture n'existe pas.")
            })

            test("Id_Facture = 0", async () => {
                const response = await request(app).delete(`/factures/0`).set('Cookie', cookie).send().expect(200)
                const { infos } = response.body

                expect(infos.error).toBe("L'identifiant est incorrect ou la facture n'existe pas.")
            })

            test("Id_Facture = inconnu", async () => {
                const response = await request(app).delete(`/factures/46000`).set('Cookie', cookie).send().expect(200)
                const { infos } = response.body

                expect(infos.error).toBe("L'identifiant est incorrect ou la facture n'existe pas.")
            })
        })
    })
})