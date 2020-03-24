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