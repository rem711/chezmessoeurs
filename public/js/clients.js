// varaiable permettant de savoir si un update a eu lieu
let isUpdated = false

// récupère la modal
const modalUpdate = document.getElementById("modalUpdate")

// boutant ouvrant la modal pour l'ajout client
const btnAjouteClient = document.getElementById('btnAjouteClient')

// bouton ouvrant la modal pour l'update
const btnOpenModalUpdate = document.getElementById('btnOpenModalUpdate')

// récupère les éléments qui ferment la modal
const modalListCloseElmts = document.getElementsByClassName("close")

// récupère le formulaire d'update
const formUpdate = document.getElementById('formUpdate')

const fillModal = (infos = undefined, client = undefined) => {
	document.getElementById('modalError').innerHTML = ''
	document.getElementById('modalError').style.display = 'none'
	document.getElementById('modalMessage').innerHTML = ''
	document.getElementById('modalMessage').style.display = 'none'

	if (infos) {
		if (infos.error) {
			document.getElementById('modalError').innerHTML = infos.error
			document.getElementById('modalError').style.display = 'block'
		}
		if (infos.message) {
			document.getElementById('modalMessage').innerHTML = infos.message
			document.getElementById('modalMessage').style.display = 'block'
		}
	}

	document.getElementById('Particulier').click()
	if(client) {
		// remplissage des données du client
		document.getElementById('Id_Client').value = client.Id_Client
		document.getElementById('Nom').value = client.Nom
		document.getElementById('Prenom').value = client.Prenom
		document.getElementById('Adresse_Facturation_Adresse').value = client.Adresse_Facturation_Adresse
		document.getElementById('Adresse_Facturation_Adresse_Complement_1').value = client.Adresse_Facturation_Adresse_Complement_1
		document.getElementById('Adresse_Facturation_Adresse_Complement_2').value = client.Adresse_Facturation_Adresse_Complement_2
		document.getElementById('Adresse_Facturation_CP').value = client.Adresse_Facturation_CP
		document.getElementById('Adresse_Facturation_Ville').value = client.Adresse_Facturation_Ville
		document.getElementById('Telephone').value = client.Telephone
		document.getElementById('Email').value = client.Email
		document.getElementById(client.Type).checked = true
		showEltProfessionnel({
			target: document.getElementById(client.Type)
		})
		document.getElementById('Societe').value = client.Societe
		document.getElementById('Numero_TVA').value = client.Numero_TVA
	}
	
	modalUpdate.style.display = 'block'
}

const openModal = async (event) => {
	const trSelected = document.getElementsByClassName('selected')[0]

	if (event.target === btnAjouteClient) {
		fillModal()
	} else if (event.target === btnOpenModalUpdate && trSelected && trSelected.getAttribute('id') !== null) {
		const Id_Client = trSelected.getAttribute('id').split('_')[1]
		const url = '/clients/' + Id_Client
		const options = {
			method: 'GET'
		}
		const response = await fetch(url, options)
		if (response.ok) {
			const data = await response.json()
			const {
				infos,
				client
			} = data
			fillModal(infos, client)
		}
		else if(response.status === 401) {
            alert("Vous avez été déconnecté, une authentification est requise. Vous allez être redirigé.")
            location.reload()
        }
        else {
            modalError.innerHTML = "Une erreur est survenue, veuillez réesayer plus tard."
            modalError.style.display = 'block'
        }
	}
}

// rempli et affiche la modal update
const showUpdateElmt = async () => {
	const trSelected = document.getElementsByClassName('selected')[0]
	if (trSelected && trSelected.getAttribute('id') !== null) {
		const Id_Client = trSelected.getAttribute('id').split('_')[1]
		const url = '/clients/' + Id_Client
		const options = {
			method: 'GET'
		}
		const response = await fetch(url, options)
		if (response.ok) {
			const data = await response.json()
			const {
				infos,
				client
			} = data
			fillModal(infos, client)
			// une fois les valeurs récupérées on affiche la modal
			modalUpdate.style.display = "block"
		} else if (response.status === 401) {
			alert("Vous avez été déconnecté, une authentification est requise. Vous allez être redirigé.")
			location.reload()
		} else {
			alert("Une erreur est survenue, veuillez recommencer plus tard.")
		}
	}
}

const createOrUpdate = async (event) => {
	event.preventDefault()

	if(formUpdate.checkValidity()) {
		let url = '/clients'
		let options = undefined

		let Type = undefined
		document.getElementsByName('Type').forEach(item => {
			if (item.checked) Type = item.value
		})

		const params = {
			Nom: document.getElementById('Nom').value,
			Prenom: document.getElementById('Prenom').value,
			Adresse_Facturation_Adresse: document.getElementById('Adresse_Facturation_Adresse').value,
			Adresse_Facturation_Adresse_Complement_1: document.getElementById('Adresse_Facturation_Adresse_Complement_1').value,
			Adresse_Facturation_Adresse_Complement_2: document.getElementById('Adresse_Facturation_Adresse_Complement_2').value,
			Adresse_Facturation_CP: document.getElementById('Adresse_Facturation_CP').value,
			Adresse_Facturation_Ville: document.getElementById('Adresse_Facturation_Ville').value,
			Telephone: document.getElementById('Telephone').value,
			Email: document.getElementById('Email').value,
			Type,
			Societe: (Type === 'Professionnel') ? document.getElementById('Societe').value : null ,
			Numero_TVA: (Type === 'Professionnel') ? document.getElementById('Numero_TVA').value : null
		}

		// création du client
		if(document.getElementById('Id_Client').value === '') {			
			options = {
				headers: {
					'Content-Type': 'application/json'
				},
				method : 'POST',
				body : JSON.stringify(params)
			}
		}
		// mise à jour du client
		else {
			const Id_Client = document.getElementById('Id_Client').value

			url += `/${Id_Client}`
			options = {
				headers: {
					'Content-Type': 'application/json'
				},
				method : 'PATCH',
				body : JSON.stringify(params)
			}
		}

		const response = await fetch(url, options)
		if (response.ok) {
			const data = await response.json()
			const {
				infos,
				client
			} = data
			isUpdated = true
			fillModal(infos, client)
		} else if (response.status === 401) {
			alert("Vous avez été déconnecté, une authentification est requise. Vous allez être redirigé.")
			location.reload()
		} else {
			const modalError = document.getElementById('modalError')
			modalError.innerHTML = "Une erreur est survenue, veuillez réesayer plus tard."
			modalError.style.display = 'block'
		}
	}
	else {
		formUpdate.reportValidity()
	}
}

const closeModal = () => {
	// on masque la modal
	modalUpdate.style.display = "none"
	// si un update a eu lieu on recharge la page pour recharger le tableau de clients
	// pour voir les modifications apportées
	if (isUpdated) {
		location.reload()
	}
	else {
		document.getElementById('Id_Client').value = ''
		document.getElementById('Nom').value = ''
		document.getElementById('Prenom').value = ''
		document.getElementById('Adresse_Facturation_Adresse').value = ''
		document.getElementById('Adresse_Facturation_Adresse_Complement_1').value = ''
		document.getElementById('Adresse_Facturation_Adresse_Complement_2').value = ''
		document.getElementById('Adresse_Facturation_CP').value = ''
		document.getElementById('Adresse_Facturation_Ville').value = ''
		document.getElementById('Telephone').value = ''
		document.getElementById('Email').value = ''
		document.getElementById('Particulier').click()
		document.getElementById('Societe').value = ''
		document.getElementById('Numero_TVA').value = ''
	}
}

const showEltProfessionnel = (elt) => {
	const target = elt.target.getAttribute('id')
	const inputSociete = document.getElementById('Societe')
	const labelSociete = document.querySelector("label[for='Societe']")
	const inputNumeroTVA = document.getElementById('Numero_TVA')
	const labelNumeroTVA = document.querySelector("label[for='Numero_TVA']")

	if (target === 'Particulier') {
		inputSociete.style.display = 'none'
		labelSociete.style.display = 'none'
		inputNumeroTVA.style.display = 'none'
		labelNumeroTVA.style.display = 'none'
	} else {
		inputSociete.style.display = 'block'
		labelSociete.style.display = 'block'
		inputNumeroTVA.style.display = 'block'
		labelNumeroTVA.style.display = 'block'
	}
}

// action lors du click pour ouvrir la modal 
btnOpenModalUpdate.onclick = openModal
// action lors du clic ur le + pour créer un nouveau client
btnAjouteClient.onclick = openModal
// action lors du click sur le bouton de modification d'un client
formUpdate.addEventListener('submit', createOrUpdate)

// affectation du click sur les éléments pour fermer la modal
for (let i = 0; i < modalListCloseElmts.length; i++) {
	modalListCloseElmts[i].onclick = () => {
		closeModal()
	}
}

// affectation du click quand l'utilisateur click en dehors de la modal
window.onclick = (event) => {
	if (event.target == modalUpdate) {
		closeModal()
	}
}

document.getElementsByName('Type').forEach(elt => {
	elt.onchange = showEltProfessionnel
})

window.addEventListener('load', () => {
    initSelectedTr()
})