const modalPrix = document.getElementById('modalPrix')
const btnModifie = document.getElementById('btnModifie')
const btnAjouteOption = document.getElementById('btnAjouteOption')
const btnUpdate = document.getElementById('btnUpdate')
const formPrix = document.getElementById('formPrix')

let hasChanged = false

const fillModal = async (isUpdate) => {
    const modalError = document.getElementById('modalError')
    const modalMessage = document.getElementById('modalMessage')

    modalError.innerHTML = ''
    modalError.style.display = 'none'
    modalMessage.innerHTML = ''
    modalMessage.style.display = 'none'

    if(isUpdate) {
        const liSelected = document.getElementsByClassName('selected')[0]
        const [target, id] = liSelected.getAttribute('id').split('_')

        let url = ''

        if(target === 'menu') {
            document.getElementById('modalTitle').innerHTML = 'Menu'
            document.getElementById('IsOption').value = 0
            document.getElementById('Nom_Type_Prestation').disabled = true

            url = '/prix&options/menu/'
        }   
        else if(target === 'option') {
            document.getElementById('modalTitle').innerHTML = 'Option'
            document.getElementById('IsOption').value = 1
            document.getElementById('Nom_Type_Prestation').disabled = false

            url = '/prix&options/option/'
        }

        url += id

        const response = await fetch(url)
        if(response.ok) {
            const data = await response.json()
            const infos = data.infos
            const item = data.menu ? data.menu : data.option

            if(infos && infos.error) {
                modalError.innerHTML = infos.error
                modalError.style.display = 'block'
            }
            else if(item) {
                document.getElementById('Id_Prix_Unitaire').value = item.Id_Prix_Unitaire
                document.getElementById('Nom_Type_Prestation').value = item.Nom_Type_Prestation
                document.getElementById('Montant').value = item.Montant
            }
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
    else {
        document.getElementById('modalTitle').innerHTML = 'Option'
        document.getElementById('Id_Prix_Unitaire').value = ''
        document.getElementById('IsOption').value = 1
        document.getElementById('Nom_Type_Prestation').disabled = false
    }
}

const openModal = (event) => {
    const target  = event.target
    const liSelected = document.getElementsByClassName('selected')[0]

    if(target === btnAjouteOption) {
        fillModal()
        modalPrix.style.display = 'block'
    }
    else if(target === btnModifie && liSelected) {
        fillModal(true)
        modalPrix.style.display = 'block'
    }
}

const closeModal = () => {
    modalPrix.style.display = 'none'
    if(hasChanged) {
        location.reload()
    }
}

const createOption = async () => {
    const modalError = document.getElementById('modalError')
    const modalMessage = document.getElementById('modalMessage')

    modalError.innerHTML = ''
    modalError.style.display = 'none'
    modalMessage.innerHTML = ''
    modalMessage.style.display = 'none'
    
    const params = {
        Nom_Type_Prestation : document.getElementById('Nom_Type_Prestation').value,
        Montant : document.getElementById('Montant').value
    }
    const url = '/prix&options/option'
    const options = {
        headers: {
            'Content-Type': 'application/json'
        },
        method : 'POST',
        body : JSON.stringify(params)
    }

    const response = await fetch(url, options)
    if(response.ok) {
        const data = await response.json()
        const { infos, option } = data

        if(infos && infos.error) {
            modalError.innerHTML = infos.error
            modalError.style.display = 'block'
        }
        else if(infos && infos.message && option) {
            hasChanged = true
            modalMessage.innerHTML = infos.message
            modalMessage.style.display = 'block'
        }
        else {
            modalError.innerHTML = "Une erreur est survenue, veuillez réesayer plus tard."
            modalError.style.display = 'block'
        }
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

const update = () => {    
    event.preventDefault()

    const Id_Prix_Unitaire = document.getElementById('Id_Prix_Unitaire').value
    const IsOption = document.getElementById('IsOption').value

    if(formPrix.checkValidity()) {
        if(Id_Prix_Unitaire === '') {
            createOption()
        }
        else if(IsOption == 0) {
            updateMenu()
        }
        else if(IsOption == 1) {
            updateOption()
        }
    }
    else {
        formPrix.reportValidity()
    }
}

const updateMenu = async () => {
    const modalError = document.getElementById('modalError')
    const modalMessage = document.getElementById('modalMessage')

    modalError.innerHTML = ''
    modalError.style.display = 'none'
    modalMessage.innerHTML = ''
    modalMessage.style.display = 'none'
    
    const params = {
        Nom_Type_Prestation : document.getElementById('Nom_Type_Prestation').value,
        Montant : document.getElementById('Montant').value
    }
    const url = `/prix&options/menu/${document.getElementById('Id_Prix_Unitaire').value}`
    const options = {
        headers: {
            'Content-Type': 'application/json'
        },
        method : 'PATCH',
        body : JSON.stringify(params)
    }

    const response = await fetch(url, options)
    if(response.ok) {
        const data = await response.json()
        const { infos, menu } = data

        if(infos && infos.error) {
            modalError.innerHTML = infos.error
            modalError.style.display = 'block'
        }
        else if(infos && infos.message && menu) {
            hasChanged = true
            modalMessage.innerHTML = infos.message
            modalMessage.style.display = 'block'
        }
        else {
            modalError.innerHTML = "Une erreur est survenue, veuillez réesayer plus tard."
            modalError.style.display = 'block'
        }
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

const updateOption = async () => {
    const modalError = document.getElementById('modalError')
    const modalMessage = document.getElementById('modalMessage')

    modalError.innerHTML = ''
    modalError.style.display = 'none'
    modalMessage.innerHTML = ''
    modalMessage.style.display = 'none'
    
    const params = {
        Nom_Type_Prestation : document.getElementById('Nom_Type_Prestation').value,
        Montant : document.getElementById('Montant').value
    }
    const url = `/prix&options/option/${document.getElementById('Id_Prix_Unitaire').value}`
    const options = {
        headers: {
            'Content-Type': 'application/json'
        },
        method : 'PATCH',
        body : JSON.stringify(params)
    }

    const response = await fetch(url, options)
    if(response.ok) {
        const data = await response.json()
        const { infos, option } = data

        if(infos && infos.error) {
            modalError.innerHTML = infos.error
            modalError.style.display = 'block'
        }
        else if(infos && infos.message && option) {
            hasChanged = true
            modalMessage.innerHTML = infos.message
            modalMessage.style.display = 'block'
        }
        else {
            modalError.innerHTML = "Une erreur est survenue, veuillez réesayer plus tard."
            modalError.style.display = 'block'
        }
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

btnModifie.onclick = openModal
btnAjouteOption.onclick = openModal
btnUpdate.onclick = update

window.onclick = (event) => {
    if (event.target == modalPrix) {
        closeModal()
    }
}