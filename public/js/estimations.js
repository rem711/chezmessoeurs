// initilisation des lignes qui peuvent être sélectionnées
// eslint-disable-next-line no-undef
initSelectedTr()

// récupération des boutons
const btnToDevis = document.getElementById('btnToDevis')
const btnArchiveEstimation = document.getElementById('btnArchiveEstimation')

const toDevis = async () => {
    const trSelected = document.getElementsByClassName('selected')[0]
    if(trSelected) {
        const Id_Estimation = trSelected.getAttribute('id').split('_')[1]
        
        const url = `/estimations/validation/${Id_Estimation}`
        const options = {
            method : 'POST'
        }

        const response = await fetch(url, options)
        if(response.ok) {
            const data = await response.json()
            const { infos, devis } = data

            if(infos.error) {
                alert(infos.error)
            }
            else if(infos.message && devis !== undefined) {
                const message = infos.message + ' Vous allez être redirigé vers le devis.'
                alert(message)
                location.replace(`/devis/${devis.Id_Devis}`)
            }
        }
        else if(response.status === 401) {
            alert("Vous avez été déconnecté, une authentification est requise. Vous allez être redirigé.")
            location.reload()
        }
        else {
            alert("Une erreur est survenue, veuillez recommencer plus tard.")
        }
    }
}

const archiveEstimation = async () => {
    const trSelected = document.getElementsByClassName('selected')[0]
    if(trSelected) {
        const Id_Estimation = trSelected.getAttribute('id').split('_')[1]
        
        const url = `/estimations/${Id_Estimation}`
        const options = {
            method : 'PATCH'
        } 

        const response = await fetch(url, options)
        if(response.ok) {
            const data = await response.json()
            const { infos } = data 

            // l'archivage s'est bien passé
            if(infos.message) {
                alert(infos.message)
                location.reload()
            }
            // une erreur s'est produite
            if(infos.error) {
                alert(infos.error)
            }
        }
        else if(response.status === 401) {
            alert("Vous avez été déconnecté, une authentification est requise. Vous allez être redirigé.")
            location.reload()
        }
        else {
            alert("Une erreur est survenue, veuillez recommencer plus tard.")
        }
    }
}

// affectation des fonctions aux clicks
btnToDevis.onclick = toDevis
btnArchiveEstimation.onclick = archiveEstimation