// varaiable permettant de savoir si un update a eu lieu
let isUpdated = false

// récupère la modal
const modalUpdate = document.getElementById("modalUpdate")
            
// bouton ouvrant la modal pour l'update
const btnOpenModalUpdate = document.getElementById('btnOpenModalUpdate')

// récupère les éléments qui ferment la modal
const modalListCloseElmts = document.getElementsByClassName("close")

// récupère le formulaire d'update
const formUpdate = document.getElementById('formUpdate')
// récupère le formulaire de suppression
const formDelete = document.getElementById('formDelete')

// action lors de la suppression d'un client
const deleteElmt = async (event) => {
  event.preventDefault()
  const trSelected = document.getElementsByClassName('selected')[0]
  if(trSelected) {
    const Id_Client = trSelected.getAttribute('id').split('_')[1]
    const Nom_Prenom = trSelected.children[0].innerText
    let action = formDelete.getAttribute('action') + Id_Client
    formDelete.setAttribute('action', action)
    const isConfirmed = confirm(`Vous vous apprêtez à supprimer le client ${Nom_Prenom}. Cela supprimera tout l'historique avec ce client. Voulez-vous vraiment supprimer le client?`)
    if(isConfirmed) {
      // formDelete.submit()
      const options = {
        method : 'DELETE'
      }
      const response = await fetch(action, options)
      if(response.ok) {
        const data = await response.json()
        const { infos } = data
        if(infos.error) {
          alert(infos.error)
        }
        else {
          alert(infos.message)
          location.reload()
        }
      }
    }
    // si annulation, on retire l'Id_Client du formulaire
    else {
      // on explode la route
      const temp_tabAction = action.split('/')
      // on remet l'id à vide
      temp_tabAction[temp_tabAction.length - 1] = ''
      // on recré la chaine de route avec l'id à vide; array.toString() utilise les ',' comme séparateur donc on les remplace par des '/'
      action = temp_tabAction.toString().replace(/,/g, '/')
      formDelete.setAttribute('action', action)
    }
  }
}

// modifier le remplissage de l'url pour ne pas que l'id soit ajouté plusiers fois
const fillModal = (infos, client) => {
  // remise à zéro des champs d'information
  document.getElementById('modalError').innerHTML = ''
  document.getElementById('modalError').innerHTML = ''

  // remplissage des informations
  if(infos) {
    if(infos.error) {
      document.getElementById('modalError').innerHTML = infos.error
    }
    if(infos.message) {
      document.getElementById('modalMessage').innerHTML = infos.message
    }    
  }
  // remplissage des données du client
  if(client) {
    // const action = formUpdate.getAttribute('action') + client.Id_Client
    // formUpdate.setAttribute('action', action)
    document.getElementById('Nom_Prenom').value = client.Nom_Prenom
    document.getElementById('Adresse_Facturation').value = client.Adresse_Facturation
    document.getElementById('Telephone').value = client.Telephone
    document.getElementById(client.Type).checked = true
  }
}

// rempli et affiche la modal update
const showUpdateElmt = async () => {
  const trSelected = document.getElementsByClassName('selected')[0]
  if(trSelected && trSelected.getAttribute('id') !== null) {
    const Id_Client = trSelected.getAttribute('id').split('_')[1]
    const url = '/clients/' + Id_Client
    const options = {
      method : 'GET'
    }
    const response  = await fetch(url, options)
    if(response.ok) {
      const data = await response.json()
      const { infos, client } = data
      fillModal(infos, client)
    }

    // une fois les valeurs récupérées on affiche la modal
    modalUpdate.style.display = "block"
  }  
}

const updateElmt = async (event) => {
  event.preventDefault()

  const Id_Client = document.getElementsByClassName('selected')[0].getAttribute('id').split('_')[1]
  
  let Type = undefined
  document.getElementsByName('Type').forEach(item => {
    if(item.checked) Type = item.value
  })

  const action = formUpdate.getAttribute('action') + Id_Client

  const params = {
    Nom_Prenom : document.getElementById('Nom_Prenom').value,
    Adresse_Facturation : document.getElementById('Adresse_Facturation').value,
    Telephone : document.getElementById('Telephone').value,
    Type : Type
  }

  // eslint-disable-next-line no-undef
  const url = createURL(action, params)
  const options = {
    method : formUpdate.getAttribute('method')
  }
  
  const response = await fetch(url, options)
  if(response.ok) {
    const data = await response.json()
    const { infos, client } = data
    isUpdated = true
    fillModal(infos, client)
  }
}

const closeModal = () => {
  // on masque la modal
  modalUpdate.style.display = "none"
  // si un update a eu lieu on recharge la page pour recharger le tableau de clients
  // pour voir les modifications apportées
  if(isUpdated) {
    location.reload()
  }
}

// action lors du click pour ouvrir la modal 
btnOpenModalUpdate.onclick = showUpdateElmt
// action lors du click sur le bouton de suppression
formDelete.addEventListener('submit', deleteElmt)
// action lors du click sur le bouton de modification d'un client
formUpdate.addEventListener('submit', updateElmt)

// affectation du click sur les éléments pour fermer la modal
for(let i = 0; i < modalListCloseElmts.length; i++) {
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