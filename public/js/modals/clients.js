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

// modifier le remplissage de l'url pour ne pas que l'id soit ajouté plusiers fois
const fillModal = (infos, client) => {
  // remise à zéro des champs d'information
  document.getElementById('modalError').innerHTML = ''
  document.getElementById('modalError').style.display = 'none'
  document.getElementById('modalMessage').innerHTML = ''
  document.getElementById('modalMessage').style.display = 'none'
  // document.getElementById('Nom').value = ''
  // document.getElementById('Prenom').value = ''
  // document.getElementById('Adresse_Facturation_Adresse').value = ''
  // document.getElementById('Adresse_Facturation_Adresse_Complement_1').value = ''
  // document.getElementById('Adresse_Facturation_Adresse_Complement_2').value = ''
  // document.getElementById('Adresse_Facturation_CP').value = ''
  // document.getElementById('Adresse_Facturation_Ville').value = ''
  // document.getElementById('Telephone').value = ''
  // document.getElementById('Email').value = ''
  // document.getElementById('Particulier').checked = true
  // document.getElementById('Societe').value = ''
  // document.getElementById('Numero_TVA').value = ''

  // remplissage des informations
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
  // remplissage des données du client
  if(client) {
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
    showEltProfessionnel({ target : document.getElementById(client.Type) })
    document.getElementById('Societe').value = client.Societe
    document.getElementById('Numero_TVA').value = client.Numero_TVA
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
      // une fois les valeurs récupérées on affiche la modal
      modalUpdate.style.display = "block"
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

const updateElmt = async (event) => {
  event.preventDefault()

  const Id_Client = document.getElementsByClassName('selected')[0].getAttribute('id').split('_')[1]
  
  let Type = undefined
  document.getElementsByName('Type').forEach(item => {
    if(item.checked) Type = item.value
  })

  const action = formUpdate.getAttribute('action') + Id_Client

  const params = {
    Nom : document.getElementById('Nom').value,
    Prenom : document.getElementById('Prenom').value,
    Adresse_Facturation_Adresse : document.getElementById('Adresse_Facturation_Adresse').value,
    Adresse_Facturation_Adresse_Complement_1 : document.getElementById('Adresse_Facturation_Adresse_Complement_1').value,
    Adresse_Facturation_Adresse_Complement_2 : document.getElementById('Adresse_Facturation_Adresse_Complement_2').value,
    Adresse_Facturation_CP : document.getElementById('Adresse_Facturation_CP').value,
    Adresse_Facturation_Ville : document.getElementById('Adresse_Facturation_Ville').value,
    Telephone : document.getElementById('Telephone').value,
    Email : document.getElementById('Email').value,
    Type,
    Societe : document.getElementById('Societe').value,
    Numero_TVA : document.getElementById('Numero_TVA').value
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
  else if(response.status === 401) {      
    alert("Vous avez été déconnecté, une authentification est requise. Vous allez être redirigé.")
    location.reload()
  }
  else {
    alert("Une erreur est survenue, veuillez recommencer plus tard.")
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

const showEltProfessionnel = (elt) => {
  const target = elt.target.getAttribute('id')
  const inputSociete = document.getElementById('Societe')
  const labelSociete = document.querySelector("label[for='Societe']")
  const inputNumeroTVA = document.getElementById('Numero_TVA')
  const labelNumeroTVA = document.querySelector("label[for='Numero_TVA']")

  if(target === 'Particulier') {
    inputSociete.style.display = 'none'
    labelSociete.style.display = 'none'
    inputNumeroTVA.style.display = 'none'
    labelNumeroTVA.style.display = 'none'
  }
  else {
    inputSociete.style.display = 'block'
    labelSociete.style.display = 'block'
    inputNumeroTVA.style.display = 'block'
    labelNumeroTVA.style.display = 'block'
  }
}

// action lors du click pour ouvrir la modal 
btnOpenModalUpdate.onclick = showUpdateElmt
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

document.getElementsByName('Type').forEach(elt => {
  elt.onchange = showEltProfessionnel
})