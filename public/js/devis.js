// initialisation du tableau pour savoir quelle ligne est sélectionnée
const lignesTableaux = document.getElementsByTagName('tr')

for(let i = 0; i < lignesTableaux.length; i++) {
    lignesTableaux[i].onclick = (event) => {
        tr = event.target.parentNode
        toggleSelectedTr(tr)
    }
}

// récupération des boutons
const btnNewDevis = document.getElementById('btnNewDevis')
const btnModifyDevis = document.getElementById('btnModifyDevis')
const btnArchiveDevis = document.getElementById('btnArchiveDevis')

const toggleSelectedTr = (trClicked) => {
    // si une précédente sélectionnée
    let trSelected = document.getElementsByClassName('selected')[0]
    if(trClicked !== trSelected) {
        if(trSelected) {
            // on retire la classe
            trSelected.setAttribute('class', '')
        }
        // on assigne à la nouvelle tr sélectionnée la classe
        trClicked.setAttribute('class', 'selected')
    }
    if(trSelected) {
        // on retire la classe s'il y avait une précédente tr de sélectionnée
        trSelected.setAttribute('class', '')
    }
}

const newDevis = () => {
    location.replace('/devis/create')
}

const modifyDevis = () => {
    const trSelected = document.getElementsByClassName('selected')[0]
    if(trSelected) {
        const Id_Devis = trSelected.getAttribute('id').split('_')[1]
        const url = `/devis/${Id_Devis}`
        location.replace(url)
    }
}

const archiveDevis = () => {
    console.log('archive devis')
}

// affectation du click de bouton
btnNewDevis.onclick = newDevis
btnModifyDevis.onclick = modifyDevis
btnArchiveDevis.onclick = archiveDevis