// Get the modal
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
const deleteElmt = (event) => {
  event.preventDefault()
  const trSelected = document.getElementsByClassName('selected')[0]
  if(trSelected) {
    const Id_Client = trSelected.getAttribute('id').split('_')[1]
    const action = formDelete.getAttribute('action') + Id_Client
    formDelete.setAttribute('action', action)
    formDelete.submit()
  }
}

// modifier le remplissage de l'url pour ne pas que l'id soit ajouté plusiers fois
// vider le paragraphe de message et d'erreur avant de remplir
const fillModal = (infos, client) => {
  if(infos) {
    if(infos.error) {
      document.getElementById('modalError').innerHTML = infos.error
    }
    if(infos.message) {
      document.getElementById('modalMessage').innerHTML = infos.message
    }    
  }
  if(client) {
    const action = formUpdate.getAttribute('action') + client.Id_Client
    formUpdate.setAttribute('action', action)
    document.getElementById('Nom_Prenom').value = client.Nom_Prenom
    document.getElementById('Adresse_Facturation').value = client.Adresse_Facturation
    document.getElementById('Telephone').value = client.Telephone
    document.getElementById(client.Type).checked = true
  }
}

// rempli et affiche la modal update
const showUpdateElmt = async () => {
  const trSelected = document.getElementsByClassName('selected')[0]
  if(trSelected) {
    const Id_Client = trSelected.getAttribute('id').split('_')[1]
    const url = '/clients/' + Id_Client
    const options = {
      method : 'GET',
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
  
  let Type = undefined
  document.getElementsByName('Type').forEach(item => {
    if(item.checked) Type = item.value
  })

  const params = {
    Nom_Prenom : document.getElementById('Nom_Prenom').value,
    Adresse_Facturation : document.getElementById('Adresse_Facturation').value,
    Telephone : document.getElementById('Telephone').value,
    Type : Type
  }

  const esc = encodeURIComponent;
  const query = Object.keys(params)
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&');

  
  const url = formUpdate.getAttribute('action') + '?' + query
  const options = {
    method : formUpdate.getAttribute('method')
  }
  
  const response = await fetch(url, options)
  if(response.ok) {
    const data = await response.json()
    const { infos, client } = data
    console.log(infos)
    fillModal(infos, client)
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
    modalUpdate.style.display = "none"
  }
} 

// affectation du click quand l'utilisateur click en dehors de la modal
window.onclick = (event) => {
  if (event.target == modalUpdate) {
    modalUpdate.style.display = "none"
  }
}

