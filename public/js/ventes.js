// varaiable permettant de savoir si un update a eu lieu
let isUpdated = false

// récupère le modal
const modalVente = document.getElementById('modalVente')
// bouton d'ouverture du modal pour ajouter une vente
const btnAjouteVente = document.getElementById('btnAjouteVente')
// bouton d'ouverture du modal pour modifier une vente
const btnModifieVente = document.getElementById('btnModifieVente')
// 
const btnSupprimeVente = document.getElementById('btnSupprimeVente') 
// récupère les éléments qui ferment la modal
const modalListCloseElmts = document.getElementsByClassName("close")
// récupère le formulaire de vente
const formVente = document.getElementById('formVente')

async function getClients() {
    let infos = undefined
    let clients = undefined

    try {
        const response = await fetch('/clients/liste')
        if(response.ok) {
            const data = await response.json()
            infos = data.infos
            clients = data.clients
        }
        else if (response.status === 401) {
			alert("Vous avez été déconnecté, une authentification est requise. Vous allez être redirigé.")
			location.reload()
        } 
        else {
            throw "Une erreur est survenue, veuillez réesayer plus tard."
        }
    }
    catch(e) {
        infos = {
            error : e
        }
    }

    return {
        infos,
        clients
    }
}

function fillModal(infos = undefined, clients = undefined, vente = undefined) {
    document.getElementById('modalError').innerHTML = ''
	document.getElementById('modalError').style.display = 'none'
	document.getElementById('modalMessage').innerHTML = ''
    document.getElementById('modalMessage').style.display = 'none'
    
    if(infos) {
        if(infos.error) {
			document.getElementById('modalError').innerHTML = infos.error
			document.getElementById('modalError').style.display = 'block'
		}
		if(infos.message) {
			document.getElementById('modalMessage').innerHTML = infos.message
			document.getElementById('modalMessage').style.display = 'block'
		}
    }

    if(clients && clients.length > 0) {
        const selectClients = document.getElementById('Id_Client')

        for(const client of clients) {
            const option = document.createElement('option')
            option.setAttribute('value', `client_${client.Id_Client}`)
            let affichageClient = `${client.Prenom} ${client.Nom}`
            option.innerText = client.Societe ? `${affichageClient} (${client.Societe})` : affichageClient
            if(vente && vente.Id_Client === client.Id_Client) option.selected = true
            selectClients.appendChild(option)
        }
    }

    if(vente) {
        // remplissage des données de la vente
        document.getElementById('Id_Vente').value = vente.Id_Vente
        document.getElementById('Description').value = vente.Description
        document.getElementById('Nb_Personnes').value = vente.Nb_Personnes
        document.getElementById('Date_Evenement').value = moment(vente.Date_Evenement).format('DD/MM/YYYY HH:mm')
        document.getElementById('Ref_Devis').value = vente.Ref_Devis
        document.getElementById('Prix_TTC').value = Number(vente.Prix_TTC).toFixed(2)
    }

    modalVente.style.display = 'block'
}

async function openModal(event) {
    const trSelected = document.getElementsByClassName('selected')[0]

    if(event.target === btnAjouteVente) {
        const { infos, clients } = await getClients()
        fillModal(infos, clients)
    }
    else if(event.target === btnModifieVente && trSelected && trSelected.getAttribute('id') !== null) {   
        const Id_Vente = trSelected.getAttribute('id').split('_')[1]
        const url = `/ventes/${Id_Vente}`
        const options = {
            method : 'GET'
        }

        try {
            let { infos, clients } = await getClients()

            if(infos && infos.error) throw infos.error

            const response = await fetch(url, options)
            if(response.ok) {
                const data = await response.json()

                infos = data.infos
                vente = data.vente

                fillModal(infos, clients, vente)
            }
            else if(response.status === 401) {
                alert("Vous avez été déconnecté, une authentification est requise. Vous allez être redirigé.")
                location.reload()
            }
            else {
                throw "Une erreur est survenue, veuillez réesayer plus tard."
            }
        }
        catch(e) {
            fillModal({ error : e })
        }
    }
}

async function createOrUpdate() {
    event.preventDefault()

	if(formVente.checkValidity()) {
        let url = '/ventes'
        let options = undefined

        const params = {
            Id_Client : document.querySelector('#Id_Client option:checked').value.split('_')[1],
            Description : document.getElementById('Description').value,
            Nb_Personnes : document.getElementById('Nb_Personnes').value,
            Date_Evenement : document.getElementById('Date_Evenement').value,
            Ref_Devis : document.getElementById('Ref_Devis').value,
            Prix_TTC : document.getElementById('Prix_TTC').value
        }

        // création d'une vente
        if(document.getElementById('Id_Vente').value === '') {
            options = {
				headers: {
					'Content-Type': 'application/json'
				},
				method : 'POST',
				body : JSON.stringify(params)
			}
        }
        // modification d'une vente
        else {
            const Id_Vente = document.getElementById('Id_Vente').value

            url += `/${Id_Vente}`
			options = {
				headers: {
					'Content-Type': 'application/json'
				},
				method : 'PATCH',
				body : JSON.stringify(params)
            }
        }
            
        try {
            const response = await fetch(url, options)
            if(response.ok) {
                const data = await response.json()
                const { infos, vente } = data

                isUpdated = true
                fillModal(infos, undefined, vente)
            }
            else if (response.status === 401) {
                alert("Vous avez été déconnecté, une authentification est requise. Vous allez être redirigé.")
                location.reload()
            }
            else {
                throw "Une erreur est survenue, veuillez réesayer plus tard."
            }
        }
        catch(e) {
            fillModal({ error : e })
        }        
    }
    else {
		formVente.reportValidity()
	}
}

async function remove() {
    const trSelected = document.getElementsByClassName('selected')[0]

    // on vérifie qu'une vente est sélectionnée
    if(trSelected && trSelected.getAttribute('id') !== null) {
        if(confirm("Êtes-vous bien sûr de vouloir supprimer cette vente?")) {
            const Id_Vente = trSelected.getAttribute('id').split('_')[1]

            try {
                const url = `/ventes/${Id_Vente}`
                const options = {
                    method : 'DELETE'
                }

                const response = await fetch(url, options)
                if(response.ok) {
                    const { infos } = await response.json()

                    if(infos.error) throw infos.error
                    if(infos.message) alert(infos.message)

                    location.reload()
                }
                else if (response.status === 401) {
                    alert("Vous avez été déconnecté, une authentification est requise. Vous allez être redirigé.")
                    location.reload()
                }
                else {
                    throw "Une erreur est survenue, veuillez réesayer plus tard."
                }
            }
            catch(e) {
                alert(e)
            }
        }
    }
}

function closeModal() {
    // on masque la modal
    modalVente.style.display = 'none'
    // si un update a eu lieu on recharge la page pour recharger le tableau de ventes
	// pour voir les modifications apportées
	if (isUpdated) {
		location.reload()
	}
	else {
        document.getElementById('Id_Vente').value = ''

        const selectClients = document.getElementById('Id_Client')
        // sélectionne le premier élément
        selectClients.querySelector('option').selected = true
        // retrait des clients déjà présents
        const options = selectClients.querySelectorAll('option[value^=client_]')
        if(options !== null) {
            options.forEach(option => option.parentNode.removeChild(option))
        }

        document.getElementById('Description').value = ''
        document.getElementById('Nb_Personnes').value = ''
        document.getElementById('Date_Evenement').value = ''
        document.getElementById('Ref_Devis').value = ''
        document.getElementById('Prix_TTC').value = ''
    }
}


// action lors du clic pour ouvrir le modal nouvelle vente
btnAjouteVente.onclick = openModal
// action lors du clic pour ouvrir le modal modifier vente
btnModifieVente.onclick = openModal
// action lors du clic sur le bouton de validation d'une vente
formVente.addEventListener('submit', createOrUpdate)
// action lors du clic sur le bouton supprimer
btnSupprimeVente.onclick = remove

// affectation du click sur les éléments pour fermer la modal
for (let i = 0; i < modalListCloseElmts.length; i++) {
	modalListCloseElmts[i].onclick = () => {
		closeModal()
	}
}

// affectation du click quand l'utilisateur click en dehors de la modal
window.onclick = (event) => {
	if (event.target == modalVente) {
		closeModal()
	}
}

window.addEventListener('load', () => {
    initSelectedTr()
    initDateTimePickers()
})