// initialisation du tableau pour savoir quelle ligne est sélectionnée
const lignesTableaux = document.getElementsByTagName('tr')

for(let i = 0; i < lignesTableaux.length; i++) {
    lignesTableaux[i].onclick = (event) => {
        tr = event.target.parentNode
        toggleSelectedTr(tr)
    }
}

// récupération des boutons
const btnToDevis = document.getElementById('btnToDevis')
const btnArchiveEstimation = document.getElementById('btnArchiveEstimation')

const toggleSelectedTr = (trClicked) => {
    // si une précédente sélectionnée
    let trSelected = document.getElementsByClassName('selected')[0]
    if(trSelected) {
        // on retire la classe
        trSelected.setAttribute('class', '')
    }
    // on assigne la nouvelle tr sélectionnée et on lui ajoute la classe
    trSelected = trClicked
    trSelected.setAttribute('class', 'selected')
}

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
                location.replace(`/devis/${devis.ID_Devis}`)
            }
        }
    }
}

const archiveEstimation = async () => {
    const trSelected = document.getElementsByClassName('selected')[0]
    if(trSelected) {
        const Id_Estimation = trSelected.getAttribute('id').split('_')[1]
        
        const url = `/estimations/${Id_Estimation}`
        const options = {
            method : 'PATCH',
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
    }
}

// affectation des fonctions aux clicks
btnToDevis.onclick = toDevis
btnArchiveEstimation.onclick = archiveEstimation