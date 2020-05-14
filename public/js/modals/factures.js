// varaiable permettant de savoir si un update a eu lieu
let isUpdated = false
let hasChanged = false

// récupère les boutons pour la modal
const btnOpenModalUpdate = document.getElementById('btnOpenModalUpdate')
const btnAttente = document.getElementById('btnAttente')
const btnPayee = document.getElementById('btnPayee')
const btnArchive = document.getElementById('btnArchive')
const btnExport = document.getElementById('btnExport')
const btnRelance = document.getElementById('btnRelance')
const btnUpdate = document.getElementById('btnUpdate')
const inputAcompte = document.getElementById('Acompte')
// récupère la modal
const modalUpdate = document.getElementById("modalUpdate")

// récupère les paragraphes d'information
const pError = document.getElementById('modalError')
const pMessage = document.getElementById('modalMessage')

const showError = (error) => {
    pError.innerHTML = error
    pError.style.display = 'block'
}

const showMessage = (message) => {
    pMessage.innerHTML = message
    pMessage.style.display = 'block'
}

const resetError = () => {
    pError.innerHTML = ''
    pError.style.display = 'none'
}

const resetMessage = () => {
    pMessage.innerHTML = ''
    pMessage.style.display = 'none'
}

const fillModal = (infos, facture) => {
    // remise à zéro des champs d'information
    resetError()
    resetMessage()

    if(infos) {
        if(infos.error) {
            showError(infos.error)
        }
        if(infos.message) {
            showMessage(infos.message)
        }
    }

    // remplissage des données de la facture
    if(facture) {
        let payee = ''
        let attente = ''
        // eslint-disable-next-line prefer-named-capture-group
        if(facture.Statut.match(/payé(e)?/i) === null) {
            attente = 'btnSelected'
        }
        else {
            payee = 'btnSelected'
        }

        document.getElementById('Id_Facture').value = facture.Id_Facture
        document.getElementById('Numero_Facture').innerHTML = facture.Numero_Facture
        // eslint-disable-next-line no-undef
        document.getElementById('Date_Creation').innerHTML = moment(facture.Date_Creation).format('DD/MM/YYYY')
        if(facture.Client.Type === 'Professionnel') {
            document.getElementById('Societe').innerHTML = facture.Client.Societe
            document.getElementById('divSociete').style.display = ''
        }
        else {
            document.getElementById('divSociete').style.display = 'none'
        }
        document.getElementById('Client').innerHTML = `${facture.Client.Prenom} ${facture.Client.Nom}`
        document.getElementById('Email').innerHTML = facture.Client.Email
        document.getElementById('Telephone').innerHTML = facture.Client.Telephone
        document.getElementById('btnAttente').setAttribute('class', attente)
        document.getElementById('btnPayee').setAttribute('class', payee)
        document.getElementById('Acompte').value = facture.Acompte
    }
}

// ajout des fonctions de clic
const openModal = async () => {
    const trSelected = document.getElementsByClassName('selected')[0]
    if(trSelected && trSelected.getAttribute('id') !== null) {
        const Id_Facture = trSelected.getAttribute('id').split('_')[1]
        const url = `/factures/${Id_Facture}`
        const options = {
            method : 'GET'
        }

        const response = await fetch(url, options)
        if(response.ok) {
            const data = await response.json()
            const { infos, facture } = data
            fillModal(infos, facture)
        }

        modalUpdate.style.display = 'block'
    }
}

const closeModal = () => {
    let close = true

    if(hasChanged) {
        close = confirm("Des modifications n'ont pas été enregistrées, voulez-vous vraiment quitter?")
    }

    if(close) {
        // on masque la modal
        modalUpdate.style.display = "none"
        // si un update a eu lieu on recharge la page pour recharger le tableau de factures
        // pour voir les modifications apportées
        if(isUpdated) {
            location.reload()
        }
        else {
            isUpdated = false
        }
    }
}

const changeBtnSelected = (event) => {
    const btnClicked = event.target

    document.getElementsByClassName('btnSelected')[0].setAttribute('class', '')
    btnClicked.setAttribute('class', 'btnSelected')

    fnChange()
}

const fnChange = () => {
    hasChanged = true
    resetError()
    resetMessage()
}

const updateFacture = async () => {
    // reset des valeurs
    resetError()
    resetMessage()

    if(hasChanged) {
        const params = {
            Statut : document.querySelector('#Statut .btnSelected').getAttribute('data-statut'),
            Acompte : inputAcompte.value
        }
        const url = `/factures/${document.getElementById('Id_Facture').value}`
        const options = {
            method : 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(params)
        }

        const response = await fetch(url, options)
        if(response.ok) {
            const data = await response.json()
            const { infos } = data

            if(infos.error) {
                showError(infos.error)
            }
            else if(infos.message) {
                showMessage(infos.message)
                hasChanged = false
                isUpdated = true
            }
        }
    }
    else {
        showMessage('La facture est déjà à jour.')
    }
}

const archiveFacture = async () => {
    resetError()
    resetMessage()

    let archive = true

    // vérification si modifs
    if(hasChanged) {
        archive = confirm("Des modifications n'ont pas été enregistrées, voulez-vous continuer?")
    }
    // vérification si non payée
    if(document.querySelector('#Statut .btnSelected').getAttribute('id') === 'btnAttente') {
        archive = confirm("La facture est impayée, souhaitez vous vraiment l'archiver?")
    }

    if(archive) {
        const url = `/factures/archive/${document.getElementById('Id_Facture').value}`
        const options = {
            method : 'PATCH'
        }

        const response = await fetch(url, options)
        if(response.ok) {
            const data = await response.json()
            const { infos } = data
            
            if(infos.error) {
                showError(infos.error)
            }
            else if(infos.message) {
                showMessage(infos.message)
                hasChanged = false
                isUpdated = true
            }
        }
    }
}

const sendReminder = async () => {
    resetError()
    resetMessage()

    const url = `/factures/${document.getElementById('Id_Facture').value}`
    const options = {
        method : 'POST'
    }

    const response = await fetch(url, options)
    if(response.ok) {
        const data = await response.json()
        const { infos, facture } = data

        if(infos.error) {
            showError(infos.error)
        }
        else if(infos.message && facture) {
            isUpdated = true
            showMessage(infos.message)
            window.open(`/factures/${facture.Id_Facture}/relance`)
        }
    }
}

const sendFacture = async () => {
    resetError()
    resetMessage()
    let openFacture = true

    // vérification si changement
    if(hasChanged) {
        openFacture = confirm("Des modifications n'ont pas été enregistrées, voulez-vous tout de même éditer la facture?")
    }

    // ensuite ouverture url
    if(openFacture) {
        let url = `/factures/validate/${document.getElementById('Id_Facture').value}/${document.getElementById('Numero_Facture').innerHTML}`
        const options = {
            method : 'GET'
        }

        const response = await fetch(url, options)
        if(response.ok) {
            const data = await response.json()
            const { infos } = data

            if(infos.error) {
                showError(infos.error)
            }
            else if(infos.message) {
                url = `/factures/pdf/${encodeURI('CHEZ MES SOEURS - Facture ')}${document.getElementById('Numero_Facture').innerHTML}.pdf`
                window.open(url)
            }
        }
    }
}

// attribution clic
btnOpenModalUpdate.onclick = openModal
btnAttente.onclick = changeBtnSelected
btnPayee.onclick = changeBtnSelected
btnUpdate.onclick = updateFacture
btnArchive.onclick = archiveFacture
btnRelance.onclick = sendReminder
btnExport.onclick = sendFacture

inputAcompte.onchange = fnChange

window.onclick = (event) => {
    if (event.target == modalUpdate) {
        closeModal()
    }
}