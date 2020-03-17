const lignesTableaux = document.getElementsByTagName('tr')

for(let i = 0; i < lignesTableaux.length; i++) {
    lignesTableaux[i].onclick = (event) => {
        tr = event.target.parentNode
        toggleSelectedTr(tr)
    }
}

const toggleSelectedTr = (trClicked) => {
    // si une précédente sélectionnée
    let trSelected = document.getElementsByClassName('selected')[0]
    if(trSelected) {
        // on retire la classe
        trSelected.setAttribute('class', '')
    }
    // on assigne la nouvelle tr sélectionnée et on lui ajoute la classe
    trSelected = trClicked
    trSelected.setAttribute('class', 'selected')
}

const archiveEstimation = () => {
    
}