// initilisation des lignes qui peuvent être sélectionnées
// eslint-disable-next-line no-undef
initSelectedTr()

// récupération des boutons
const btnNewDevis = document.getElementById('btnNewDevis')
const btnModifyDevis = document.getElementById('btnModifyDevis')
const btnArchiveDevis = document.getElementById('btnArchiveDevis')

const newDevis = () => {
    location.replace('/devis/create')
}

const modifyDevis = () => {
    const trSelected = document.getElementsByClassName('selected')[0]
    if(trSelected) {
        const Id_Devis = trSelected.getAttribute('id').split('_')[1]
        const url = `/devis/${Id_Devis}`
        location.replace(url)
    }
}

const archiveDevis = async () => {
    const trSelected = document.getElementsByClassName('selected')[0]
    if(trSelected && trSelected.getAttribute('id') !== null) {
        const Id_Devis = trSelected.getAttribute('id').split('_')[1]
        const url = `/devis/archive/${Id_Devis}`
        const options = {
            method : 'PATCH'
        }

        const response = await fetch(url, options)
        if(response.ok) {
            const data = await response.json()
            const { infos } = data
            
            if(infos.message) {
                alert(infos.message)
                location.replace('/devis')
            }
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

// affectation du click de bouton
btnNewDevis.onclick = newDevis
btnModifyDevis.onclick = modifyDevis
btnArchiveDevis.onclick = archiveDevis