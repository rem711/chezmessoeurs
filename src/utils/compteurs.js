const { Compteurs, Sequelize, sequelize } = global.db

const COMPTEUR_FACTURES_AVOIRS = 'COMPTEUR_FACTURES_AVOIRS'
const COMPTEUR_ACOMPTES = 'COMPTEUR_ACOMPTES'

let compteurFacturesAvoirs = undefined
let compteurAcomptes = undefined

const init = async() => {
    compteurFacturesAvoirs = await Compteurs.findOne({
        where : {
            Nom_Compteur : COMPTEUR_FACTURES_AVOIRS
        }
    })

    compteurAcomptes = await Compteurs.findOne({
        where : {
            Nom_Compteur : COMPTEUR_ACOMPTES
        }
    })
}

const get = async (typeCompteur) => {
    if(compteurFacturesAvoirs === undefined || compteurAcomptes === undefined) {
        await init()
    }

    if(typeCompteur !== COMPTEUR_FACTURES_AVOIRS && typeCompteur !== COMPTEUR_ACOMPTES) {
        throw `Impossible de récupérer le compteur ${typeCompteur}.`
    }

    let valeur = 0

    if(typeCompteur === COMPTEUR_FACTURES_AVOIRS) {
        await sequelize.transaction({ 
            type : Sequelize.Transaction.TYPES.EXCLUSIVE 
        }, async (transaction) => {
            await compteurFacturesAvoirs.increment('Valeur_Compteur')
            await compteurFacturesAvoirs.reload()
            valeur = compteurFacturesAvoirs.Valeur_Compteur
        })        
    }
    else if(typeCompteur === COMPTEUR_ACOMPTES) {
        await sequelize.transaction({ 
            type : Sequelize.Transaction.TYPES.EXCLUSIVE 
        }, async (transaction) => {
            await compteurAcomptes.increment('Valeur_Compteur')
            await compteurAcomptes.reload()
            valeur = compteurAcomptes.Valeur_Compteur
        })
    }

    return valeur
}

module.exports = {
    COMPTEUR_FACTURES_AVOIRS,
    COMPTEUR_ACOMPTES,
    get
}