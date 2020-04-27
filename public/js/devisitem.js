/* eslint-disable no-undef */
// objet contenant toutes les informations qui devront être envoyées
// eslint-disable-next-line no-global-assign
global = {}

// objet contenant les prix
prix = {}

// objet contenant la recette sélectionnée et l'élement de la liste dans laquelle l'ajouter
selectedElements = {
    recette : null,
    element : null
}

// init des checkboxes de formules
const isAperitifCheckbox = document.getElementById('isAperitif')
const isCocktailCheckbox = document.getElementById('isCocktail')
const isBoxCheckbox = document.getElementById('isBox')
const isBrunchCheckbox = document.getElementById('isBrunch')
const isBrunchSaleCheckbox = document.getElementById('isBrunchSale')
const isBrunchSucrecheckbox = document.getElementById('isBrunchSucre')

// init des inputs du nombre de convives
const inputNbConvivesAperitif = document.getElementById('nbConvivesAperitif')
const inputNbConvivesCocktail = document.getElementById('nbConvivesCocktail')
const inputNbConvivesBox = document.getElementById('nbConvivesBox')
const inputNbConvivesBrunch = document.getElementById('nbConvivesBrunch')

// init des selects de pièces
const selectPiecesSaleesAperitif = document.getElementById('nbPiecesSaleesAperitif')
const selectPiecesSaleesCocktail = document.getElementById('nbPiecesSaleesCocktail')
const selectPiecesSucreesCocktail = document.getElementById('nbPiecesSucreesCocktail')
const selectPiecesSaleesBrunch = document.getElementById('typeBrunchSale')
const selectPiecesSucreesBrunch = document.getElementById('typeBrunchSucre')

// tableau des boutons d'ajout de recettes
const tabBtnAjouteRecette = Array.from(document.getElementsByClassName('btnAjouteRecette'))
// tableau des boutons de retrait de recettes
const tabBtnRetireRecette = Array.from(document.getElementsByClassName('btnRetireRecette'))

const toggle = event => {
    switch(event.target.getAttribute('id')) {
        case 'isAperitif' : {
            const divAperitif = document.getElementById('divAperitif')
            divAperitif.style.display = divAperitif.style.display === 'block' ? 'none' : 'block'
            changeAperitif()
            break;
        }
        case 'isCocktail' : {
            const divCocktail = document.getElementById('divCocktail')
            divCocktail.style.display = divCocktail.style.display === 'block' ? 'none' : 'block'
            changeCocktail()
            break;
        }
        case 'isBox' : {
            const divBox = document.getElementById('divBox')
            divBox.style.display = divBox.style.display === 'block' ? 'none' : 'block'
            changeBox()
            break;
        }
        case 'isBrunch' : {
            const divBrunch = document.getElementById('divBrunch')
            divBrunch.style.display = divBrunch.style.display === 'block' ? 'none' : 'block'
            changeBrunch()
            break;
        }
        case 'isBrunchSale' : {
            const divBrunchSale = document.getElementById('divBrunchSale')
            divBrunchSale.style.display = divBrunchSale.style.display === 'block' ? 'none' : 'block'
            changeBrunch()
            break;
        }
        case 'isBrunchSucre' : {
            const divBrunchSucre = document.getElementById('divBrunchSucre')
            divBrunchSucre.style.display = divBrunchSucre.style.display === 'block' ? 'none' : 'block'
            changeBrunch()
            break;
        }
    }
}

const initAffichage = () => {
    document.getElementById('divAperitif').style.display = 'none'
    document.getElementById('divCocktail').style.display = 'none'
    document.getElementById('divBox').style.display = 'none'
    document.getElementById('divBrunch').style.display = 'none'
    document.getElementById('divBrunchSale').style.display = 'none'
    document.getElementById('divBrunchSucre').style.display = 'none'

    // on crée un faux event pour utiliser la fonction toggle
    const event = { target : { id : '', getAttribute() { return this.id } } }
    
    // on regarde quelle(s) formule(s) sont à afficher
    if(isAperitifCheckbox.checked) {
        event.target.id = 'isAperitif'
        toggle(event)
    }
    if(isCocktailCheckbox.checked) {
        event.target.id = 'isCocktail'
        toggle(event)
    }
    if(isBoxCheckbox.checked) {
        event.target.id = 'isBox'
        toggle(event)
    }
    if(isBrunchCheckbox.checked) {
        event.target.id = 'isBrunch'
        toggle(event)
    }
    if(isBrunchSaleCheckbox.checked) {
        event.target.id = 'isBrunchSale'
        toggle(event)
    }
    if(isBrunchSucrecheckbox.checked) {
        event.target.id = 'isBrunchSucre'
        toggle(event)
    }
}

// ajoute à l'objet global les infos du à envoyer
const setGlobals = () => {
    global.isCreation = document.getElementById('isCreation').innerHTML
    global.Id_Devis = document.getElementById('Id_Devis') !== null ? document.getElementById('Id_Devis').getAttribute('data-id') : undefined
    saveClient()
    saveDateEvenement()
    saveAdresseLivraison()
    saveFormuleAperitif()
    saveFormuleCocktail()
    saveFormuleBox()
    saveFormuleBrunch()
    saveCommentaire()
    saveListeOptions()
    saveRemise()
}

// récupère les infos du client
const getClient = () => {
    return {
        Nom_Prenom : document.getElementById('Nom_Prenom').value,
        Adresse_Facturation : document.getElementById('Adresse_Facturation').value,
        Email : document.getElementById('Email').value,
        Telephone : document.getElementById('Telephone').value,
        Type : Array.from(document.getElementsByName('Type')).find(elt => elt.checked).value
    }
}

// récupère la date et l'heure de l'évènement et les formattent
const getDateEvenement = () => {
    return moment.utc(document.getElementById('Date_Evenement').value + ' ' + document.getElementById('heureEvenement').value + ':' + document.getElementById('minutesEvenement').value, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm')
}

// récupère l'adresse de livraison
const getAdresseLivraison = () => {
    return document.getElementById('Adresse_Livraison').value
}

// récupère les infos de la formule apéritif
const getFormuleAperitif = () => {
    return {
        isAperitif : document.getElementById('isAperitif').checked,
        Nb_Convives : document.getElementById('nbConvivesAperitif').value,
        Nb_Pieces_Salees : document.getElementById('nbPiecesSaleesAperitif').value,
        Liste_Id_Recettes_Salees : Array.from(document.getElementById('listeRecettesSaleesAperitif').children).map(elt => elt.getAttribute('id') !== null ?  elt.getAttribute('id').split('_')[1] : '').toString().replace(/,/g,';'),
        Liste_Id_Recettes_Boissons : Array.from(document.getElementById('listeRecettesBoissonsAperitif').children).map(elt => elt.getAttribute('id') !== null ? elt.getAttribute('id').split('_')[1] : '').toString().replace(/,/g,';')
    }
}

// récupère les infos de la formule cocktail
const getFormuleCocktail = () => {
    return {
        isCocktail : document.getElementById('isCocktail').checked,
        Nb_Convives : document.getElementById('nbConvivesCocktail').value,
        Nb_Pieces_Salees : document.getElementById('nbPiecesSaleesCocktail').value, 
        Nb_Pieces_Sucrees : document.getElementById('nbPiecesSucreesCocktail').value,
        Liste_Id_Recettes_Salees : Array.from(document.getElementById('listeRecettesSaleesCocktail').children).map(elt => elt.getAttribute('id') !== null ?  elt.getAttribute('id').split('_')[1] : '').toString().replace(/,/g,';'),
        Liste_Id_Recettes_Sucrees : Array.from(document.getElementById('listeRecettesSucreesCocktail').children).map(elt => elt.getAttribute('id') !== null ?  elt.getAttribute('id').split('_')[1] : '').toString().replace(/,/g,';'),
        Liste_Id_Recettes_Boissons : Array.from(document.getElementById('listeRecettesBoissonsCocktail').children).map(elt => elt.getAttribute('id') !== null ? elt.getAttribute('id').split('_')[1] : '').toString().replace(/,/g,';')
    }
}

// récupère les infos de la formule box
const getFormuleBox = () => {
    return {
        isBox : document.getElementById('isBox').checked,
        Nb_Convives : document.getElementById('nbConvivesBox').value,
        Liste_Id_Recettes_Salees : Array.from(document.getElementById('listeRecettesSaleesBox').children).map(elt => elt.getAttribute('id') !== null ?  elt.getAttribute('id').split('_')[1] : '').toString().replace(/,/g,';'),
        Liste_Id_Recettes_Sucrees : Array.from(document.getElementById('listeRecettesSucreesBox').children).map(elt => elt.getAttribute('id') !== null ?  elt.getAttribute('id').split('_')[1] : '').toString().replace(/,/g,';'),
        Liste_Id_Recettes_Boissons : Array.from(document.getElementById('listeRecettesBoissonsBox').children).map(elt => elt.getAttribute('id') !== null ? elt.getAttribute('id').split('_')[1] : '').toString().replace(/,/g,';')
    }
}

// récupère les infos de la formule brunch
const getFormuleBrunch = () => {
    return {
        isBrunch : document.getElementById('isBrunch').checked,
        isBrunchSale : document.getElementById('isBrunchSale').checked,
        isBrunchSucre : document.getElementById('isBrunchSucre').checked,
        Nb_Convives : document.getElementById('nbConvivesBrunch').value,
        Nb_Pieces_Salees : document.getElementById('typeBrunchSale').value,
        Nb_Pieces_Sucrees : document.getElementById('typeBrunchSucre').value,
        Liste_Id_Recettes_Salees : Array.from(document.getElementById('listeRecettesSaleesBrunch').children).map(elt => elt.getAttribute('id') !== null ?  elt.getAttribute('id').split('_')[1] : '').toString().replace(/,/g,';'),
        Liste_Id_Recettes_Sucrees : Array.from(document.getElementById('listeRecettesSucreesBrunch').children).map(elt => elt.getAttribute('id') !== null ?  elt.getAttribute('id').split('_')[1] : '').toString().replace(/,/g,';'),
        Liste_Id_Recettes_Boissons : Array.from(document.getElementById('listeRecettesBoissonsBrunch').children).map(elt => elt.getAttribute('id') !== null ? elt.getAttribute('id').split('_')[1] : '').toString().replace(/,/g,';')
    }
}

// récupère le commentaire
const getCommentaire = () => {
    return document.getElementById('Commentaire').value
}

// récupère la liste des options
const getListeOptions = () => {
    return Array.from(document.getElementById('listeOptions').children).map(elt => elt.getAttribute('id') !== null ? elt.getAttribute('id').split('_')[1] : '').toString().replace(/,/g,';')
}

//  récupère les infos de la remise
const getRemise = () => {
    // pas de remise
    if(document.getElementById('nomRemise') === null) {
        return null
    }

    let valeur = document.getElementById('valeurRemise').value
    valeur = valeur.replace(',', '.')

    return {
        Nom : document.getElementById('nomRemise').value,
        IsPourcent : document.getElementById('IsRemisePourcentage').checked,
        Valeur : Number(valeur)
    }
}

// enregistre le client dans l'objet global
const saveClient = () => {
    global.client = getClient()
}

// enregistre la date de l'évènement
const saveDateEvenement = () => {
    global.Date_Evenement = getDateEvenement()
}

// enregistre l'adresse de livraison dans l'objet global
const saveAdresseLivraison = () => {
    global.Adresse_Livraison = getAdresseLivraison()
}

// enregistre le commentaire dans l'objet global
const saveCommentaire = () => {
    global.Commentaire = getCommentaire()
}

// enregistre la formule Aperitif dans l'objet global et met à jour le prix
const saveFormuleAperitif = () => {
    global.Formule_Aperitif = getFormuleAperitif()

    // màj des prix
    const prixPieceSalee = Array.from(document.getElementById('divPrix_unitaire').children).find(div => div.getAttribute('data-nom') === 'Pièce salée').getAttribute('data-montant')
    const prixParPersonne = global.Formule_Aperitif.isAperitif ? (global.Formule_Aperitif.Nb_Pieces_Salees * prixPieceSalee) : 0
    prixHT = prixParPersonne * global.Formule_Aperitif.Nb_Convives

    prix.Aperitif = {
        prixParPersonne,
        prixHT
    }

    updateRecap()
}

// enregistre la formule Cocktail dans l'objet global et met à jour le prix
const saveFormuleCocktail = () => {
    global.Formule_Cocktail = getFormuleCocktail()

    // màj des prix
    const prixPieceSalee = Array.from(document.getElementById('divPrix_unitaire').children).find(div => div.getAttribute('data-nom') === 'Pièce salée').getAttribute('data-montant')
    const prixSaleParPersonne = global.Formule_Cocktail.isCocktail ? (global.Formule_Cocktail.Nb_Pieces_Salees * prixPieceSalee) : 0

    const prixPieceSucree = Array.from(document.getElementById('divPrix_unitaire').children).find(div => div.getAttribute('data-nom') === 'Pièce sucrée').getAttribute('data-montant')
    const prixSucreParPersonne = global.Formule_Cocktail.isCocktail ? (global.Formule_Cocktail.Nb_Pieces_Sucrees * prixPieceSucree) : 0

    const prixParPersonne = prixSaleParPersonne + prixSucreParPersonne
    const prixHT = prixParPersonne * global.Formule_Cocktail.Nb_Convives

    prix.Cocktail = {
        prixParPersonne,
        prixHT
    }

    updateRecap()
}

// enregistre la formule Box dans l'objet global et met à jour le prix
const saveFormuleBox = () => {
    global.Formule_Box = getFormuleBox()

    // màj des prix 
    const prixParPersonne = global.Formule_Box.isBox ? Array.from(document.getElementById('divPrix_unitaire').children).find(div => div.getAttribute('data-nom') === 'Box').getAttribute('data-montant') : 0
    const prixHT = prixParPersonne * global.Formule_Box.Nb_Convives

    prix.Box = {
        prixParPersonne,
        prixHT
    }

    updateRecap()
}

// enregistre la formule Brunch dans l'objet global et met à jour le prix
const saveFormuleBrunch = () => {
    global.Formule_Brunch = getFormuleBrunch()

    // màj des prix
    let prixBrunchSaleParPersonne = 0
    let prixBrunchSucreParPersonne = 0

    if(global.Formule_Brunch.isBrunch) {
        if(global.Formule_Brunch.Nb_Pieces_Salees > 0 && document.getElementById('isBrunchSale').checked) {
            let typePrestationSalee = selectPiecesSaleesBrunch.selectedOptions[0].text === 'Petite Faim' ? 'Petit' : 'Grand'
            typePrestationSalee += ' brunch salé'
            prixBrunchSaleParPersonne = Array.from(document.getElementById('divPrix_unitaire').children).find(div => div.getAttribute('data-nom') === typePrestationSalee).getAttribute('data-montant')
        }
        if(global.Formule_Brunch.Nb_Pieces_Sucrees > 0 && document.getElementById('isBrunchSucre').checked) {
            let typePrestationSucree = selectPiecesSucreesBrunch.selectedOptions[0].text === 'Petite Faim' ? 'Petit' : 'Grand'
            typePrestationSucree += ' brunch sucré'
            prixBrunchSucreParPersonne = Array.from(document.getElementById('divPrix_unitaire').children).find(div => div.getAttribute('data-nom') === typePrestationSucree).getAttribute('data-montant')
        }
    }

    const prixParPersonne = Number.parseFloat(prixBrunchSaleParPersonne) + Number.parseFloat(prixBrunchSucreParPersonne)
    const prixHT = prixParPersonne * global.Formule_Brunch.Nb_Convives

    prix.Brunch = {
        prixParPersonne,
        prixHT
    }

    updateRecap()
}

// enregistre la liste d'options dans l'objet global et met à jour le prix
const saveListeOptions = () => {
    global.Liste_Options = getListeOptions()
    
    let prixHT = 0
    const options = global.Liste_Options.split(';')
    const divPrix = Array.from(document.getElementById('divPrix_unitaire').children)
    for(const option of options) {
        if(option !== '') {
            const temp_id = `prix_${option}`
            prixHT += Number(divPrix.find(div => div.getAttribute('data-id') === temp_id).getAttribute('data-montant'))
        }
    }

    prix.Liste_Options = {
        prixHT
    }

    updateRecap()
}

// enregistre la remise dans l'objet global
// le prix est mis à jour dans updateRecap() car s'il est en % il dépend du prix total
const saveRemise = () => {
    global.Remise = getRemise()

    updateRecap()
}

// modifie l'affichage si la formule Aperitif change
const changeAperitif = () => {
    const nbPiecesSaleesAperitif = document.getElementById('nbPiecesSaleesAperitif').value
    const listeRecettesSaleesAperitif = document.getElementById('listeRecettesSaleesAperitif')
    const tailleListePiecesSaleesAperitif = listeRecettesSaleesAperitif.children.length

    if(nbPiecesSaleesAperitif == 0) {
        // vide la liste
        while(listeRecettesSaleesAperitif.firstChild) {
            listeRecettesSaleesAperitif.removeChild(listeRecettesSaleesAperitif.firstChild)
        }
    }
    else {
        // il manque des +
        if(nbPiecesSaleesAperitif > tailleListePiecesSaleesAperitif) {  
            const diff = nbPiecesSaleesAperitif - tailleListePiecesSaleesAperitif
            for(let i = 0 ; i < diff; i++) {
                const li = document.createElement('li')
                li.innerHTML = '+'
                li.setAttribute('data-for', 'SaleAperitif')
                li.onclick = selectElementList
                listeRecettesSaleesAperitif.append(li)
            }
        }   
        // il y a trop d'éléments
        if(nbPiecesSaleesAperitif < tailleListePiecesSaleesAperitif) {
            const diff = tailleListePiecesSaleesAperitif - nbPiecesSaleesAperitif
            for(let i = 0; i < diff; i++) {
                const li = listeRecettesSaleesAperitif.lastChild
                listeRecettesSaleesAperitif.removeChild(li)
            }
        }
    }

    saveFormuleAperitif()
}

// modifie l'affichage si la formule Cocktail change
const changeCocktail = () => {
    // salé
    const nbPiecesSaleesCocktail = document.getElementById('nbPiecesSaleesCocktail').value
    const listeRecettesSaleesCocktail = document.getElementById('listeRecettesSaleesCocktail')
    const tailleListePiecesSaleesCocktail = listeRecettesSaleesCocktail.children.length

    if(nbPiecesSaleesCocktail == 0) {
        // vide la liste
        while(listeRecettesSaleesCocktail.firstChild) {
            listeRecettesSaleesCocktail.removeChild(listeRecettesSaleesCocktail.firstChild)
        }
    }
    else {
        // il manque des +
        if(nbPiecesSaleesCocktail > tailleListePiecesSaleesCocktail) {  
            const diff = nbPiecesSaleesCocktail - tailleListePiecesSaleesCocktail
            for(let i = 0 ; i < diff; i++) {
                const li = document.createElement('li')
                li.innerHTML = '+'
                li.setAttribute('data-for', 'SaleCocktail')
                li.onclick = selectElementList
                listeRecettesSaleesCocktail.append(li)
            }
        }   
        // il y a trop d'éléments
        if(nbPiecesSaleesCocktail < tailleListePiecesSaleesCocktail) {
            const diff = tailleListePiecesSaleesCocktail - nbPiecesSaleesCocktail
            for(let i = 0; i < diff; i++) {
                const li = listeRecettesSaleesCocktail.lastChild
                listeRecettesSaleesCocktail.removeChild(li)
            }
        }
    }


    // sucré
    const nbPiecesSucreesCocktail = document.getElementById('nbPiecesSucreesCocktail').value
    const listeRecettesSucreesCocktail = document.getElementById('listeRecettesSucreesCocktail')
    const tailleListePiecesSucreesCocktail = listeRecettesSucreesCocktail.children.length

    if(nbPiecesSucreesCocktail == 0) {
        // vide la liste
        while(listeRecettesSucreesCocktail.firstChild) {
            listeRecettesSucreesCocktail.removeChild(listeRecettesSucreesCocktail.firstChild)
        }
    }
    else {
        // il manque des +
        if(nbPiecesSucreesCocktail > tailleListePiecesSucreesCocktail) {  
            const diff = nbPiecesSucreesCocktail - tailleListePiecesSucreesCocktail
            for(let i = 0 ; i < diff; i++) {
                const li = document.createElement('li')
                li.innerHTML = '+'
                li.setAttribute('data-for', 'SucreCocktail')
                li.onclick = selectElementList
                listeRecettesSucreesCocktail.append(li)
            }
        }   
        // il y a trop d'éléments
        if(nbPiecesSucreesCocktail < tailleListePiecesSucreesCocktail) {
            const diff = tailleListePiecesSucreesCocktail - nbPiecesSucreesCocktail
            for(let i = 0; i < diff; i++) {
                const li = listeRecettesSucreesCocktail.lastChild
                listeRecettesSucreesCocktail.removeChild(li)
            }
        }
    }

    saveFormuleCocktail()
}

// modifie l'affichage si la formule Box change
const changeBox = () => {

    saveFormuleBox()
}

// modifie l'affichage si la formule Brunch change
const changeBrunch = () => {
    // salé
    const nbPiecesSaleesBrunch = document.getElementById('typeBrunchSale').value
    const listeRecettesSaleesBrunch = document.getElementById('listeRecettesSaleesBrunch')
    const tailleListePiecesSaleesBrunch = listeRecettesSaleesBrunch.children.length

    if(nbPiecesSaleesBrunch == 0) {
        // vide la liste
        while(listeRecettesSaleesBrunch.firstChild) {
            listeRecettesSaleesBrunch.removeChild(listeRecettesSaleesBrunch.firstChild)
        }
    }
    else {
        // il manque des +
        if(nbPiecesSaleesBrunch > tailleListePiecesSaleesBrunch) {  
            const diff = nbPiecesSaleesBrunch - tailleListePiecesSaleesBrunch
            for(let i = 0 ; i < diff; i++) {
                const li = document.createElement('li')
                li.innerHTML = '+'
                li.setAttribute('data-for', 'SaleBrunch')
                li.onclick = selectElementList
                listeRecettesSaleesBrunch.append(li)
            }
        }   
        // il y a trop d'éléments
        if(nbPiecesSaleesBrunch < tailleListePiecesSaleesBrunch) {
            const diff = tailleListePiecesSaleesBrunch - nbPiecesSaleesBrunch
            for(let i = 0; i < diff; i++) {
                const li = listeRecettesSaleesBrunch.lastChild
                listeRecettesSaleesBrunch.removeChild(li)
            }
        }
    }


    // sucré
    const nbPiecesSucreesBrunch = document.getElementById('typeBrunchSucre').value
    const listeRecettesSucreesBrunch = document.getElementById('listeRecettesSucreesBrunch')
    const tailleListePiecesSucreesBrunch = listeRecettesSucreesBrunch.children.length

    if(nbPiecesSucreesBrunch == 0) {
        // vide la liste
        while(listeRecettesSucreesBrunch.firstChild) {
            listeRecettesSucreesBrunch.removeChild(listeRecettesSucreesBrunch.firstChild)
        }
    }
    else {
        // il manque des +
        if(nbPiecesSucreesBrunch > tailleListePiecesSucreesBrunch) {  
            const diff = nbPiecesSucreesBrunch - tailleListePiecesSucreesBrunch
            for(let i = 0 ; i < diff; i++) {
                const li = document.createElement('li')
                li.innerHTML = '+'
                li.setAttribute('data-for', 'SucreBrunch')
                li.onclick = selectElementList
                listeRecettesSucreesBrunch.append(li)
            }
        }   
        // il y a trop d'éléments
        if(nbPiecesSucreesBrunch < tailleListePiecesSucreesBrunch) {
            const diff = tailleListePiecesSucreesBrunch - nbPiecesSucreesBrunch
            for(let i = 0; i < diff; i++) {
                const li = listeRecettesSucreesBrunch.lastChild
                listeRecettesSucreesBrunch.removeChild(li)
            }
        }
    }

    saveFormuleBrunch()
}

// ajoute la class selected à une li de la liste d'élements sélectionnés pour pouvoir la sélectionner
const selectElementList = (event) => {
    // on retire la class du précédent élément
    if(selectedElements.element !== null) {
        const li = selectedElements.element
        li.setAttribute('class', '')
    }

    // on récupère le nouvel élément, l'ajoute dans notre objet de gestion et lui donne la class selected
    const li = event.target
    li.setAttribute('class', 'selected')
    selectedElements.element = li
}

// ajoute la class selected à une li de recette pour pouvoir la sélectionner
const selectRecette = (event) => {
    // on retire la class de la précédente recette
    if(selectedElements.recette !== null) {
        const li = selectedElements.recette
        li.setAttribute('class', '')
    }

    // on récupère la nouvelle recette, l'ajoute à notre objet de gestion et lui donne la class selected
    const li = event.target
    li.setAttribute('class', 'selected')
    selectedElements.recette = li
}

// ajoute la recette sélectionnée dans la liste de recettes sélectionnées adéquate
const ajouteRecette = (event) => {
    const btn = event.target
    const { recette, element } = selectedElements

    // on vérifie que les éléments ont été sélectionnés et qu'ils appartiennent à la même catégorie
    if(recette !== null && element !== null && recette.getAttribute('data-for') === btn.getAttribute('data-for') && element.getAttribute('data-for') === btn.getAttribute('data-for')) {
        const isReplacement = element.getAttribute('id') !== null
        // copie des éléments
        const elementClone = element.cloneNode()
        elementClone.innerHTML = element.innerHTML
        const recetteClone = recette.cloneNode()
        recetteClone.innerHTML = recette.innerHTML
        // remise à null de l'objet de gestion
        selectedElements.recette = null
        selectedElements.element = null
        // retire de la class selected
        recette.setAttribute('class', '')
        element.setAttribute('class', '')
        // attribution à l'élément des infos de la recette
        element.setAttribute('id', recette.getAttribute('id'))
        element.innerHTML = recette.innerHTML

        // dans le cas où ce n'est pas un remplacement ou des boissons et la formule box on rajoute de nouveau un +
        if(!isReplacement && (element.getAttribute('data-for').indexOf('Boissons') !== -1 || element.getAttribute('data-for').indexOf('Box') !== -1)) {
            const li = document.createElement('li')
            li.innerHTML = '+'
            li.setAttribute('data-for', element.getAttribute('data-for'))
            li.onclick = selectElementList
            element.parentElement.append(li)
        }

        // si c'est une option on déplace l'élément d'une colonne à l'autre
        // on appelle la fonction save ici car pas de onchange sur ul
        if(element.getAttribute('data-for').indexOf('Options') !== -1) {
            // dans le cas d'un replacement l'échange doit s'effectuer dans les deux sens
            element.setAttribute('id', recetteClone.getAttribute('id'))
            element.innerHTML = recetteClone.innerHTML
            if(isReplacement) {     
                recette.setAttribute('id', elementClone.getAttribute('id'))
                recette.innerHTML = elementClone.innerHTML
            }
            else {
                recette.parentElement.removeChild(recette)

                const li = document.createElement('li')
                li.innerHTML = '+'
                li.setAttribute('data-for', element.getAttribute('data-for'))
                li.onclick = selectElementList
                element.parentElement.append(li)
            }
            
            saveListeOptions()
        }

        // on appelle les fonctions de sauvegarde pour chaque catégorie modifiée pour enregistrer le changement
        if(element.getAttribute('data-for').indexOf('Aperitif') !== -1) saveFormuleAperitif()
        if(element.getAttribute('data-for').indexOf('Cocktail') !== -1) saveFormuleCocktail()
        if(element.getAttribute('data-for').indexOf('Box') !== -1) saveFormuleBox()
        if(element.getAttribute('data-for').indexOf('Brunch') !== -1) saveFormuleBrunch()
    }
}

const retireRecette = (event) => {
    const btn = event.target
    const element = selectedElements.element

    // on vérifie qu'un element de la liste a été sélectionné et que c'est bien celui de cette liste que l'on souhaite retirer
    if(element != null && element.getAttribute('id') !== null && element.getAttribute('data-for') === btn.getAttribute('data-for')) {
        // remise à null de l'element dans l'objet de gestion
        selectedElements.element = null

        // si c'est une option on appelle la fonction save ici car pas de onchange sur ul
        if(element.getAttribute('data-for').indexOf('Options') !== -1) {
            const li = document.createElement('li')
            li.setAttribute('id', element.getAttribute('id'))
            li.setAttribute('data-for', 'Options')
            li.innerHTML = element.innerHTML            
            document.getElementById('Options').appendChild(li)      
        }

        // l'élément est réellement retiré pour les box, les boissons et les options s'il y a plus d'1 élément
        if((element.getAttribute('data-for').indexOf('Boissons') !== -1 || element.getAttribute('data-for').indexOf('Box') !== -1 || element.getAttribute('data-for').indexOf('Options') !== -1) && element.parentElement.children.length > 1) {
            // retire l'element de la liste
            element.parentElement.removeChild(element)
        }
        else {
            // modifie l'élément
            element.removeAttribute('id')
            element.innerHTML = '+'
        }

        // une fois que le traitement a eu lieu, on peut enregistrer la liste des options si c'est celle-ci qui a été modifiée
        if(element.getAttribute('data-for').indexOf('Options') !== -1) saveListeOptions()

        // on appelle les fonctions de sauvegarde pour chaque catégorie modifiée pour enregistrer le changement
        if(element.getAttribute('data-for').indexOf('Aperitif') !== -1) saveFormuleAperitif()
        if(element.getAttribute('data-for').indexOf('Cocktail') !== -1) saveFormuleCocktail()
        if(element.getAttribute('data-for').indexOf('Box') !== -1) saveFormuleBox()
        if(element.getAttribute('data-for').indexOf('Brunch') !== -1) saveFormuleBrunch()
    }
}

const ajouteRemise = (event) => {
    const btn = event.target
    const { recette } = selectedElements
    const div = document.getElementById('divCurrentRemise')

    if(recette !== null && recette.getAttribute('data-for') === 'Remises' && btn.getAttribute('data-for') === 'Remises') {
        // remise à null de l'objet de gestion
        selectedElements.recette = null
        // retire de la class selected
        recette.setAttribute('class', '')
        
        // les valeurs sont initialisées pour la remise custom
        let nom = ''
        let pourcent = ''
        let euros = 'checked'
        let valeur = ''

        // pour une remise prédéfinie on récupère les valeurs
        if(recette.getAttribute('id') !== 'remiseCustom') {
            nom = recette.innerHTML

            if(recette.getAttribute('data-isPourcent') === 'true') {
                pourcent = 'checked'
                euros = ''
            }
            
            valeur = Number(recette.getAttribute('data-valeur'))
            attrDisabled = 'disabled'
        }

        div.innerHTML = `
            <p>
                <label for="nomRemise">Nom : </label><input id="nomRemise" type="text" placeholder="Remise de 5€ (fidélité)" value="${nom}"><br>                
                <label>Valeur : </label><input id="valeurRemise" type="number" placeholder="5" min="0" step=".01" value="${valeur}">
                <label for="IsRemiseValeur">€</label><input type="radio" id="IsRemiseValeur" name="IsPourcent" ${euros}>
                <label for="IsRemisePourcentage">%</label><input type="radio" id="IsRemisePourcentage" name="IsPourcent" ${pourcent}><br>
            </p>
        `
        // gestion du changement de la valeur ou du type de remise
        document.getElementById('nomRemise').onchange = saveRemise
        document.getElementById('valeurRemise').onchange = saveRemise
        document.getElementById('IsRemiseValeur').onchange = saveRemise
        document.getElementById('IsRemisePourcentage').onchange = saveRemise
        
        saveRemise()
    }
}

const retireRemise = () => {
    const div = document.getElementById('divCurrentRemise')
    div.innerHTML = "<p>Aucune</p>"

    saveRemise()
}

// met à jour l'affichage des prix depuis l'objet prix
const updateRecap = () => {
    let prixAperitifHT = 0
    let prixCocktailHT = 0
    let prixBoxHT = 0
    let prixBrunchHT = 0
    let prixOptionsHT = 0
    let prixTotalHT = 0

    if(prix.Aperitif) {
        // Aperitif
        document.getElementById('prixAperitifParPersonne').innerHTML = `${Number.parseFloat(prix.Aperitif.prixParPersonne).toFixed(2)} HT/pers.`
        prixAperitifHT = prix.Aperitif.prixHT
        document.getElementById('prixAperitifHT').innerHTML = `${Number.parseFloat(prixAperitifHT).toFixed(2)} HT`
    }

    if(prix.Cocktail) {
        // Cocktail
        document.getElementById('prixCocktailParPersonne').innerHTML = `${Number.parseFloat(prix.Cocktail.prixParPersonne).toFixed(2)} HT/pers.`
        prixCocktailHT = prix.Cocktail.prixHT 
        document.getElementById('prixCocktailHT').innerHTML = `${Number.parseFloat(prixCocktailHT).toFixed(2)} HT`
    }

    if(prix.Box) {
        // Box
        document.getElementById('prixBoxParPersonne').innerHTML = `${Number.parseFloat(prix.Box.prixParPersonne).toFixed(2)} HT/pers.`
        prixBoxHT = prix.Box.prixHT 
        document.getElementById('prixBoxHT').innerHTML = `${Number.parseFloat(prixBoxHT).toFixed(2)} HT`
    }

    if(prix.Brunch) {
        // Brunch
        document.getElementById('prixBrunchParPersonne').innerHTML = `${Number.parseFloat(prix.Brunch.prixParPersonne).toFixed(2)} HT/pers.`
        prixBrunchHT = prix.Brunch.prixHT 
        document.getElementById('prixBrunchHT').innerHTML = `${Number.parseFloat(prixBrunchHT).toFixed(2)} HT`
    }

    if(prix.Liste_Options) {
        // options
        let stringOptions = ''
        const options = global.Liste_Options.split(';')
        const tabOptions = Array.from(document.getElementById('divPrix_unitaire').children)
        const entete = 'prix_'
        for(const option of options) {
            if(option !== '') {
                const div = tabOptions.find(div => div.getAttribute('data-id') === `${entete}${option}`)
                const nom  = div.getAttribute('data-nom')
                const montant = div.getAttribute('data-montant')
                stringOptions += `${nom} (${montant}) `
            }
        }
        prixOptionsHT = prix.Liste_Options.prixHT
        document.getElementById('affichageListeOptions').innerHTML = stringOptions
        document.getElementById('prixOptions').innerHTML = `${Number.parseFloat(prixOptionsHT).toFixed(2)} HT`
    }   

    // total
    prixTotalHT += prixAperitifHT + prixCocktailHT + prixBoxHT + prixBrunchHT + prixOptionsHT

    // remise
    // s'il y a une remise
    let prixRemise = 0
    let affichageTextRemise = ''
    let affichagePrixRemise = Number(prixRemise).toFixed(2) + ' HT'
    if(global.Remise && global.Remise !== null) {
        // cas pourcentage
        if(global.Remise.IsPourcent) {
            prixRemise = prixTotalHT * (global.Remise.Valeur / 100)
        }
        // cas valeur
        else {
            prixRemise = global.Remise.Valeur
        }
        affichageTextRemise = global.Remise.Nom
        affichagePrixRemise = Number(prixRemise).toFixed(2) + ' HT'
    }    
    document.getElementById('affichageRemise').innerHTML = affichageTextRemise
    document.getElementById('prixRemise').innerHTML =  affichagePrixRemise
    prixTotalHT -= prixRemise

    prixTotalTTC = prixTotalHT * 1.1
    document.getElementById('prixTotalHT').innerHTML = `Prix HT : ${Number.parseFloat(prixTotalHT).toFixed(2)}€`
    document.getElementById('prixTotalTTC').innerHTML = `Prix TTC : ${Number.parseFloat(prixTotalTTC).toFixed(2)}€`
}

const createDevis = async () => {
    const div = document.getElementById('divInfos')
    div.innerHTML = ''
    div.classList.remove('messageError')
    div.classList.remove('messageConf')
    // enregistrement des infos autres que les formules qui sont actualisées lors d'un changement
    saveClient()
    saveDateEvenement()
    saveAdresseLivraison()
    saveCommentaire()

    const prixTotalTTC = Number(document.getElementById('prixTotalTTC').innerHTML.replace('Prix TTC : ', '').replace('€', ''))
    if(prixTotalTTC > 0) {
        const url = `/devis/${global.Id_Devis}`
        const options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method : 'PATCH',
            body : JSON.stringify(global)
        }

        const response = await fetch(url, options)
        if(response.ok) {
            const data = await response.json()
            const { infos, devis } = data
            
            if(infos.message) {
                alert(`${infos.message} Vous allez être redirigé vers celui-ci.`)
                location.replace(`/devis/${devis.Id_Devis}`)
            }
            if(infos.error) {
                div.classList.add('messageError')
                div.innerHTML = infos.error
            }
        }
    }
    else {
        div.classList.add('messageError')
        div.innerHTML = 'Le prix ne peut pas être négatif.'
    }
}

// TODO:archiveDevis
const archiveDevis = async () => {
    const div = document.getElementById('divInfos')
    div.innerHTML = ''
    div.classList.remove('messageError')
    div.classList.remove('messageConf')

    const url = `/devis/archive/${global.Id_Devis}`
    const options = {
        method : 'PATCH'
    }

    const response = await fetch(url, options)
    if(response.ok) {
        const data = await response.json()
        const { infos } = data
        
        if(infos.message) {
            alert(infos.message)
            location.replace('/devis')
        }
        if(infos.error) {
            div.classList.add('messageError')
            div.innerHTML = infos.error
        }
    }
}

const saveDevis = async () => {
    const div = document.getElementById('divInfos')
    div.innerHTML = ''
    div.classList.remove('messageError')
    div.classList.remove('messageConf')
    // enregistrement des infos autres que les formules qui sont actualisées lors d'un changement
    saveClient()
    saveDateEvenement()
    saveAdresseLivraison()
    saveCommentaire()

    const prixTotalTTC = Number(document.getElementById('prixTotalTTC').innerHTML.replace('Prix TTC : ', '').replace('€', ''))
    if(prixTotalTTC > 0) {
        const url = `/devis/${global.Id_Devis}`
        const options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method : 'PATCH',
            body : JSON.stringify(global)
        }

        const response = await fetch(url, options)
        if(response.ok) {
            const data = await response.json()
            const { infos } = data
            
            if(infos.message) {
                div.classList.add('messageConf')
                div.innerHTML = infos.message
            }
            if(infos.error) {
                div.classList.add('messageError')
                div.innerHTML = infos.error
            }
        }
    }
    else {
        div.classList.add('messageError')
        div.innerHTML = 'Le prix ne peut pas être négatif.'
    }
}

// dans un second temps, envoie par mail
const sendDevis = async () => {
    const div = document.getElementById('divInfos')
    div.innerHTML = ''
    div.classList.remove('messageError')
    div.classList.remove('messageConf')
    // enregistrement des infos autres que les formules qui sont actualisées lors d'un changement
    saveClient()
    saveDateEvenement()
    saveAdresseLivraison()
    saveCommentaire()

    const prixTotalTTC = Number(document.getElementById('prixTotalTTC').innerHTML.replace('Prix TTC : ', '').replace('€', ''))
    if(prixTotalTTC > 0) {
        // enregistre les potentielles modifs
        let url = `/devis/${global.Id_Devis}`
        let options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method : 'PATCH',
            body : JSON.stringify(global)
        }

        const response = await fetch(url, options)
        if(response.ok) {
            const data = await response.json()
            const { infos } = data

            if(infos.error) {
                div.classList.add('messageError')
                div.innerHTML = infos.error
            }
            if(infos.message) {
                //  tout s'est bien passé
                div.classList.add('messageConf')
                div.innerHTML = infos.message

                url = `/devis/pdf/${encodeURI('CHEZ MES SOEURS - Devis ')}${global.Id_Devis}.pdf`
                window.open(url)
            }
        }
    }
    else {
        div.classList.add('messageError')
        div.innerHTML = 'Le prix ne peut pas être négatif.'
    }
}

// valide le devis et le transforme en facture
const toFacture = async () => {
    const div = document.getElementById('divInfos')
    div.innerHTML = ''
    div.classList.remove('messageError')
    div.classList.remove('messageConf')
    // enregistrement des infos autres que les formules qui sont actualisées lors d'un changement
    saveClient()
    saveDateEvenement()
    saveAdresseLivraison()
    saveCommentaire()

    const prixTotalTTC = Number(document.getElementById('prixTotalTTC').innerHTML.replace('Prix TTC : ', '').replace('€', ''))
    if(prixTotalTTC > 0) {
        // enregistre les potentielles modifs
        let url = `/devis/${global.Id_Devis}`
        let options = {
            headers: {
                'Content-Type': 'application/json'
            },
            method : 'PATCH',
            body : JSON.stringify(global)
        }

        let response = await fetch(url, options)
        if(response.ok) {
            let data = await response.json()
            let { infos } = data

            if(infos.error) {
                div.classList.add('messageError')
                div.innerHTML = infos.error
            }
            if(infos.message) {
                //  tout s'est bien passé
                div.classList.add('messageConf')
                div.innerHTML = infos.message

                url = `/devis/validation/${global.Id_Devis}`
                options = {
                    method : 'POST'
                }

                response = await fetch(url, options)
                if(response.ok) {
                    data = await response.json()
                    let { infos, facture } = data

                    if(infos.error) {
                        div.classList.add('messageError')
                        div.innerHTML = infos.error
                    }
                    else if(infos.message) {
                        alert(infos.message + ' Vous allez être redirigé.')
                        window.location = '/factures'
                    }
                }
            }
        }
    }
    else {
        div.classList.add('messageError')
        div.innerHTML = 'Le prix ne peut pas être négatif.'
    }
}

const initUX = () => {
    // gestion du clic sur les checkboxes pour l'affichage
    isAperitifCheckbox.onclick = toggle
    isCocktailCheckbox.onclick = toggle
    isBoxCheckbox.onclick = toggle
    isBrunchCheckbox.onclick = toggle
    isBrunchSaleCheckbox.onclick = toggle
    isBrunchSucrecheckbox.onclick = toggle

    // gestion du changement du nombre de convives
    inputNbConvivesAperitif.onchange = changeAperitif
    inputNbConvivesCocktail.onchange = changeCocktail
    inputNbConvivesBox.onchange = changeBox
    inputNbConvivesBrunch.onchange = changeBrunch

    // gestion du changemnt du nombre de pièces par personne
    selectPiecesSaleesAperitif.onchange = changeAperitif
    selectPiecesSaleesCocktail.onchange = changeCocktail
    selectPiecesSucreesCocktail.onchange = changeCocktail
    selectPiecesSaleesBrunch.onchange = changeBrunch
    selectPiecesSucreesBrunch.onchange = changeBrunch

    // gestion du clic sur les éléments de la liste des recettes sélectionnées
    Array.from(document.getElementById('listeRecettesSaleesAperitif').children).forEach(li => li.onclick = selectElementList)
    Array.from(document.getElementById('listeRecettesBoissonsAperitif').children).forEach(li => li.onclick = selectElementList)
    Array.from(document.getElementById('listeRecettesSaleesCocktail').children).forEach(li => li.onclick = selectElementList)
    Array.from(document.getElementById('listeRecettesSucreesCocktail').children).forEach(li => li.onclick = selectElementList)
    Array.from(document.getElementById('listeRecettesBoissonsCocktail').children).forEach(li => li.onclick = selectElementList)
    Array.from(document.getElementById('listeRecettesSaleesBox').children).forEach(li => li.onclick = selectElementList)
    Array.from(document.getElementById('listeRecettesSucreesBox').children).forEach(li => li.onclick = selectElementList)
    Array.from(document.getElementById('listeRecettesBoissonsBox').children).forEach(li => li.onclick = selectElementList)
    Array.from(document.getElementById('listeRecettesSaleesBrunch').children).forEach(li => li.onclick = selectElementList)
    Array.from(document.getElementById('listeRecettesSucreesBrunch').children).forEach(li => li.onclick = selectElementList)
    Array.from(document.getElementById('listeRecettesBoissonsBrunch').children).forEach(li => li.onclick = selectElementList)
    Array.from(document.getElementById('listeOptions').children).forEach(li => li.onclick = selectElementList)

    // gestion du clic sur les recettes sélectionnables
    Array.from(document.getElementById('recettesSaleesAperitif').children).forEach(li => li.onclick = selectRecette)
    Array.from(document.getElementById('recettesBoissonsAperitif').children).forEach(li => li.onclick = selectRecette)
    Array.from(document.getElementById('recettesSaleesCocktail').children).forEach(li => li.onclick = selectRecette)
    Array.from(document.getElementById('recettesSucreesCocktail').children).forEach(li => li.onclick = selectRecette)
    Array.from(document.getElementById('recettesBoissonsCocktail').children).forEach(li => li.onclick = selectRecette)
    Array.from(document.getElementById('recettesSaleesBox').children).forEach(li => li.onclick = selectRecette)
    Array.from(document.getElementById('recettesSucreesBox').children).forEach(li => li.onclick = selectRecette)
    Array.from(document.getElementById('recettesBoissonsBox').children).forEach(li => li.onclick = selectRecette)
    Array.from(document.getElementById('recettesSaleesBrunch').children).forEach(li => li.onclick = selectRecette)
    Array.from(document.getElementById('recettesSucreesBrunch').children).forEach(li => li.onclick = selectRecette)
    Array.from(document.getElementById('recettesBoissonsBrunch').children).forEach(li => li.onclick = selectRecette)
    Array.from(document.getElementById('Options').children).forEach(li => li.onclick = selectRecette)
    Array.from(document.getElementById('Remises').children).forEach(li => li.onclick = selectRecette)

    // ajoute le clic sur les boutons d'ajout et de retrait de recettes
    tabBtnAjouteRecette.forEach(btn => btn.onclick = ajouteRecette)
    tabBtnRetireRecette.forEach(btn => btn.onclick = retireRecette)

    // ajoute le clic sur les boutons d'ajout et de retrait de remises
    document.getElementsByClassName('btnAjouteRemise')[0].onclick = ajouteRemise
    document.getElementsByClassName('btnRetireRemise')[0].onclick = retireRemise

    // ajout des clics des boutons d'action de bas de page
    if(document.getElementById('Id_Devis') !== null) {
        document.getElementById('btnArchiveDevis').onclick = archiveDevis
        document.getElementById('btnSaveDevis').onclick = saveDevis
        document.getElementById('btnSendDevis').onclick = sendDevis
        document.getElementById('btnToFacture').onclick = toFacture
    }
    else {
        document.getElementById('btnCreateDevis').onclick = createDevis
    }
}



window.addEventListener("DOMContentLoaded", () => {
    $( "#Date_Evenement" ).datepicker($.datepicker.regional['fr']);
    initAffichage()
    setGlobals()
    initUX()
});