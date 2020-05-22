const modalRecette = document.getElementById('modalRecette')
const btnUpdate = document.getElementById('btnUpdate')
const btnAjouteRecette = document.getElementById('btnAjouteRecette')
const btnModifieRecette = document.getElementById('btnModifieRecette')
const formRecette = document.getElementById('formRecette')
const btnDeleteRecette = document.getElementById('btnDeleteRecette')

let hasChanged = false

const fillModal = async (isUpdate = null) => {
    const modalError = document.getElementById('modalError')
    const modalMessage = document.getElementById('modalMessage')

    modalError.innerHTML = ''
    modalError.style.display = 'none'
    modalMessage.innerHTML = ''
    modalMessage.style.display = 'none'

    if(isUpdate) {
        const liSelected = document.getElementsByClassName('selected')[0]
        const Id_Recette = liSelected.getAttribute('id').split('_')[1]

        const response = await fetch(`/carte/recettes/${Id_Recette}`)
        
        if(response.ok) {
            const data = await response.json()
            const { infos, recette } = data

            if(infos && infos.error) {
                modalError.innerHTML = infos.error
                modalError.style.display = 'block'
            }
            else {
                document.getElementById('Id_Recette').value = recette.Id_Recette
                document.getElementById(`Categorie_${recette.Categorie}`).checked = true
                document.getElementById('Nom').value = recette.Nom
                document.getElementById('Description').innerHTML = recette.Description
                document.getElementsByName('Disponible').forEach(input => {
                    if(Number(input.value) === recette.Disponible) {
                        input.checked = true
                    }
                })
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
        document.getElementById('Disponible').checked = true
    }
}

const openModal = (event) => {
    const liSelected = document.getElementsByClassName('selected')[0]
    
    if(event.target === btnAjouteRecette) {
        fillModal()
        modalRecette.style.display = 'block'
    }
    else if(event.target === btnModifieRecette && liSelected) {
        fillModal(true)
        modalRecette.style.display = 'block'
    }
}

const closeModal = () => {
    modalRecette.style.display = 'none'
    if(hasChanged) {
        location.reload()
    }
    else {
        document.getElementById('Id_Recette').value = ''
        document.querySelector('input[name=Categorie]:checked').checked = false
        document.getElementById('Nom').value = ''
        document.getElementById('Description').innerHTML = ''
    }
}

const createOrUpdate = (event) => {
    event.preventDefault()

    if(formRecette.checkValidity()) {
        if(document.getElementById('Id_Recette').value === '') {
            createRecette()
        }
        else {
            updateRecette()
        }
    }
    else {
        formRecette.reportValidity()
    }
}

const createRecette = async () => {
    const modalError = document.getElementById('modalError')
    const modalMessage = document.getElementById('modalMessage')

    modalError.innerHTML = ''
    modalError.style.display = 'none'
    modalMessage.innerHTML = ''
    modalMessage.style.display = 'none'

    const params = {
        Categorie : document.querySelector('input[name=Categorie]:checked').value,
        Nom : document.getElementById('Nom').value,
        Description : document.getElementById('Description').innerHTML,
        Disponible : document.querySelector('input[name=Disponible]:checked').value
    }
    const url = '/carte/recettes'
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
        const { infos, recette } = data

        if(infos && infos.error) {
            modalError.innerHTML = infos.error
            modalError.style.display = 'block'
        }
        else if(infos && infos.message && recette) {
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

const updateRecette = async () => {
    const modalError = document.getElementById('modalError')
    const modalMessage = document.getElementById('modalMessage')

    modalError.innerHTML = ''
    modalError.style.display = 'none'
    modalMessage.innerHTML = ''
    modalMessage.style.display = 'none'

    const params = {
        Categorie : document.querySelector('input[name=Categorie]:checked').value,
        Nom : document.getElementById('Nom').value,
        Description : document.getElementById('Description').innerHTML,
        Disponible : document.querySelector('input[name=Disponible]:checked').value
    }
    const url = `/carte/recettes/${document.getElementById('Id_Recette').value}`
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
        const { infos, recette } = data

        if(infos && infos.error) {
            modalError.innerHTML = infos.error
            modalError.style.display = 'block'
        }
        else if(infos && infos.message && recette) {
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

const deleteRecette = async () => {
    const liSelected = document.getElementsByClassName('selected')[0]

    if(liSelected) {
        const Id_Recette = liSelected.getAttribute('id').split('_')[1]
        const url = `/carte/recettes/${Id_Recette}`
        const options = {
            method : 'DELETE'
        }

        const response = await fetch(url, options)
        if(response.ok) {
            const data = await response.json()
            const { infos, recette } = data
    
            if(infos && infos.error) {
                alert(infos.error)
            }
            else if(infos && infos.message && recette) {
                alert(infos.message)
                location.reload()
            }
            else {
                alert("Une erreur est survenue, veuillez réesayer plus tard.")
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

btnAjouteRecette.onclick = openModal
btnModifieRecette.onclick = openModal
btnUpdate.onclick = createOrUpdate
btnDeleteRecette.onclick = deleteRecette

window.onclick = (event) => {
    if (event.target == modalRecette) {
        closeModal()
    }
}