// varaiable permettant de savoir si un update a eu lieu
let isUpdated = false
let venteChanged = false

// récupère l'input de recherche
const recherche = document.getElementById('recherche')
// récupère le modal
const modalFacture = document.getElementById('modalFacture')
// bouton d'ouverture du modal pour ajouter une facture
const btnAjouteFacture = document.getElementById('btnAjouteFacture')
// bouton d'ouverture du modal pour modifier une facture
const btnModifieFacture = document.getElementById('btnModifieFacture')
// 
const btnAnnuleFacture = document.getElementById('btnAnnuleFacture') 
// récupère les éléments qui ferment la modal
const modalListCloseElmts = document.getElementsByClassName("close")
// récupère le formulaire de facture
const formFacture = document.getElementById('formFacture')

async function getVentes() {
    let infos = undefined
    let ventes = undefined

    try {
        const response = await fetch('/ventes/liste')
        if(response.ok) {
            const data = await response.json()
            infos = data.infos
            ventes = data.ventes
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
        ventes
    }
}

async function getVente(Id_Vente) {
    let infos = undefined
    let vente = undefined

    try {
        const response = await fetch(`/ventes/${Id_Vente}`)
        if(response.ok) {
            const data = await response.json()
            infos = data.infos
            vente = data.vente
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
        vente
    }
}

function fillModal(infos = undefined, ventes = undefined, facture = undefined) {
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

    if(ventes && ventes.length > 0) {
        const selectVentes = document.getElementById('Id_Vente')

        for(const vente of ventes) {
            const option = document.createElement('option')
            option.setAttribute('value', `vente_${vente.Id_Vente}`)

            let affichageVente = `${vente.Client.Prenom} ${vente.Client.Nom}`
            affichageVente += vente.Client.Societe ? ` (${vente.Client.Societe})` : ''
            affichageVente += ` - ${moment(vente.Date_Evenement).format('DD/MM/YYYY HH:mm')} - ${vente.Prix_TTC}€`
            option.innerText = affichageVente

            if(facture && facture.Id_Vente === vente.Id_Vente) option.selected = true
            if(facture) option.disabled = true

            selectVentes.appendChild(option)
        }

        selectVentes.onchange()
    }

    if(!infos && !facture) {
        document.getElementById('div_refFacture').style.display = 'none'
        document.getElementById('div_btnActionsUpdate').style.display = 'none'
    }

    if(facture) {
        document.getElementById('Id_Facture').value = facture.Id_Facture
        document.getElementById('Ref_Facture').value = facture.Ref_Facture
        document.getElementById('Description').value = facture.Description

        // document.querySelector(`input[name=Type_Facture][value=${facture.Type_Facture}]`).click()
        if(facture.Type_Facture === 'acompte') {
            document.getElementById('radioAcompte').checked = true
            document.getElementById('Pourcentage_Acompte').value = facture.Pourcentage_Acompte
        }
        else {
            document.getElementById('radioSolde').checked = true
            document.getElementById('solde').value = facture.Prix_TTC
        }
        document.getElementById('radioAcompte').disabled = true
        document.getElementById('radioSolde').disabled = true
        document.getElementById('Pourcentage_Acompte').disabled = true
        document.getElementById('solde').disabled = true

        document.getElementById('Date_Paiement_Du').value = moment(facture.Date_Paiement_Du).format('DD/MM/YYYY')
        document.getElementById('Prix_TTC').value = facture.Prix_TTC

        document.getElementById('div_refFacture').style.display = 'flex'
        document.getElementById('div_btnActionsUpdate').style.display = 'flex'
    }

    modalFacture.style.display = 'block'
}

function fillInfosVente(infos, vente) {
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

    if(vente) {        
        document.getElementById('clientNom').innerText = `${vente.Client.Prenom} ${vente.Client.Nom}`
        document.getElementById('clientSociete').innerText = vente.Client.Societe ? vente.Client.Societe : '-'
        document.getElementById('venteRefDevis').innerText = vente.Ref_Devis
        document.getElementById('venteDateEvenement').innerText = moment(vente.Date_Evenement).format('DD/MM/YYYY HH:mm')
        document.getElementById('venteNbPersonnes').innerText = vente.Nb_Personnes
        document.getElementById('venteDescription').innerText = vente.Description
        document.getElementById('ventePrixTTC').innerText = `${Number(vente.Prix_TTC).toFixed(2)} €`
        document.getElementById('venteResteAPayer').innerText = `${Number(vente.Reste_A_Payer).toFixed(2)} €`
    }
}

async function openModal(event) {
    const trSelected = document.getElementsByClassName('selected')[0]

    if(event.target === btnAjouteFacture) {
        const { infos, ventes } = await getVentes()
        fillModal(infos, ventes)
    }
    else if(event.target === btnModifieFacture && trSelected && trSelected.getAttribute('id') !== null) {   
        const Id_Facture = trSelected.getAttribute('id').split('_')[1]
        const url = `/factures/${Id_Facture}`
        const options = {
            method : 'GET'
        }

        try {
            let { infos, ventes } = await getVentes()

            if(infos && infos.error) throw infos.error

            const response = await fetch(url, options)
            if(response.ok) {
                const data = await response.json()

                infos = data.infos
                facture = data.facture

                fillModal(infos, ventes, facture)
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

async function createOrUpdate(event) {
    event.preventDefault()

	if(formFacture.checkValidity()) {
        let url = '/factures'
        let options = undefined

        const params = {
            Id_Vente : document.querySelector('#Id_Vente option:checked').value.split('_')[1],
            Description : document.getElementById('Description').value,
            Type_Facture : document.querySelector(`input[name=Type_Facture]:checked`).value,
            Pourcentage_Acompte : document.getElementById('Pourcentage_Acompte').value !== '' ? document.getElementById('Pourcentage_Acompte').value : null,
            Date_Paiement_Du : document.getElementById('Date_Paiement_Du').value,
            Prix_TTC : document.getElementById('Prix_TTC').value
        }
        

        // création d'une facture
        if(document.getElementById('Id_Facture').value === '') {
            options = {
				headers: {
					'Content-Type': 'application/json'
				},
				method : 'POST',
				body : JSON.stringify(params)
			}
        }
        // modification d'une facture
        else {
            const Id_Facture = document.getElementById('Id_Facture').value

            url += `/${Id_Facture}`
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
                const { infos, facture } = data

                isUpdated = true
                fillModal(infos, undefined, facture)
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
		formFacture.reportValidity()
	}
}

async function clickIsPayed() {
    document.getElementById('modalError').innerHTML = ''
	document.getElementById('modalError').style.display = 'none'
	document.getElementById('modalMessage').innerHTML = ''
    document.getElementById('modalMessage').style.display = 'none'

    try {
        const Id_Facture = document.getElementById('Id_Facture').value

        const url = `/factures/isPayed/${Id_Facture}`
        const options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method : 'PATCH'
        }

        const response = await fetch(url, options)
        if(response.ok) {
            const { infos, facture } = await response.json()

            if(infos) {
                if(infos.error) throw infos.error
                if(infos.message) {
                    isUpdated = true
                    document.getElementById('modalMessage').innerHTML = infos.message
                    document.getElementById('modalMessage').style.display = 'block'
                }
            }
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
        document.getElementById('modalError').innerHTML = e
        document.getElementById('modalError').style.display = 'block'
    }
}

function factureToPDF() {
    const Ref_Facture = document.getElementById('Ref_Facture').value

    if(Ref_Facture){
        const url = `/factures/pdf/${encodeURI('CHEZ MES SOEURS - Facture ')}${Ref_Facture}.pdf`
        window.open(url, '_blank')
    }
}

async function remove() {
    const trSelected = document.getElementsByClassName('selected')[0]

    // on vérifie qu'une vente est sélectionnée
    if(trSelected && trSelected.getAttribute('id') !== null) {
        if(confirm("Êtes-vous bien sûr de vouloir annuler cette facture?")) {
            const Id_Facture = trSelected.getAttribute('id').split('_')[1]

            try {
                const url = `/factures/cancel/${Id_Facture}`
                const options = {
                    method : 'PATCH'
                }

                const response = await fetch(url, options)
                if(response.ok) {
                    const { infos, facture, avoir } = await response.json()

                    if(infos.error) throw infos.error
                    if(infos.message) {
                        if(avoir) {
                            infos.message += ' Un avoir a été créé.'
                        }

                        window.alert(infos.message)

                        if(avoir) {
                            window.open(`/factures/pdf/${avoir.Id_Facture}/${encodeURI('CHEZ MES SOEURS - Facture d\'Avoir ')}${avoir.Ref_Facture}.pdf`)
                        }
                    }

                    let timeoutValue = 200
                    if(avoir) timeoutValue = 5000

                    setTimeout(() => {
                        location.reload()
                    }, timeoutValue)
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
    modalFacture.style.display = 'none'
    // si un update a eu lieu on recharge la page pour recharger le tableau de ventes
	// pour voir les modifications apportées
	if (isUpdated) {
		location.reload()
	}
	else {
        const selectVentes = document.getElementById('Id_Vente')
        // sélectionne le premier élément
        selectVentes.querySelector('option').selected = true
        // retrait des ventes déjà présentes
        const options = selectVentes.querySelectorAll('option[value^=vente_]')
        if(options !== null) {
            options.forEach(option => option.parentNode.removeChild(option))
        }

        // retrait des infos vente
        document.getElementById('clientNom').innerText = ''
        document.getElementById('clientSociete').innerText = ''
        document.getElementById('venteRefDevis').innerText = ''
        document.getElementById('venteDateEvenement').innerText = ''
        document.getElementById('venteNbPersonnes').innerText = ''
        document.getElementById('venteDescription').innerText = ''
        document.getElementById('ventePrixTTC').innerText = ''
        document.getElementById('venteResteAPayer').innerText = ''

        // retrait des infos facture
        document.getElementById('Id_Facture').value = ''
        document.getElementById('Ref_Facture').value = ''
        document.getElementById('Description').value = ''
        document.querySelector(`input[name=Type_Facture][value=solde]`).click()
        document.getElementById('Pourcentage_Acompte').value = ''
        document.getElementById('solde').value = ''
        document.getElementById('Date_Paiement_Du').value = ''
        document.getElementById('Prix_TTC').value = ''

        // remise de l'édition possible pour les boutons radio s'ils ont été désactivés
        document.getElementById('radioAcompte').disabled = false
        document.getElementById('radioSolde').disabled = false
        document.getElementById('Pourcentage_Acompte').disabled = false
    }

    venteChanged = false
}

async function changeSelectedVente() {
    const selectedOption = document.querySelector('#Id_Vente option:checked')

    if(selectedOption.value !== '') {
        const Id_Vente = selectedOption.value.split('_')[1]
        const { infos, vente } = await getVente(Id_Vente)
        fillInfosVente(infos, vente)
        // calculePrix()
        venteChanged = true
    }
}

function changeTypeFacture({ target }) {
    const Pourcentage_Acompte = document.getElementById('Pourcentage_Acompte')
    const solde = document.getElementById('solde')

    Pourcentage_Acompte.value = ''
    solde.value = ''

    if(target.value === 'acompte') {
        Pourcentage_Acompte.disabled = false
        solde.disabled = true
    }
    else {
        Pourcentage_Acompte.disabled = true
        solde.disabled = false
    }

    calculePrix()
}

function calculePrix() {
    let venteResteAPayer = Number(document.getElementById('venteResteAPayer').innerText.split(' ')[0])
    const Prix_TTC = document.getElementById('Prix_TTC')
    const oldPrix = Number(Prix_TTC.value) !== '' ? Prix_TTC.value : 0

    if(venteResteAPayer !== '') {
        const Type_Facture = document.querySelector('input[name=Type_Facture]:checked').value
        let newPrix = 0

        if(Type_Facture === "solde") {
            newPrix = Number(document.getElementById('solde').value)
        }
        else {
            newPrix = Number((Number(document.getElementById('Pourcentage_Acompte').value / 100) * venteResteAPayer)).toFixed(2)
        }

        if(!venteChanged) venteResteAPayer += Number(oldPrix)
        venteResteAPayer -= Number(newPrix)
        
        Prix_TTC.value = newPrix
        document.getElementById('venteResteAPayer').innerText = `${Number(venteResteAPayer).toFixed(2)} €`
    }
}

function search() {
    const val = recherche.value.toLowerCase()

    // retrait des class de recherche
    document.querySelectorAll('tr[id]').forEach(tr => {
        tr.classList.remove('searched')
        tr.classList.remove('notSearched')
    })

    if(val.length > 0) {
        const listeTr = Array.from(document.querySelectorAll('tr[id]'))
        // cherche les clients
        const searchClients = listeTr.filter(tr => tr.querySelector('td:nth-of-type(3)').innerText.toLowerCase().includes(val))
        // cherche les numéros de téléphone
        const searchNumeros = listeTr.filter(tr => tr.querySelector('td:nth-of-type(4)').innerText.toLowerCase().includes(val))
        // cherche les emails
        const searchMails = listeTr.filter(tr => tr.querySelector('td:nth-of-type(5)').innerText.toLowerCase().includes(val))

        // filtre
        // ajout de la classe searched pour les éléments retourés par la recherche
        for(const tr of [...searchClients, ...searchNumeros, ...searchMails]) {
            if(!tr.classList.contains('searched')) {
                tr.classList.add('searched')
            }
        }

        document.querySelectorAll('tr[id]:not(.searched)')
            .forEach(tr => tr.classList.add('notSearched'))

    }
}

// action lors d'une recherche
recherche.onkeyup = search
// action lors du clic pour ouvrir le modal nouvelle facture
btnAjouteFacture.onclick = openModal
// action lors du clic pour ouvrir le modal modifier facture
btnModifieFacture.onclick = openModal
// action lors de la sélection d'une vente
document.getElementById('Id_Vente').onchange = changeSelectedVente
// action lors du clic sur le bouton de validation d'une facture
formFacture.addEventListener('submit', createOrUpdate)
// action lors du clic sur le bouton Annuler
btnAnnuleFacture.onclick = remove
// action lors d'un choix de type de facture
document.getElementsByName('Type_Facture').forEach(elt => {
	elt.onchange = changeTypeFacture
})
// action lorsqu'un pourcentage d'acompte ou un montant est appliqué
document.getElementById('Pourcentage_Acompte').onblur = calculePrix
document.getElementById('solde').onblur = calculePrix
// action lors du clic sur le bouton de paiement factue
document.getElementById('btnIsPayed').onclick = clickIsPayed
// action lors du clic sur le bouton d'export
document.getElementById('btnExport').onclick = factureToPDF

// affectation du click sur les éléments pour fermer la modal
for (let i = 0; i < modalListCloseElmts.length; i++) {
	modalListCloseElmts[i].onclick = () => {
		closeModal()
	}
}

// affectation du click quand l'utilisateur click en dehors de la modal
window.onclick = (event) => {
	if (event.target == modalFacture) {
		closeModal()
	}
}

window.addEventListener('load', () => {
    initSelectedTr()
    initDatePickers()
})