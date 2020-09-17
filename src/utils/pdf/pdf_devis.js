/* eslint-disable max-params */
/* eslint-disable no-param-reassign */
const PDFDocument = require('pdfkit')
const moment = require('moment')

const pixelsToPoints = (px) => {
    return Math.round(px * 0.75)
}

// **** init des valeurs globals
//  création objet pdf
let doc = {}
let largeurPage = 0
// hauteur et largeur en points tels que définis dans la doc
const A4 = { hauteur : 841.89, largeur : 595.28 }
let hauteurPage = 0

let yPos = 0
let xPos = 0

const backgroundColor = '#f4f4f4'
const paddingPageContent = { top : pixelsToPoints(5), bottom : pixelsToPoints(5), left : pixelsToPoints(15), right : pixelsToPoints(15) }
const fontTitles = 'Times-Bold'
const fontSizeTitles = pixelsToPoints(14)
const paddingTitles = { top : pixelsToPoints(18.62), bottom : pixelsToPoints(18.62), left : pixelsToPoints(10), right : pixelsToPoints(10) }
const fontContent = 'Times-Roman'
const fontSizeContent = pixelsToPoints(14)
const paddingContent = { top : pixelsToPoints(10), bottom : pixelsToPoints(10), left : pixelsToPoints(10), right : pixelsToPoints(10) }
const fontFooter = 'Times-Roman'
// const fontFooter = 'Helvetica'
const fontSizeFooter = pixelsToPoints(12)

const srcLogo = __dirname + '/../../../public/img/logo_cmstraiteur.png'

const paddingGeneralHeader = pixelsToPoints(15)
const heightLogo = pixelsToPoints(80)
const generalHeaderHeight = paddingGeneralHeader + heightLogo + paddingGeneralHeader
// const generalFooterHeight = 100.02 // calculé dans le draw puis output en Helvetica
const generalFooterHeight = 67.176 //97.176 // calculé dans le draw puis output en Times

const pageDrawingSpace = {
    // top : (generalHeaderHeight + paddingPageContent.top),
    // bottom : (A4.hauteur - doc.page.margins.bottom - generalFooterHeight - paddingPageContent.bottom)
    top : 0,
    bottom : 0,
    width : 0
}

let devis = undefined
const setDevis = (d) => {
    devis = d
}
module.exports = (res, devis) => {
    if(devis === undefined) {
        throw 'Devis indisponible'
    }
    setDevis(devis)
    
    try {
        doc = new PDFDocument({ 
            bufferPages : true,
            size : 'A4', 
            margins : {
                top : 30,
                bottom : 30,
                left : 50,
                right : 50
            },
            info : { 
                Title : `CHEZ MES SOEURS - Devis ${devis.Numero_Devis}`,
                Author : 'CHEZ MES SOEURS'
            } 
        })
        largeurPage = (doc.page.width - (doc.page.margins.left + doc.page.margins.right))
        hauteurPage = (A4.hauteur - (doc.page.margins.top + doc.page.margins.bottom))

        pageDrawingSpace.top = generalHeaderHeight + paddingPageContent.top
        pageDrawingSpace.bottom = A4.hauteur - doc.page.margins.bottom - generalFooterHeight - paddingPageContent.bottom
        pageDrawingSpace.width = largeurPage - (paddingPageContent.left + paddingPageContent.right)

        

        // **** écriture du document
        console.log("PDF creation started")
        // dessin affichage
        drawFirstPage()
        if(devis.Formule_Aperitif.isAperitif) {
            drawFormuleAperitif()
        }
        if(devis.Formule_Cocktail.isCocktail) {
            drawFormuleCocktail()
        }
        if(devis.Formule_Box.isBox) {
            drawFormuleBox()
        }
        if(devis.Formule_Brunch.isBrunch) {
            drawFormuleBrunch()
        }
        drawLastPage()

        drawPagesNumber()
        
        console.log("PDF created correctly")
        // définition de la sortie
        // la définition se fait à la fin car bufferPages est à  true pour ensuite écrire les numéros de pages
        // mais également pour en cas d'erreur ne pas renvoyer un bout de document mais juste un message d'erreur
        doc.pipe(res)
    }
    catch(error) {
        console.log(error)
        throw 'Une erreur est survenue lors de l\'édition du devis.'
    }
    finally {
        doc.end()        
    }
}

const drawFirstPage = () => {
    drawHeaderFirstPage()
    drawTitleFirstPage()
    drawFooterFirstPage()
}

const drawHeaderFirstPage = () => {
    let content = ''
    if(devis.Client.Type === 'Particulier') {
        content = `${devis.Client.Prenom} ${devis.Client.Nom}`
    }
    else {
        content = `${devis.Client.Societe}`
    }

    doc
    .rect(doc.x, doc.y, (doc.page.width - (doc.page.margins.left + doc.page.margins.right)), 85.488)
    .fillAndStroke(backgroundColor)
    .fillColor('black', 1)
    .fontSize(pixelsToPoints(21))
    .font(fontContent)
    .moveDown()
    .text(`${content}\n${moment(devis.Date_Evenement).format('DD/MM/YYYY HH:mm')}\nDevis n° ${devis.Numero_Devis}`, { align : 'center' })
}

const drawTitleFirstPage = () => {
    const padding = pixelsToPoints(200)
    doc.moveDown()
    yPos = doc.y + padding
    doc.fillColor('black', 1).fontSize(pixelsToPoints(28))
    const string = 'PROPOSITION POUR EVENEMENT'
    const options = {width: (largeurPage / 2), align : 'center' }
    doc.text(string, (doc.x + (largeurPage / 4)), yPos, options)
    yPos += doc.heightOfString(string, options)
    yPos += padding
}

const drawFooterFirstPage = () => {
    let padding = pixelsToPoints(50)
    doc.rect(doc.page.margins.left, yPos, largeurPage, (hauteurPage - yPos + doc.page.margins.bottom)).fillAndStroke(backgroundColor)
    yPos += padding
    doc.image(srcLogo, (doc.page.margins.left + (largeurPage / 4)), yPos , { width : (largeurPage / 2), align : 'center' })

    padding = pixelsToPoints(150)
    yPos += padding
    doc.fontSize(pixelsToPoints(14)).fillColor('black', 1)
    const string1 = 'Anne-Sophie, Anne-Claire & Annabelle GRAPPIN'
    const string2 = 'CHEZ MES SOEURS - 18 AVENUE DE LA CONCORDE 21000 DIJON'
    const options = { align : 'center'}
    padding = pixelsToPoints(14)

    let height = 0
    height += padding + doc.heightOfString(string1, options) + padding
    height += padding + doc.heightOfString(string2, options) + padding
    yPos = (hauteurPage + doc.page.margins.bottom) - height

    yPos += padding
    doc.text(string1, doc.page.margins.left, yPos, options)
    yPos += padding + padding
    doc.text(string2, doc.page.margins.left, yPos, options)
}

const drawGeneralHeader = () => {    
    doc.rect(doc.page.margins.left, yPos, largeurPage, generalHeaderHeight).fillAndStroke(backgroundColor)
    
    yPos += paddingGeneralHeader

    doc.image(srcLogo, doc.page.margins.left, yPos, { height : heightLogo, align : 'left' })
    
    // const content = `Devis n° ${devis.Numero_Devis}`
    // const options = { align : 'center'}
    // const width = doc.widthOfString(content, options)
    // const height = doc.heightOfString(content, { ...options, width })

    // doc
    // .fillColor('black', 1)
    // .fontSize(pixelsToPoints(21))
    // .text(content, doc.page.margins.left, yPos - paddingGeneralHeader + (generalFooterHeight * 0.5), { ...options, height })

    yPos += generalHeaderHeight
}

const drawGeneralFooter = () => {
    doc.fontSize(fontSizeFooter).font(fontFooter).fillColor('black', 1)
    const string1 = 'Chez Mes Soeurs - 18 Avenue de la Concorde - 21000 DIJON'
    const string2 = '06 61 91 80 12 - chezmessoeurs@gmail.com'
    const string3 = 'SIRET - 831 826 672'
    const options = { align : 'center' }
    const padding = pixelsToPoints(12)

    let height = padding
    let width = doc.widthOfString(string1, options)
    height += doc.heightOfString(string1, { ...options, width })
    width = doc.widthOfString(string2, options)
    height += doc.heightOfString(string2, { ...options, width }) + padding
    width = doc.widthOfString(string3, options)
    height += doc.heightOfString(string3, { ...options, width })
    height += padding

    let tempY = hauteurPage - height + doc.page.margins.bottom
    // console.log('generalFooterHeight : ', height, 'tempY : ', tempY)
    doc.rect(doc.page.margins.left, tempY, largeurPage, height).fillAndStroke(backgroundColor)
    tempY += padding + (padding * 0.5)
    // doc.fontSize(fontSizeFooter).fillColor('black', 1)
    doc.fontSize(fontSizeFooter).font(fontFooter).fillColor('black', 1)
    doc.text(string1, doc.page.margins.left, tempY, options)
    tempY += padding + fontSizeFooter
    doc.text(string2, doc.page.margins.left, tempY, options)
    tempY += padding + fontSizeFooter
    doc.text(string3, doc.page.margins.left, tempY, options)
}

const newPage = (title = undefined) => {
    doc.addPage()
    yPos = doc.page.margins.top
    drawGeneralHeader()
    drawGeneralFooter()
    yPos += paddingPageContent.top
    if(title !== undefined) drawTitleFormule(title)
}

const drawTitleFormule = (title) => {
    const padding = pixelsToPoints(20)
    const fontSize = pixelsToPoints(20)
    doc.fillColor('black', 1).fontSize(fontSize)
    yPos += padding
    doc.text(title, doc.page.margins.left, yPos, { align : 'center' })
    yPos += fontSize + padding
}

const drawPagesNumber = () => {
    const range = doc.bufferedPageRange()
    doc.fontSize(pixelsToPoints(12)).fillColor('black', 1)
    let i = 0
    let end = 0
    for(i = range.start + 1, end = range.start + range.count, range.start <= end; i < end; i++) {
        doc.switchToPage(i)
        const string = `Page ${i + 1} / ${range.count}`
        const options = { align : 'right' }
        const width = doc.widthOfString(string, options) + pixelsToPoints(10)
        // const height = doc.heightOfString(string, { ...options, width : width })
        doc.text(string, (largeurPage + doc.page.margins.right - width), (doc.page.margins.top + generalHeaderHeight + (paddingGeneralHeader * 2)) * 0.5)
    }
}

const drawFormuleAperitif = () => {
    newPage('Formule Apéritif')
    // init des variables
    let nbElementsContent = 0
    let calculated_yPos = 0
    let title = ''
    let content = ''

    const { Formule_Aperitif } = devis

    // **** Description générale
    title = 'Description générale : '
    yPos += paddingTitles.top
    doc.font(fontTitles).fontSize(fontSizeTitles).text(title, doc.page.margins.left + paddingPageContent.left + paddingTitles.left, yPos)
    yPos += paddingTitles.bottom

    // contenu
    content = `Formule pour ${Formule_Aperitif.Nb_Convives} convives avec ${Formule_Aperitif.Nb_Pieces_Salees} pièces par personne.`
    yPos += paddingContent.top
    doc.font(fontContent).fontSize(fontSizeContent).text(content, doc.page.margins.left + paddingPageContent.left + paddingContent.left, yPos)
    yPos += paddingContent.bottom
    content = `Prix par personne ${Number.parseFloat(Formule_Aperitif.Prix_HT / Formule_Aperitif.Nb_Convives).toFixed(2)}€ HT, pour un total de ${Number.parseFloat(Formule_Aperitif.Prix_HT).toFixed(2)}€ HT.`
    yPos += paddingContent.top
    doc.text(content, doc.page.margins.left + paddingPageContent.left + paddingContent.left, yPos)
    yPos += paddingContent.bottom

    // **** Recettes sélectionnées
    title = 'Recettes sélectionnées : '
    // calcul de l'espace nécessaire pour afficher (titre) + (contenu) + padding bottom page
    nbElementsContent = Formule_Aperitif.Liste_Recettes_Salees.length > 0 ? Formule_Aperitif.Liste_Recettes_Salees.length : 1
    calculated_yPos = yPos + (paddingTitles.top + paddingTitles.bottom) + (nbElementsContent * (paddingContent.top + paddingContent.bottom)) + paddingPageContent.bottom

    // si tout ne tient pas sur la page et qu'on a dépassé les 3/4 de celle-ci, alors on saute une page avant d'écrire
    if((calculated_yPos > pageDrawingSpace.bottom) && (yPos > (pageDrawingSpace.bottom - (pageDrawingSpace.bottom * 0.25)))) {
        console.log('saut de page avant titre')
        newPage()
    }

    // on écrit
    yPos += paddingTitles.top
    doc.font(fontTitles).fontSize(fontSizeTitles).text(title, doc.page.margins.left + paddingPageContent.left + paddingTitles.left, yPos)
    yPos += paddingTitles.bottom

    // contenu
    doc.font(fontContent).fontSize(fontSizeContent)
    for(let i = 0; i < Formule_Aperitif.Liste_Recettes_Salees.length; i++) {
        const num = i + 1
        content = `${num}) ${Formule_Aperitif.Liste_Recettes_Salees[i]}`
        const height = paddingContent.top + paddingPageContent.bottom
        // on vérifie qu'on a la place pour écrire
        if((yPos + height) > pageDrawingSpace.bottom) {
            // s'il n'y a pas suffisamment de place, on crée une nouvelle page avant d'écrire
            console.log('saut de page')
            console.log('y : ', doc.y, 'yPos : ', yPos, 'height : ', height, 'yPos + height : ', (yPos + height), 'drawing limit : ', pageDrawingSpace.bottom)
            newPage()
        }
        yPos += paddingContent.top
        doc.text(content, doc.page.margins.left + paddingPageContent.left + paddingContent.left, yPos)
        yPos += paddingContent.bottom
    }

    // **** Boissons    
    title = 'Boissons sélectionnée(s) : '
    // calcul de l'espace nécessaire pour afficher (titre) + (contenu) + padding bottom page
    nbElementsContent = Formule_Aperitif.Liste_Recettes_Boissons.length > 0 ? Formule_Aperitif.Liste_Recettes_Boissons.length : 1
    calculated_yPos = yPos + (paddingTitles.top + paddingTitles.bottom) + (nbElementsContent * (paddingContent.top + paddingContent.bottom)) + paddingPageContent.bottom

    // si tout ne tient pas sur la page et qu'on a dépassé les 3/4 de celle-ci, alors on saute une page avant d'écrire
    if((calculated_yPos > pageDrawingSpace.bottom) && (yPos > (pageDrawingSpace.bottom - (pageDrawingSpace.bottom * 0.25)))) {
        newPage()
    }

    // on écrit
    yPos += paddingTitles.top
    doc.font(fontTitles).fontSize(fontSizeTitles).text(title, doc.page.margins.left + paddingPageContent.left + paddingTitles.left, yPos)
    yPos += paddingTitles.bottom

    // contenu 
    doc.font(fontContent).fontSize(fontSizeContent)
    if(Formule_Aperitif.Liste_Recettes_Boissons.length > 0) {
        for(let i = 0; i < Formule_Aperitif.Liste_Recettes_Boissons.length; i++) {
            const num = i + 1
            content = `${num}) ${Formule_Aperitif.Liste_Recettes_Boissons[i]}`
            const height = paddingContent.top + paddingPageContent.bottom
            // on vérifie qu'on a la place pour écrire
            if((yPos + height) > pageDrawingSpace.bottom) {
                // s'il n'y a pas suffisamment de place, on crée une nouvelle page avant d'écrire
                console.log('saut de page')
                console.log('y : ', doc.y, 'yPos : ', yPos, 'height : ', height, 'yPos + height : ', (yPos + height), 'drawing limit : ', pageDrawingSpace.bottom)
                newPage()
            }
            yPos += paddingContent.top
            doc.text(content, doc.page.margins.left + paddingPageContent.left + paddingContent.left, yPos)
            yPos += paddingContent.bottom
        }
    }
    else {
        yPos += paddingContent.top
        doc.text('Aucune boisson sélectionnée', doc.page.margins.left + paddingPageContent.left + paddingContent.left, yPos)
        yPos += paddingContent.bottom
    }
}

const drawFormuleCocktail = () => {
    newPage('Formule Cocktail')
    // init des variables
    let nbElementsContent = 0
    let calculated_yPos = 0
    let title = ''
    let content = ''

    const { Formule_Cocktail } = devis

    // **** Description générale
    title = 'Description générale : '
    yPos += paddingTitles.top
    doc.font(fontTitles).fontSize(fontSizeTitles).text(title, doc.page.margins.left + paddingPageContent.left + paddingTitles.left, yPos)
    yPos += paddingTitles.bottom

    // contenu 
    content = `Formule pour ${Formule_Cocktail.Nb_Convives} convives avec ${Formule_Cocktail.Nb_Pieces_Salees} pièces salées par personne et ${Formule_Cocktail.Nb_Pieces_Sucrees} pièces sucrées par personne.`
    yPos += paddingContent.top
    doc.font(fontContent).fontSize(fontSizeContent).text(content, doc.page.margins.left + paddingPageContent.left + paddingContent.left, yPos)
    yPos += paddingContent.bottom
    content = `Prix par personne ${Number.parseFloat(Formule_Cocktail.Prix_HT / Formule_Cocktail.Nb_Convives).toFixed(2)}€ HT, pour un total de ${Number.parseFloat(Formule_Cocktail.Prix_HT).toFixed(2)}€ HT.`
    yPos += paddingContent.top
    doc.text(content, doc.page.margins.left + paddingPageContent.left + paddingContent.left, yPos)
    yPos += paddingContent.bottom

    
    // **** Recettes salées
    title = 'Recettes salées sélectionnées : '
    // calcul de l'espace nécessaire pour afficher (titre) + (contenu) + padding bottom page
    nbElementsContent = Formule_Cocktail.Liste_Recettes_Salees.length > 0 ? Formule_Cocktail.Liste_Recettes_Salees.length : 1
    calculated_yPos = yPos + (paddingTitles.top + paddingTitles.bottom) + (nbElementsContent * (paddingContent.top + paddingContent.bottom)) + paddingPageContent.bottom

    // si tout ne tient pas sur la page et qu'on a dépassé les 3/4 de celle-ci, alors on saute une page avant d'écrire
    if((calculated_yPos > pageDrawingSpace.bottom) && (yPos > (pageDrawingSpace.bottom - (pageDrawingSpace.bottom * 0.25)))) {
        console.log('saut de page avant titre')
        newPage()
    }

    // on écrit
    yPos += paddingTitles.top
    doc.font(fontTitles).fontSize(fontSizeTitles).text(title, doc.page.margins.left + paddingPageContent.left + paddingTitles.left, yPos)
    yPos += paddingTitles.bottom

    // contenu
    doc.font(fontContent).fontSize(fontSizeContent)
    for(let i = 0; i < Formule_Cocktail.Liste_Recettes_Salees.length; i++) {
        const num = i + 1
        content = `${num}) ${Formule_Cocktail.Liste_Recettes_Salees[i]}`
        const height = paddingContent.top + paddingPageContent.bottom
        // on vérifie qu'on a la place pour écrire
        if((yPos + height) > pageDrawingSpace.bottom) {
            // s'il n'y a pas suffisamment de place, on crée une nouvelle page avant d'écrire
            console.log('saut de page')
            console.log('y : ', doc.y, 'yPos : ', yPos, 'height : ', height, 'yPos + height : ', (yPos + height), 'drawing limit : ', pageDrawingSpace.bottom)
            newPage()
        }
        yPos += paddingContent.top
        doc.text(content, doc.page.margins.left + paddingPageContent.left + paddingContent.left, yPos)
        yPos += paddingContent.bottom
    }

    // **** Recettes sucrées
    title = 'Recettes sucrées sélectionnées : '
    // calcul de l'espace nécessaire pour afficher (titre) + (contenu) + padding bottom page
    nbElementsContent = Formule_Cocktail.Liste_Recettes_Sucrees.length > 0 ? Formule_Cocktail.Liste_Recettes_Sucrees.length : 1
    calculated_yPos = yPos + (paddingTitles.top + paddingTitles.bottom) + (nbElementsContent * (paddingContent.top + paddingContent.bottom)) + paddingPageContent.bottom

    // si tout ne tient pas sur la page et qu'on a dépassé les 3/4 de celle-ci, alors on saute une page avant d'écrire
    if((calculated_yPos > pageDrawingSpace.bottom) && (yPos > (pageDrawingSpace.bottom - (pageDrawingSpace.bottom * 0.25)))) {
        newPage()
    }

    // on écrit
    yPos += paddingTitles.top
    doc.font(fontTitles).fontSize(fontSizeTitles).text(title, doc.page.margins.left + paddingPageContent.left + paddingTitles.left, yPos)
    yPos += paddingTitles.bottom

    // contenu
    doc.font(fontContent).fontSize(fontSizeContent)
    for(let i = 0; i < Formule_Cocktail.Liste_Recettes_Sucrees.length; i++) {
        const num = i + 1
        const content = `${num}) ${Formule_Cocktail.Liste_Recettes_Sucrees[i]}`
        const height = paddingContent.top + paddingPageContent.bottom
        // on vérifie qu'on a la place pour écrire
        if((yPos + height) > pageDrawingSpace.bottom) {
            // s'il n'y a pas suffisamment de place, on crée une nouvelle page avant d'écrire
            console.log('saut de page')
            console.log('y : ', doc.y, 'yPos : ', yPos, 'height : ', height, 'yPos + height : ', (yPos + height), 'drawing limit : ', pageDrawingSpace.bottom)
            newPage()
        }
        yPos += paddingContent.top
        doc.text(content, doc.page.margins.left + paddingPageContent.left + paddingContent.left, yPos)
        yPos += paddingContent.bottom
    }

    // **** Boissons    
    title = 'Boissons sélectionnée(s) : '
    // calcul de l'espace nécessaire pour afficher (titre) + (contenu) + padding bottom page
    nbElementsContent = Formule_Cocktail.Liste_Recettes_Boissons.length > 0 ? Formule_Cocktail.Liste_Recettes_Boissons.length : 1
    calculated_yPos = yPos + (paddingTitles.top + paddingTitles.bottom) + (nbElementsContent * (paddingContent.top + paddingContent.bottom)) + paddingPageContent.bottom

    // si tout ne tient pas sur la page et qu'on a dépassé les 3/4 de celle-ci, alors on saute une page avant d'écrire
    if((calculated_yPos > pageDrawingSpace.bottom) && (yPos > (pageDrawingSpace.bottom - (pageDrawingSpace.bottom * 0.25)))) {
        newPage()
    }

    // on écrit
    yPos += paddingTitles.top
    doc.font(fontTitles).fontSize(fontSizeTitles).text(title, doc.page.margins.left + paddingPageContent.left + paddingTitles.left, yPos)
    yPos += paddingTitles.bottom

    doc.font(fontContent).fontSize(fontSizeContent)
    if(Formule_Cocktail.Liste_Recettes_Boissons.length > 0) {
        for(let i = 0; i < Formule_Cocktail.Liste_Recettes_Boissons.length; i++) {
            const num = i + 1
            const content = `${num}) ${Formule_Cocktail.Liste_Recettes_Boissons[i]}`
            // const width = doc.widthOfString(content) + paddingPageContent.left + paddingContent.left + paddingContent.right
            // const height = doc.heightOfString(content, { width }) + paddingContent.top + paddingPageContent.bottom
            const height = paddingContent.top + paddingPageContent.bottom
            // on vérifie qu'on a la place pour écrire
            if((yPos + height) > pageDrawingSpace.bottom) {
                // s'il n'y a pas suffisamment de place, on crée une nouvelle page avant d'écrire
                console.log('saut de page')
                console.log('y : ', doc.y, 'yPos : ', yPos, 'height : ', height, 'yPos + height : ', (yPos + height), 'drawing limit : ', pageDrawingSpace.bottom)
                newPage()
            }
            yPos += paddingContent.top
            doc.text(content, doc.page.margins.left + paddingPageContent.left + paddingContent.left, yPos)
            yPos += paddingContent.bottom
        }
    }
    else {
        yPos += paddingContent.top
        doc.text('Aucune boisson sélectionnée', doc.page.margins.left + paddingPageContent.left + paddingContent.left, yPos)
        yPos += paddingContent.bottom
    }
}

const drawFormuleBox = () => {
    newPage('Formule Box Déjeuner')
    // init des variables
    let title = ''
    let content = ''

    const { Formule_Box } = devis

    // **** Description générale
    title = 'Description générale : '
    yPos += paddingTitles.top
    doc.font(fontTitles).fontSize(fontSizeTitles).text(title, doc.page.margins.left + paddingPageContent.left + paddingTitles.left, yPos)
    yPos += paddingTitles.bottom

    // contenu 
    content = `Formule pour ${Formule_Box.Nb_Convives} convives avec une entrée, un plat avec légumes et viande ou poisson, un dessert accompagnée d'une boisson.`
    yPos += paddingContent.top
    doc.font(fontContent).fontSize(fontSizeContent).text(content, doc.page.margins.left + paddingPageContent.left + paddingContent.left, yPos)
    yPos += doc.heightOfString(content)
    // yPos += paddingContent.bottom
    content = `Prix par personne ${Number.parseFloat(Formule_Box.Prix_HT / Formule_Box.Nb_Convives).toFixed(2)}€ HT, pour un total de ${Number.parseFloat(Formule_Box.Prix_HT).toFixed(2)}€ HT.`
    yPos += paddingContent.top
    doc.text(content, doc.page.margins.left + paddingPageContent.left + paddingContent.left, yPos)
    yPos += paddingContent.bottom

    //  **** Contenu par box
    title = 'Contenu de chaque box : '
    yPos += paddingTitles.top
    doc.font(fontTitles).fontSize(fontSizeTitles).text(title, doc.page.margins.left + paddingPageContent.left + paddingTitles.left, yPos)
    yPos += paddingTitles.bottom

    // **** entrée + plats
    const isCollectif = Formule_Box.Liste_Recettes_Salees.length === Formule_Box.Nb_Pieces_Salees
    let numRecetteSalee = 0
    let numRecetteSucreeBoisson = 0
    doc.font(fontContent).fontSize(fontSizeContent)
    for(let numBox = 0; numBox < Formule_Box.Nb_Convives; numBox++) {
        const num = numBox + 1
        content = `${num}) `
        
        numRecetteSucreeBoisson = numBox
        if(isCollectif) {
            numRecetteSalee = 0
            numRecetteSucreeBoisson = 0
        }
        
        let i = 0
        // for(numRecetteSalee; numRecetteSalee < (numRecetteSalee + 3); numRecetteSalee++) {
        while(i < 3) {
            content += Formule_Box.Liste_Recettes_Salees[numRecetteSalee]
            // entrée
            if(i === 0) {
                content += ', '
            }
            // viande
            if(i === 1) {
                content += ' avec '
            }
            // légumes
            if(i === 2) {
                content += ' '
            }
            numRecetteSalee += 1
            i += 1
        }

        // dessert + boisson
        content += `et en dessert ${Formule_Box.Liste_Recettes_Sucrees[numRecetteSucreeBoisson]}. `
        content += `Boisson : ${Formule_Box.Liste_Recettes_Boissons[numRecetteSucreeBoisson]}.`

        const heightOfString = doc.heightOfString(content)
        const height = paddingContent.top + heightOfString + paddingPageContent.bottom
        if((yPos + height) > pageDrawingSpace.bottom) {
            // s'il n'y a pas suffisamment de place, on crée une nouvelle page avant d'écrire
            console.log('saut de page')
            console.log('y : ', doc.y, 'yPos : ', yPos, 'height : ', height, 'yPos + height : ', (yPos + height), 'drawing limit : ', pageDrawingSpace.bottom)
            newPage()
        }

        yPos += paddingContent.top
        doc.text(content, doc.page.margins.left + paddingPageContent.left + paddingContent.left, yPos)
        yPos += heightOfString
    }
}

const drawFormuleBrunch = () => {
    newPage('Formule Brunch Privé')
    // init des variables
    let nbElementsContent = 0
    let calculated_yPos = 0
    let title = ''
    let content = ''

    const { Formule_Brunch } = devis

    // **** Description générale
    title = 'Description générale : '
    yPos += paddingTitles.top
    doc.font(fontTitles).fontSize(fontSizeTitles).text(title, doc.page.margins.left + paddingPageContent.left + paddingTitles.left, yPos)
    yPos += paddingTitles.bottom

    // contenu 
    content = `Formule pour ${Formule_Brunch.Nb_Convives} convives avec ${Formule_Brunch.Nb_Pieces_Salees} pièce(s) salée(s) par personne et ${Formule_Brunch.Nb_Pieces_Sucrees} pièce(s) sucrée(s) par personne.`
    yPos += paddingContent.top
    doc.font(fontContent).fontSize(fontSizeContent).text(content, doc.page.margins.left + paddingPageContent.left + paddingContent.left, yPos)
    yPos += paddingContent.bottom
    content = `Prix par personne ${Number.parseFloat(Formule_Brunch.Prix_HT / Formule_Brunch.Nb_Convives).toFixed(2)}€ HT, pour un total de ${Number.parseFloat(Formule_Brunch.Prix_HT).toFixed(2)}€ HT.`
    yPos += paddingContent.top
    doc.text(content, doc.page.margins.left + paddingPageContent.left + paddingContent.left, yPos)
    yPos += paddingContent.bottom

    
    // **** Recettes salées
    title = 'Recettes salées sélectionnées : '
    // calcul de l'espace nécessaire pour afficher (titre) + (contenu) + padding bottom page
    nbElementsContent = Formule_Brunch.Liste_Recettes_Salees.length > 0 ? Formule_Brunch.Liste_Recettes_Salees.length : 1
    calculated_yPos = yPos + (paddingTitles.top + paddingTitles.bottom) + (nbElementsContent * (paddingContent.top + paddingContent.bottom)) + paddingPageContent.bottom

    // si tout ne tient pas sur la page et qu'on a dépassé les 3/4 de celle-ci, alors on saute une page avant d'écrire
    if((calculated_yPos > pageDrawingSpace.bottom) && (yPos > (pageDrawingSpace.bottom - (pageDrawingSpace.bottom * 0.25)))) {
        console.log('saut de page avant titre')
        newPage()
    }

    // on écrit
    yPos += paddingTitles.top
    doc.font(fontTitles).fontSize(fontSizeTitles).text(title, doc.page.margins.left + paddingPageContent.left + paddingTitles.left, yPos)
    yPos += paddingTitles.bottom

    // contenu
    doc.font(fontContent).fontSize(fontSizeContent)
    if(Formule_Brunch.Liste_Recettes_Salees.length > 0) {
        for(let i = 0; i < Formule_Brunch.Liste_Recettes_Salees.length; i++) {
            const num = i + 1
            content = `${num}) ${Formule_Brunch.Liste_Recettes_Salees[i]}`
            const height = paddingContent.top + paddingPageContent.bottom
            // on vérifie qu'on a la place pour écrire
            if((yPos + height) > pageDrawingSpace.bottom) {
                // s'il n'y a pas suffisamment de place, on crée une nouvelle page avant d'écrire
                console.log('saut de page')
                console.log('y : ', doc.y, 'yPos : ', yPos, 'height : ', height, 'yPos + height : ', (yPos + height), 'drawing limit : ', pageDrawingSpace.bottom)
                newPage()
            }
            yPos += paddingContent.top
            doc.text(content, doc.page.margins.left + paddingPageContent.left + paddingContent.left, yPos)
            yPos += paddingContent.bottom
        }
    }
    else {
        yPos += paddingContent.top
        doc.text('Aucune', doc.page.margins.left + paddingPageContent.left + paddingContent.left, yPos)
        yPos += paddingContent.bottom
    }

    // **** Recettes sucrées
    title = 'Recettes sucrées sélectionnées : '
    // calcul de l'espace nécessaire pour afficher (titre) + (contenu) + padding bottom page
    nbElementsContent = Formule_Brunch.Liste_Recettes_Sucrees.length > 0 ? Formule_Brunch.Liste_Recettes_Sucrees.length : 1
    calculated_yPos = yPos + (paddingTitles.top + paddingTitles.bottom) + (nbElementsContent * (paddingContent.top + paddingContent.bottom)) + paddingPageContent.bottom

    // si tout ne tient pas sur la page et qu'on a dépassé les 3/4 de celle-ci, alors on saute une page avant d'écrire
    if((calculated_yPos > pageDrawingSpace.bottom) && (yPos > (pageDrawingSpace.bottom - (pageDrawingSpace.bottom * 0.25)))) {
        newPage()
    }

    // on écrit
    yPos += paddingTitles.top
    doc.font(fontTitles).fontSize(fontSizeTitles).text(title, doc.page.margins.left + paddingPageContent.left + paddingTitles.left, yPos)
    yPos += paddingTitles.bottom

    // contenu
    doc.font(fontContent).fontSize(fontSizeContent)
    if(Formule_Brunch.Liste_Recettes_Sucrees.length > 0) {
        for(let i = 0; i < Formule_Brunch.Liste_Recettes_Sucrees.length; i++) {
            const num = i + 1
            const content = `${num}) ${Formule_Brunch.Liste_Recettes_Sucrees[i]}`
            const height = paddingContent.top + paddingPageContent.bottom
            // on vérifie qu'on a la place pour écrire
            if((yPos + height) > pageDrawingSpace.bottom) {
                // s'il n'y a pas suffisamment de place, on crée une nouvelle page avant d'écrire
                console.log('saut de page')
                console.log('y : ', doc.y, 'yPos : ', yPos, 'height : ', height, 'yPos + height : ', (yPos + height), 'drawing limit : ', pageDrawingSpace.bottom)
                newPage()
            }
            yPos += paddingContent.top
            doc.text(content, doc.page.margins.left + paddingPageContent.left + paddingContent.left, yPos)
            yPos += paddingContent.bottom
        }
    }
    else {
        yPos += paddingContent.top
        doc.text('Aucune', doc.page.margins.left + paddingPageContent.left + paddingContent.left, yPos)
        yPos += paddingContent.bottom
    }

    // **** Boissons    
    title = 'Boissons sélectionnée(s) : '
    // calcul de l'espace nécessaire pour afficher (titre) + (contenu) + padding bottom page
    nbElementsContent = Formule_Brunch.Liste_Recettes_Boissons.length > 0 ? Formule_Brunch.Liste_Recettes_Boissons.length : 1
    calculated_yPos = yPos + (paddingTitles.top + paddingTitles.bottom) + (nbElementsContent * (paddingContent.top + paddingContent.bottom)) + paddingPageContent.bottom

    // si tout ne tient pas sur la page et qu'on a dépassé les 3/4 de celle-ci, alors on saute une page avant d'écrire
    if((calculated_yPos > pageDrawingSpace.bottom) && (yPos > (pageDrawingSpace.bottom - (pageDrawingSpace.bottom * 0.25)))) {
        newPage()
    }

    // on écrit
    yPos += paddingTitles.top
    doc.font(fontTitles).fontSize(fontSizeTitles).text(title, doc.page.margins.left + paddingPageContent.left + paddingTitles.left, yPos)
    yPos += paddingTitles.bottom

    doc.font(fontContent).fontSize(fontSizeContent)
    if(Formule_Brunch.Liste_Recettes_Boissons.length > 0) {
        for(let i = 0; i < Formule_Brunch.Liste_Recettes_Boissons.length; i++) {
            const num = i + 1
            const content = `${num}) ${Formule_Brunch.Liste_Recettes_Boissons[i]}`
            // const width = doc.widthOfString(content) + paddingPageContent.left + paddingContent.left + paddingContent.right
            // const height = doc.heightOfString(content, { width }) + paddingContent.top + paddingPageContent.bottom
            const height = paddingContent.top + paddingPageContent.bottom
            // on vérifie qu'on a la place pour écrire
            if((yPos + height) > pageDrawingSpace.bottom) {
                // s'il n'y a pas suffisamment de place, on crée une nouvelle page avant d'écrire
                console.log('saut de page')
                console.log('y : ', doc.y, 'yPos : ', yPos, 'height : ', height, 'yPos + height : ', (yPos + height), 'drawing limit : ', pageDrawingSpace.bottom)
                newPage()
            }
            yPos += paddingContent.top
            doc.text(content, doc.page.margins.left + paddingPageContent.left + paddingContent.left, yPos)
            yPos += paddingContent.bottom
        }
    }
    else {
        yPos += paddingContent.top
        doc.text('Aucune boisson sélectionnée', doc.page.margins.left + paddingPageContent.left + paddingContent.left, yPos)
        yPos += paddingContent.bottom
    }
}

const tabRecapWriteFirstCol = (content, maxHeightRow, sizeCol1, gap, align = 'left') => {
    const options = {width : sizeCol1 - paddingContent.left - paddingContent.right, align}
    xPos = gap + paddingContent.left
    doc.text(content, xPos, yPos, options)
    const currentHeight = doc.heightOfString(content, options) + paddingContent.bottom
    maxHeightRow = currentHeight > maxHeightRow ? currentHeight : maxHeightRow

    return maxHeightRow
}

const tabRecapWriteSecondCol = (content, maxHeightRow, sizeCol2, gap, align = 'left') => {
    const options = {width : sizeCol2 - paddingContent.left - paddingContent.right, align}
    xPos += gap
    doc.text(content, xPos, yPos, options)
    const currentHeight = doc.heightOfString(content, options) + paddingContent.bottom
    maxHeightRow = currentHeight > maxHeightRow ? currentHeight : maxHeightRow
    
    return maxHeightRow
}

const tabRecapWriteThirdCol = (content, maxHeightRow, sizeCol3, gap, align = 'left') => {
    const options = {width : sizeCol3 - paddingContent.left - paddingContent.right, align : 'center'}
    xPos += gap
    doc.text(content, xPos, yPos, options)
    const currentHeight = doc.heightOfString(content, options) + paddingContent.bottom
    maxHeightRow = currentHeight > maxHeightRow ? currentHeight : maxHeightRow

    return maxHeightRow
}

const drawLastPage = () => {
    newPage('Récapitulatif')
    
    let height = 0
    let width = 0
    let content = ''
    let options = {}
    let currentHeight = 0
    let maxHeightRow = 0
    // tableau avec les différentes coordonnées x,y lors de l'écriture pour savoir comment tracer le tableau
    const tabPositions = []


    const pageLeft = doc.page.margins.left + paddingPageContent.left
    const pageRight = doc.page.width - (doc.page.margins.right + paddingPageContent.right)
    const pageWidth = pageRight - pageLeft
    const sizeCol1 = pageWidth * (2/3) 
    const sizeCol2 = (pageWidth * (1/3)) * 0.5 
    const sizeCol3 = (pageWidth * (1/3)) * 0.5 

    // **** Ecriture ligne d'entête
    // l'écriture se fait par ligne en se décalant vers la droite afin de remplir chaque case
    doc.font(fontTitles).fontSize(fontSizeTitles)    
    // top ligne entête gauche
    tabPositions.push({x : pageLeft, y : yPos}) 
    // top ligne entête droite
    tabPositions.push({x : pageRight, y : yPos}) 
    const tableTop = yPos
    yPos += paddingContent.top

    // col1
    maxHeightRow = tabRecapWriteFirstCol('Désignation\n(/pers = par personne)', maxHeightRow, sizeCol1, pageLeft, 'center')

    // col2
    maxHeightRow = tabRecapWriteSecondCol('Prix / Personne HT', maxHeightRow, sizeCol2, sizeCol1, 'center')

    // col3
    maxHeightRow = tabRecapWriteThirdCol('Total HT', maxHeightRow, sizeCol3, sizeCol2, 'center')

    yPos += maxHeightRow
    // tabPositions.push({x : pageLeft, y : yPos}) // top 1ère ligne gauche
    // tabPositions.push({x : pageRight, y : yPos}) // top 1ère ligne droite

    // **** contenu du tableau
    doc.font(fontContent).fontSize(fontSizeContent)
    if(devis.Formule_Aperitif.isAperitif) {
        // on ajoute la ligne du dessus de la row
        tabPositions.push({x : pageLeft, y : yPos}) 
        tabPositions.push({x : pageRight, y : yPos})   
        // on ajoute la padding top
        yPos += paddingContent.top

        const { Formule_Aperitif } = devis
        maxHeightRow = 0
        content = `Formule Apéritif pour ${Formule_Aperitif.Nb_Convives} (${Formule_Aperitif.Nb_Pieces_Salees} pièces /pers)`
        maxHeightRow = tabRecapWriteFirstCol(content, maxHeightRow, sizeCol1, pageLeft, 'left')
        maxHeightRow = tabRecapWriteSecondCol(`${Number.parseFloat(Formule_Aperitif.Prix_HT / Formule_Aperitif.Nb_Convives).toFixed(2)}€`, maxHeightRow, sizeCol2, sizeCol1, 'center')
        maxHeightRow = tabRecapWriteThirdCol(`${Number.parseFloat(Formule_Aperitif.Prix_HT).toFixed(2)}€`, maxHeightRow, sizeCol3, sizeCol2, 'center')

        // on ajoute le padding bottom
        yPos += maxHeightRow
    }
    if(devis.Formule_Cocktail.isCocktail) {
        // on ajoute la ligne du dessus de la row
        tabPositions.push({x : pageLeft, y : yPos}) 
        tabPositions.push({x : pageRight, y : yPos})   
        // on ajoute la padding top
        yPos += paddingContent.top

        const { Formule_Cocktail } = devis
        maxHeightRow = 0
        content = `Formule Cocktail pour ${Formule_Cocktail.Nb_Convives} (${Formule_Cocktail.Nb_Pieces_Salees} pièces salées /pers, ${Formule_Cocktail.Nb_Pieces_Sucrees} pièces sucrée(s) /pers)`
        maxHeightRow = tabRecapWriteFirstCol(content, maxHeightRow, sizeCol1, pageLeft, 'left')
        maxHeightRow = tabRecapWriteSecondCol(`${Number.parseFloat(Formule_Cocktail.Prix_HT / Formule_Cocktail.Nb_Convives).toFixed(2)}€`, maxHeightRow, sizeCol2, sizeCol1, 'center')
        maxHeightRow = tabRecapWriteThirdCol(`${Number.parseFloat(Formule_Cocktail.Prix_HT).toFixed(2)}€`, maxHeightRow, sizeCol3, sizeCol2, 'center')

        // on ajoute le padding bottom
        yPos += maxHeightRow
    }
    if(devis.Formule_Box.isBox) {
        // on ajoute la ligne du dessus de la row
        tabPositions.push({x : pageLeft, y : yPos}) 
        tabPositions.push({x : pageRight, y : yPos})   
        // on ajoute la padding top
        yPos += paddingContent.top

        const { Formule_Box } = devis
        maxHeightRow = 0
        maxHeightRow = tabRecapWriteFirstCol(`Formule Box Déjeuner pour ${Formule_Box.Nb_Convives}`, maxHeightRow, sizeCol1, pageLeft, 'left')
        maxHeightRow = tabRecapWriteSecondCol(`${Number.parseFloat(Formule_Box.Prix_HT / Formule_Box.Nb_Convives).toFixed(2)}€`, maxHeightRow, sizeCol2, sizeCol1, 'center')
        maxHeightRow = tabRecapWriteThirdCol(`${Number.parseFloat(Formule_Box.Prix_HT).toFixed(2)}€`, maxHeightRow, sizeCol3, sizeCol2, 'center')

        // on ajoute le padding bottom
        yPos += maxHeightRow
    }
    if(devis.Formule_Brunch.isBrunch) {
        // on ajoute la ligne du dessus de la row
        tabPositions.push({x : pageLeft, y : yPos}) 
        tabPositions.push({x : pageRight, y : yPos})   
        // on ajoute la padding top
        yPos += paddingContent.top

        const { Formule_Brunch } = devis
        maxHeightRow = 0
        content = `Formule Brunch Privé pour ${Formule_Brunch.Nb_Convives} (${Formule_Brunch.Nb_Pieces_Salees} pièces salées /pers, ${Formule_Brunch.Nb_Pieces_Sucrees} pièces sucrée(s) /pers)`
        maxHeightRow = tabRecapWriteFirstCol(content, maxHeightRow, sizeCol1, pageLeft, 'left')
        maxHeightRow = tabRecapWriteSecondCol(`${Number.parseFloat(Formule_Brunch.Prix_HT / Formule_Brunch.Nb_Convives).toFixed(2)}€`, maxHeightRow, sizeCol2, sizeCol1, 'center')
        maxHeightRow = tabRecapWriteThirdCol(`${Number.parseFloat(Formule_Brunch.Prix_HT).toFixed(2)}€`, maxHeightRow, sizeCol3, sizeCol2, 'center')

        // on ajoute le padding bottom
        yPos += maxHeightRow
    }
    // options
    for(let i = 0; i < devis.Liste_Options.length; i++) {
        // on ajoute la ligne du dessus de la row
        tabPositions.push({x : pageLeft, y : yPos}) 
        tabPositions.push({x : pageRight, y : yPos})   
        // on ajoute la padding top
        yPos += paddingContent.top

        maxHeightRow = 0
        maxHeightRow = tabRecapWriteFirstCol(devis.Liste_Options[i].Nom, maxHeightRow, sizeCol1, pageLeft, 'left')
        maxHeightRow = tabRecapWriteSecondCol('-', maxHeightRow, sizeCol2, sizeCol1, 'center')
        maxHeightRow = tabRecapWriteThirdCol(`${Number.parseFloat(devis.Liste_Options[i].Montant).toFixed(2)}€`, maxHeightRow, sizeCol3, sizeCol2, 'center')

        // on ajoute le padding bottom
        yPos += maxHeightRow
    }
    // remise
    if(devis.Remise !== null) {
        // on ajoute la ligne du dessus de la row
        tabPositions.push({x : pageLeft, y : yPos}) 
        tabPositions.push({x : pageRight, y : yPos})   
        // on ajoute la padding top
        yPos += paddingContent.top
        maxHeightRow = 0
        maxHeightRow = tabRecapWriteFirstCol(devis.Remise.Nom, maxHeightRow, sizeCol1, pageLeft, 'left')
        maxHeightRow = tabRecapWriteSecondCol('-', maxHeightRow, sizeCol2, sizeCol1, 'center')
        let prixRemise = devis.Remise.Valeur
        if(devis.Remise.IsPourcent) {
            prixRemise = devis.Prix_HT * (devis.Remise.Valeur / 100)
        }
        maxHeightRow = tabRecapWriteThirdCol(`${Number(prixRemise).toFixed(2)}€`, maxHeightRow, sizeCol3, sizeCol2, 'center')
        // on ajoute le padding bottom
        yPos += maxHeightRow
    }

    // on ferme le tableau
    tabPositions.push({x : pageLeft, y : yPos}) 
    tabPositions.push({x : pageRight, y : yPos}) 
    const tableBottom = yPos


    // **** tableau A PAYER
    doc.font(fontTitles).fontSize(fontSizeTitles)
    // const aPayerLeft = pageLeft + sizeCol1
    // const aPayerRight = pageRight
    // const aPayerWidth = sizeCol2 + sizeCol3
    const aPayerLeft = pageWidth * 0.6
    const aPayerRight = pageRight
    const aPayerWidth = aPayerRight - aPayerLeft

    yPos += paddingTitles.top
    const aPayerTop = yPos
    xPos = aPayerLeft + paddingTitles.left
    tabPositions.push({x : aPayerLeft, y : yPos})
    tabPositions.push({x : aPayerRight, y : yPos})

    maxHeightRow = 0
    options = {width : (aPayerWidth * 0.5) - paddingContent.left - paddingContent.right, align : 'left'}
    content = 'Montant HT'
    yPos += paddingContent.top
    doc.text(content, xPos, yPos, options)
    currentHeight = doc.heightOfString(content, options) + paddingContent.bottom
    maxHeightRow = currentHeight > maxHeightRow ? currentHeight : maxHeightRow
    options = {width : (aPayerWidth * 0.5) - paddingContent.left - paddingContent.right, align : 'right'}
    content = `${Number.parseFloat(devis.Prix_HT).toFixed(2)}€`
    doc.text(content, xPos + (aPayerWidth * 0.5), yPos, options)
    currentHeight = doc.heightOfString(content, options) + paddingContent.bottom
    maxHeightRow = currentHeight > maxHeightRow ? currentHeight : maxHeightRow
    yPos += maxHeightRow

    maxHeightRow = 0
    tabPositions.push({x : aPayerLeft, y : yPos})
    tabPositions.push({x : aPayerRight, y : yPos})
    options = {width : (aPayerWidth * 0.5) - paddingContent.left - paddingContent.right, align : 'left'}
    content = 'TVA (10%)'
    yPos += paddingContent.top
    doc.text(content, xPos, yPos, options)
    currentHeight = doc.heightOfString(content, options) + paddingContent.bottom
    maxHeightRow = currentHeight > maxHeightRow ? currentHeight : maxHeightRow
    options = {width : (aPayerWidth * 0.5) - paddingContent.left - paddingContent.right, align : 'right'}
    content = `${Number.parseFloat(devis.Prix_HT * 0.1).toFixed(2)}€`
    doc.text(content, xPos + (aPayerWidth * 0.5), yPos, options)
    currentHeight = doc.heightOfString(content, options) + paddingContent.bottom
    maxHeightRow = currentHeight > maxHeightRow ? currentHeight : maxHeightRow
    yPos += maxHeightRow

    maxHeightRow = 0
    tabPositions.push({x : aPayerLeft, y : yPos})
    tabPositions.push({x : aPayerRight, y : yPos})
    options = {width : (aPayerWidth * 0.5) - paddingContent.left - paddingContent.right, align : 'left'}
    content = 'NET A PAYER'
    yPos += paddingContent.top
    doc.text(content, xPos, yPos, options)
    currentHeight = doc.heightOfString(content, options) + paddingContent.bottom
    maxHeightRow = currentHeight > maxHeightRow ? currentHeight : maxHeightRow
    options = {width : (aPayerWidth * 0.5) - paddingContent.left - paddingContent.right, align : 'right'}
    content = `${Number.parseFloat(devis.Prix_TTC).toFixed(2)}€`
    doc.text(content, xPos + (aPayerWidth * 0.5), yPos, options)
    currentHeight = doc.heightOfString(content, options) + paddingContent.bottom
    maxHeightRow = currentHeight > maxHeightRow ? currentHeight : maxHeightRow
    yPos += maxHeightRow

    tabPositions.push({x : aPayerLeft, y : yPos})
    tabPositions.push({x : aPayerRight, y : yPos})
    const aPayerBottom = yPos


    // **** contours du tableau
    // lignes
    for(let i = 0; i < tabPositions.length; i += 2) {
        const from = tabPositions[i]
        const to = tabPositions[i+1]
        doc.moveTo(from.x, from.y)
        doc.lineTo(to.x, to.y)
    }
    // colonnes
    doc
    .moveTo(pageLeft, tableTop)
    .lineTo(pageLeft, tableBottom)
    .moveTo(pageLeft + sizeCol1, tableTop)
    .lineTo(pageLeft + sizeCol1, tableBottom)
    .moveTo(pageLeft + sizeCol1 + sizeCol2, tableTop)
    .lineTo(pageLeft + sizeCol1 + sizeCol2, tableBottom)
    .moveTo(pageRight, tableTop)
    .lineTo(pageRight, tableBottom)
    .moveTo(aPayerLeft, aPayerTop)
    .lineTo(aPayerLeft, aPayerBottom)
    .moveTo(aPayerRight, aPayerTop)
    .lineTo(aPayerRight, aPayerBottom)
    .strokeColor('black', 0.5)
    .stroke()

    doc.moveDown(2)
    yPos = doc.y
    xPos = doc.page.margins.left + paddingPageContent.left + paddingContent.left

    // **** Commentaire
    height = paddingTitles.top    
    doc.font(fontTitles).fontSize(fontSizeTitles)
    height += doc.heightOfString('Commentaire lié à la commande : ')    
    height += paddingTitles.bottom
    
    doc.font(fontContent).fontSize(fontSizeContent)
    if(devis.Commentaire !== '') {      
        content = devis.Commentaire
    }
    else {
        content = 'Aucun'
    }
    height += paddingContent.top    
    width = pageDrawingSpace.width - (paddingContent.left + paddingContent.right)
    height += doc.heightOfString(content, { width })       
    height += paddingContent.bottom   

    height += paddingContent.top    
    doc.font(fontContent).fontSize(10)
    content = "Un acompte de 30% sera demandé la validation du devis."
    height += doc.heightOfString(content, { align : 'center', oblique : true, width })    
    height += paddingPageContent.bottom

    if((yPos + height) > pageDrawingSpace.bottom) {
        newPage()
    }

    yPos += paddingTitles.top
    doc.font(fontTitles).fontSize(fontSizeTitles).text('Commentaire lié à la commande : ', xPos, yPos)
    yPos += paddingTitles.bottom
    if(devis.Commentaire !== '') {  
        content = devis.Commentaire
    }
    else {
        content = 'Aucun'
    }
    yPos += paddingContent.top
    width = largeurPage - (paddingPageContent.left + paddingPageContent.right + paddingContent.left + paddingContent.right)
    doc.font(fontContent).fontSize(fontSizeContent).text(content, xPos, yPos, { width })
    yPos += paddingContent.bottom

    // **** infos paiement
    doc.font(fontContent).fontSize(10)
    content = "Un acompte de 30% sera demandé à la validation du devis.\nPaiement sous 30 jours à réception de la facture."
    options = { align : 'center', oblique : true, width : (pageDrawingSpace.width - (paddingContent.left + paddingContent.right)) }
    height = doc.heightOfString(content, options)
    yPos = (pageDrawingSpace.bottom - height)
    doc.text(content, xPos, yPos, options)

    // **** Bon pour accord 
    newPage()
    doc.font(fontContent).fontSize(fontSizeContent)
    xPos = doc.page.margins.left + paddingPageContent.left + paddingContent.left

    yPos += paddingContent.top
    doc.text(`Devis n° ${devis.Numero_Devis}.`, xPos, yPos)
    yPos += paddingContent.bottom

    yPos += paddingContent.top
    doc.text(`Evénement prévu le ${moment(devis.Date_Evenement).format('DD/MM/YYYY HH:mm')}.`, xPos, yPos)
    yPos += paddingContent.bottom

    yPos += paddingContent.top
    doc.text(`D'un montant total TTC de ${Number.parseFloat(devis.Prix_TTC)} €`, xPos, yPos)
    yPos += paddingContent.bottom

    yPos += paddingContent.top
    content = `Valable à partir du ${moment().format('DD/MM/YYYY')} et jusqu'à exécution du devis, sous condition de modification de la part du client.`
    doc.text(content, xPos, yPos)
    yPos += doc.heightOfString(content, { width : pageDrawingSpace.width - (paddingContent.left + paddingContent.right) })

    doc.moveDown()
    yPos = doc.y

    yPos += paddingContent.top
    if(devis.Client.Type === 'Particulier') {
        doc.text(`Pour ${devis.Client.Prenom} ${devis.Client.Nom}.`, xPos, yPos)
    }
    else {
        doc.text(`Pour ${devis.Client.Societe}, à l'attention de ${devis.Client.Prenom} ${devis.Client.Nom}.`, xPos, yPos)
        yPos += paddingContent.bottom
        yPos += paddingContent.top
        doc.text(`Numéro TVA : ${devis.Client.Numero_TVA}.`, xPos, yPos)
    }
    yPos += paddingContent.bottom

    yPos += paddingContent.top
    doc.text(`Email : ${devis.Client.Email}.`, xPos, yPos)
    yPos += paddingContent.bottom

    yPos += paddingContent.top
    doc.text(`Téléphone :  ${devis.Client.Telephone}.`, xPos, yPos)
    yPos += paddingContent.bottom

    doc.moveDown(2)
    yPos = doc.y

    content = 'Nous restons à votre disposition pour toute modification'
    yPos += paddingContent.top    
    doc.text(content, xPos, yPos)
    yPos += doc.heightOfString(content) + paddingContent.bottom

    content = 'Si ce devis vous convient, veuillez nous le retourner signé et précédé de la mention : '
    yPos += paddingContent.top
    doc.text(content, xPos, yPos)
    yPos += paddingContent.bottom

    content = 'BON POUR ACCORD ET EXECUTION DU DEVIS'
    yPos += paddingContent.top
    doc.text(content, xPos, yPos)
    yPos += doc.heightOfString(content) + paddingContent.bottom

    content = 'Date : '
    yPos += paddingContent.top
    doc.text(content, xPos, yPos, { align : 'left' })
    content = 'Signature : '
    doc.text(content, xPos, yPos, { align : 'center' })
    yPos += paddingContent.bottom
}