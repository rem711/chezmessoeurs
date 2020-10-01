const { Compteurs, Sequelize, sequelize } = global.db
const moment = require('moment')

const COMPTEUR_FACTURES_GENERALES = 'COMPTEUR_FACTURES_GENERALES'
const COMPTEUR_FACTURES_AVOIRS = 'COMPTEUR_FACTURES_AVOIRS'

let compteurFacturesGenerales = undefined
let compteurFacturesAvoirs = undefined

const isNewYear = (lastUpdate) => {
    const currentYear = moment().format('YYYY')
    const usedYear = moment(lastUpdate).format('YYYY')

    return currentYear > usedYear
}

const init = async() => {
    compteurFacturesGenerales = await Compteurs.findOne({
        where : {
            Nom_Compteur : COMPTEUR_FACTURES_GENERALES
        }
    })

    compteurFacturesAvoirs = await Compteurs.findOne({
        where : {
            Nom_Compteur : COMPTEUR_FACTURES_AVOIRS
        }
    })
}

const reset = async () => {
    if(isNewYear(compteurFacturesGenerales.Updated_At)) {
        compteurFacturesGenerales.Valeur_Compteur = 0
    }
    if(isNewYear(compteurFacturesAvoirs.Updated_At)) {
        compteurFacturesAvoirs.Valeur_Compteur = 0
    }

    await Promise.all([
        compteurFacturesGenerales.save(),
        compteurFacturesAvoirs.save()
    ])
}

const get = async (typeCompteur) => {
    if(compteurFacturesGenerales === undefined || compteurFacturesAvoirs === undefined) {
        await init()
    }

    if(typeCompteur !== COMPTEUR_FACTURES_GENERALES && typeCompteur !== COMPTEUR_FACTURES_AVOIRS) {
        throw `Impossible de récupérer le compteur ${typeCompteur}.`
    }

    await reset()

    let valeur = 0

    if(typeCompteur === COMPTEUR_FACTURES_GENERALES) {
        await sequelize.transaction({ 
            type : Sequelize.Transaction.TYPES.EXCLUSIVE 
        }, async (transaction) => {
            await compteurFacturesGenerales.increment('Valeur_Compteur')
            await compteurFacturesGenerales.reload()
            valeur = compteurFacturesGenerales.Valeur_Compteur
        })        
    }
    else if(typeCompteur === COMPTEUR_FACTURES_AVOIRS) {
        await sequelize.transaction({ 
            type : Sequelize.Transaction.TYPES.EXCLUSIVE 
        }, async (transaction) => {
            await compteurFacturesAvoirs.increment('Valeur_Compteur')
            await compteurFacturesAvoirs.reload()
            valeur = compteurFacturesAvoirs.Valeur_Compteur
        })
    }

    return valeur
}

module.exports = {
    COMPTEUR_FACTURES_GENERALES,
    COMPTEUR_FACTURES_AVOIRS,
    get
}