/* eslint-disable max-params */
/* eslint-disable no-param-reassign */
const PDFDocument = require('pdfkit')
const moment = require('moment')
const logger = require('../logger')

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

let acompte = undefined
const setFacture = (a) => {
    acompte = a
}
module.exports = (res, acompte) => {
    if(acompte === undefined) {
        throw 'Acompte indisponible'
    }
    setFacture(acompte)
    
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
                Title : `CHEZ MES SOEURS - Facture d'Acompte ${acompte.Ref_Facture}`,
                Author : 'CHEZ MES SOEURS'
            } 
        })
        largeurPage = (doc.page.width - (doc.page.margins.left + doc.page.margins.right))
        hauteurPage = (A4.hauteur - (doc.page.margins.top + doc.page.margins.bottom))

        pageDrawingSpace.top = generalHeaderHeight + paddingPageContent.top
        pageDrawingSpace.bottom = A4.hauteur - doc.page.margins.bottom - generalFooterHeight - paddingPageContent.bottom
        pageDrawingSpace.width = largeurPage - (paddingPageContent.left + paddingPageContent.right)

        

        // **** écriture du document
        logger.info("PDF creation started")
        // dessin affichage
        drawLastPage()

        drawPagesNumber()
        
        logger.info("PDF created correctly")
        // définition de la sortie
        // la définition se fait à la fin car bufferPages est à  true pour ensuite écrire les numéros de pages
        // mais également pour en cas d'erreur ne pas renvoyer un bout de document mais juste un message d'erreur
        doc.pipe(res)
    }
    catch(error) {
        logger.error(error)
        throw 'Une erreur est survenue lors de l\'édition de la facture d\'acompte.'
    }
    finally {
        doc.end()        
    }
}

const drawGeneralHeader = () => {    
    doc.rect(doc.page.margins.left, yPos, largeurPage, generalHeaderHeight).fillAndStroke(backgroundColor)

    yPos += paddingGeneralHeader
    
    doc.image(srcLogo, doc.page.margins.left, yPos, { height : heightLogo, align : 'left' })

    doc.fillColor('black', 1).fontSize(pixelsToPoints(21)).font(fontContent)

    const content1 = "Facture d'Acompte n°" 
    const options = { align : 'center'}
    let width = doc.widthOfString(content1, options)
    let height = doc.heightOfString(content1, { ...options, width })
    const content2 = acompte.Ref_Facture
    width = doc.widthOfString(content2, options)
    height += doc.heightOfString(content2, { ...options, width })

    doc    
    .text(`${content1}\n${content2}`, doc.page.margins.left, yPos - paddingGeneralHeader + (generalHeaderHeight * 0.5), { ...options, height, baseline : 'bottom' })

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
    // logger.info('generalFooterHeight : ', height, 'tempY : ', tempY)
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

const drawPagesNumber = () => {
    const range = doc.bufferedPageRange()
    doc.fontSize(pixelsToPoints(12)).fillColor('black', 1)
    let i = 0
    let end = 0
    for(i = range.start, end = range.start + range.count, range.start <= end; i < end; i++) {
        doc.switchToPage(i)
        const string = `Page ${i + 1} / ${range.count}`
        const options = { align : 'right' }
        const width = doc.widthOfString(string, options) + pixelsToPoints(10)
        // const height = doc.heightOfString(string, { ...options, width : width })
        doc.text(string, (largeurPage + doc.page.margins.right - width), (doc.page.margins.top + generalHeaderHeight + (paddingGeneralHeader * 2)) * 0.5)
    }
}

const newPage = (add = true) => {
    if(add) doc.addPage()
    yPos = doc.page.margins.top
    drawGeneralHeader()
    drawGeneralFooter()
    yPos += paddingPageContent.top
}

const drawIdentification = () => {
    let options = { align : 'left' }

    const largeurDispo = largeurPage - (paddingContent.left + paddingContent.right)
    const largeurParIdentification = (largeurDispo - ((paddingContent.left + paddingContent.right) * 2) - paddingContent.right) * 0.5
    const xIdentificationEntreprise = doc.page.margins.left + (paddingContent.left * 3)
    const xIdentificationClient = xIdentificationEntreprise + largeurParIdentification + (largeurParIdentification / 16) + paddingContent.left
    let hauteurMaxIdentification = 0
    options.width = largeurParIdentification - (largeurParIdentification / 8)

    yPos += paddingTitles.top
    doc.y = yPos

    doc.font(fontTitles).fontSize(fontSizeTitles)
    doc.text('Chez Mes Soeurs', xIdentificationEntreprise, doc.y, options)
    doc.text('18 Avenue de la Concorde', xIdentificationEntreprise, doc.y, options)
    doc.text('21000 DIJON', xIdentificationEntreprise, doc.y, options)
    doc.text('Tél : 06 61 91 80 12', xIdentificationEntreprise, doc.y, options)
    doc.text('Email : chezmessoeurs@gmail.com', xIdentificationEntreprise, doc.y, options)
    hauteurMaxIdentification = hauteurMaxIdentification > doc.y ? hauteurMaxIdentification : doc.y

    doc.y = yPos
    const top = {
        x : xIdentificationEntreprise + largeurParIdentification,
        y : doc.y - paddingTitles.top
    }
    

    const isProfessionnel = !!acompte.Client.Societe
    if(isProfessionnel) {
        doc.text(acompte.Client.Societe, xIdentificationClient, doc.y, options)
    }
    doc.text(`${acompte.Client.Prenom} ${acompte.Client.Nom}`, xIdentificationClient, doc.y, options)
    doc.text(acompte.Client.Adresse_Facturation_Adresse, xIdentificationClient, doc.y, options)
    if(acompte.Client.Adresse_Facturation_Adresse_Complement_1 !== '' && acompte.Client.Adresse_Facturation_Adresse_Complement_2 !== '') {
        doc.text(acompte.Client.Adresse_Facturation_Adresse_Complement_1, xIdentificationClient, doc.y, options)
        doc.text(acompte.Client.Adresse_Facturation_Adresse_Complement_2, xIdentificationClient, doc.y, options)
    }
    doc.text(`${acompte.Client.Adresse_Facturation_CP} ${acompte.Client.Adresse_Facturation_Ville.toUpperCase()}`, xIdentificationClient, doc.y, options)
    if(isProfessionnel) {
        doc.text(`Numéro TVA : ${acompte.Client.Numero_TVA}`, xIdentificationClient, doc.y, options)
    }

    hauteurMaxIdentification = hauteurMaxIdentification > doc.y ? hauteurMaxIdentification : doc.y

    const bottom = {
        x : top.x,
        y : doc.y + paddingTitles.bottom
    }

    // cadre client
    doc
    .moveTo(top.x, top.y)
    .lineTo(top.x + largeurParIdentification + (largeurParIdentification / 16), top.y)
    .lineTo(bottom.x + largeurParIdentification + (largeurParIdentification / 16), bottom.y)
    .lineTo(bottom.x, bottom.y)
    .lineTo(top.x, top.y)
    .strokeColor(backgroundColor)
    .stroke()


    yPos = hauteurMaxIdentification
    yPos += paddingTitles.bottom
    doc.y = yPos
}

const drawRefFactureDate = () => {
    let content = ''
    let height = undefined    
    let width = undefined

    doc.moveDown(2)
    yPos = doc.y
    doc.font(fontContent).fontSize(fontSizeContent)

    const xFactureDate = doc.page.margins.left + paddingPageContent.left + paddingContent.left
    if(acompte.Vente.Ref_Devis) doc.text(`Référence devis : ${acompte.Vente.Ref_Devis}`, xFactureDate, doc.y)
    doc
    // .text(`Référence facture : ${acompte.Numero_Facture}`, xFactureDate, doc.y)
    .text(`Référence acompte : ${acompte.Ref_Facture}`, xFactureDate, doc.y)
    .text(`Date d'émission : ${moment().format('DD/MM/YYYY')}`)

    yPos = doc.y
}



const drawReglement = (yTop) => {
    const pageLeft = doc.page.margins.left + paddingPageContent.left + paddingContent.left
    const pageRight = doc.page.width - (doc.page.margins.right + paddingPageContent.right)
    const pageWidth = pageRight - pageLeft
    const width = largeurPage - (paddingPageContent.left + paddingPageContent.right + paddingContent.left + paddingContent.right)
    let options = { align : 'left', width }

    doc.y = yTop + paddingContent.top

    doc.font(fontContent).fontSize(fontSizeContent)
    doc.text('Mode de règlement : virement bancaire*', pageLeft, doc.y, options)

    if(acompte.Client.Type === 'Professionnel') {
        doc.y += paddingContent.top
        // doc.text(`Date d'échéance : Payable à réception`, pageLeft, doc.y, options)
        doc.text(`Date d'échéance : ${acompte.Date_Paiement_Du}`, pageLeft, doc.y, options)
        doc.y += paddingContent.top
        doc.text(`Date d'exécution de la prestation : ${acompte.Date_Evenement}`, pageLeft, doc.y, options)
        doc.y += paddingContent.top
        doc.text(`Taux de pénalité à compter du : -`, pageLeft, doc.y, options)
        doc.y += paddingContent.top
        doc.text(`En l'absence de paiement : -`, pageLeft, doc.y, options)
        doc.y += paddingContent.top
        doc.text(`Conditions d'escompte : Escompte pour paiement anticipé : néant`, pageLeft, doc.y, options)
    }

    return yTop
}

const drawRIB = () => {
    const pageLeft = doc.page.margins.left + paddingPageContent.left + paddingContent.left
    const pageRight = doc.page.width - (doc.page.margins.right + paddingPageContent.right)
    const pageWidth = pageRight - pageLeft
    const width = (pageWidth * 0.4) - paddingContent.right
    let options = { align : 'left', width }

    let ribTop = doc.y + paddingTitles.top
    // 900x422 taille rib (Lxh)
    const ribHeight = pixelsToPoints(422) / 1.9
    let ribWidth = pixelsToPoints(900) / 1.9
    let textRib = '*Virement a effectuer avec le RIB joint '
    const sautPage = (ribTop + ribHeight + paddingContent.top + paddingPageContent.bottom) > pageDrawingSpace.bottom
    if(sautPage) {
        textRib += 'page suivante.'
    }
    else {
        textRib += 'ci-dessus.'
    }

    // affiche texte
    doc.font(fontContent).fontSize(10)
    options = { align : 'left', oblique : true, width : pageWidth }
    const height = doc.heightOfString(textRib, options)
    yPos = (pageDrawingSpace.bottom - height)
    doc.text(textRib, pageLeft, yPos, options)

    if(sautPage) {
        newPage(true)
        ribTop = yPos
        doc.y = yPos
    }

    const maxRibWidth = pageWidth - paddingTitles.left + paddingTitles.right
    if(ribWidth > maxRibWidth) ribWidth = maxRibWidth
    const ribLeft = (pageWidth - (paddingTitles.left + paddingTitles.right) - ribWidth) / 2
    doc.image(__dirname + '/../../../public/img/rib-cms.png', pageLeft + paddingTitles.left + ribLeft, ribTop, { height : ribHeight, width : ribWidth, align : 'center' })
}

const drawLastPage = () => {
    newPage(false)
    
    let height = 0
    let width = 0
    let content = ''
    let options = {}
    
    drawIdentification()
    doc.moveDown(2)
    drawRefFactureDate()

    yPos = doc.y
    xPos = doc.page.margins.left + paddingPageContent.left + paddingContent.left
    width = largeurPage - (paddingPageContent.left + paddingPageContent.right + paddingContent.left + paddingContent.right)

    doc.fontSize(fontSizeContent).font(fontContent).fillColor('black', 1)

    let stringMontant = ''
    if(acompte.Pourcentage_Acompte) {
        stringMontant += `${acompte.Pourcentage_Acompte}% sur les ${acompte.Vente.Reste_A_Payer} € restant à votre charge, soit la somme de ${acompte.Prix_TTC} €.`
    }
    else {
        stringMontant += `${acompte.Prix_TTC} € sur les ${acompte.Vente.Reste_A_Payer} € restant à votre charge.`
    }

    doc
    .moveDown(4)
    .text('Madame, Monsieur,', (xPos + (paddingContent.left * 2)), doc.y, { width, align : 'left' })
    .moveDown(1)
    .text(`Par la présente il vous est demandé un acompte sur le devis ${acompte.Vente.Ref_Devis} de ${stringMontant}`, xPos, doc.y, { width, align : 'left' })
    .text('Vous trouverez les modalités ci-dessous et nous restons à votre disposition.', xPos, doc.y, { width, align : 'left' })
    .moveDown(2)
    .text("L'équipe Chez Mes Soeurs", xPos, doc.y, { width, align : 'right' })
    .moveDown(4)
    
    drawReglement(doc.y)
    drawRIB()

    yPos = doc.y
    xPos = doc.page.margins.left + paddingPageContent.left + paddingContent.left
}