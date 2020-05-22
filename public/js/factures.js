// initilisation des lignes qui peuvent être sélectionnées
// eslint-disable-next-line no-undef
initSelectedTr()

// récupération des boutons
const btnDelete = document.getElementById('btnDelete')



const deleteFacture = async () => {
    const trSelected = document.getElementsByClassName('selected')[0]
    if(trSelected && trSelected.getAttribute('id') !== null) {
        const Id_Facture = trSelected.getAttribute('id').split('_')[1]
        const url = `/factures/cancel/${Id_Facture}`
        const options = {
            method : 'PATCH'
        }

        const response = await fetch(url, options)
        if(response.ok) {
            const data = await response.json()
            const { infos, facture } = data

            if(infos.error) {
                alert(infos.error)
            }
            else if(infos.message) {
                alert(infos.message)
                window.open(`/avoirs/generate/${facture.Id_Facture}`)
                setTimeout(() => {
                    window.location.reload()
                }, 500)
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


// affectation du click quand l'utilisateur click en dehors de la modal
btnDelete.onclick = deleteFacture