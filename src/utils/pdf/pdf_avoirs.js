/* eslint-disable max-params */
/* eslint-disable no-param-reassign */
const PDFDocument = require('pdfkit')
const moment = require('moment')
const TVA = 10

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

let avoir = undefined
const setFacture = (a) => {
    avoir = a
}
module.exports = (res, avoir) => {
    if(avoir === undefined) {
        throw 'Facture indisponible'
    }
    setFacture(avoir)
    
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
                Title : `CHEZ MES SOEURS - Facture d'Avoir ${avoir.Ref_Avoir}`,
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
        throw 'Une erreur est survenue lors de l\'édition de la facture d\'avoir'
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

    const content1 = "Facture d'Avoir n°" 
    const options = { align : 'center'}
    let width = doc.widthOfString(content1, options)
    let height = doc.heightOfString(content1, { ...options, width })
    const content2 = avoir.Ref_Avoir
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
    

    const isProfessionnel = !!avoir.Client.Societe
    if(isProfessionnel) {
        doc.text(avoir.Client.Societe, xIdentificationClient, doc.y, options)
    }
    doc.text(`${avoir.Client.Prenom} ${avoir.Client.Nom}`, xIdentificationClient, doc.y, options)
    doc.text(avoir.Client.Adresse_Facturation_Adresse, xIdentificationClient, doc.y, options)
    if(avoir.Client.Adresse_Facturation_Adresse_Complement_1 !== '' && avoir.Client.Adresse_Facturation_Adresse_Complement_2 !== '') {
        doc.text(avoir.Client.Adresse_Facturation_Adresse_Complement_1, xIdentificationClient, doc.y, options)
        doc.text(avoir.Client.Adresse_Facturation_Adresse_Complement_2, xIdentificationClient, doc.y, options)
    }
    doc.text(`${avoir.Client.Adresse_Facturation_CP} ${avoir.Client.Adresse_Facturation_Ville.toUpperCase()}`, xIdentificationClient, doc.y, options)
    if(isProfessionnel) {
        doc.text(`Numéro TVA : ${avoir.Client.Numero_TVA}`, xIdentificationClient, doc.y, options)
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
    doc
    .text(`Référence facture : ${avoir.Ref_Facture}`, xFactureDate, doc.y)
    .text(`Référence avoir : ${avoir.Ref_Avoir}`, xFactureDate, doc.y)    
    .text(`Date d'émission : ${moment().format('DD/MM/YYYY')}`)

    yPos = doc.y
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

const tabRecapWriteFourthCol = (content, maxHeightRow, sizeCol4, gap, align = 'left') => {
    const options = {width : sizeCol4 - paddingContent.left - paddingContent.right, align : 'center'}
    xPos += gap
    doc.text(content, xPos, yPos, options)
    const currentHeight = doc.heightOfString(content, options) + paddingContent.bottom
    maxHeightRow = currentHeight > maxHeightRow ? currentHeight : maxHeightRow

    return maxHeightRow
}

const drawTablesRecap = () => {
    let content = ''
    let options = {}
    let currentHeight = 0
    let maxHeightRow = 0
    // tableau avec les différentes coordonnées x,y lors de l'écriture pour savoir comment tracer le tableau
    let tabPositions = []

    const pageLeft = doc.page.margins.left + paddingPageContent.left
    const pageRight = doc.page.width - (doc.page.margins.right + paddingPageContent.right)
    const pageWidth = pageRight - pageLeft
    // const sizeCol1 = pageWidth * (2/3) 
    // const sizeCol2 = (pageWidth * (1/3)) * 0.5 
    // const sizeCol3 = (pageWidth * (1/3)) * 0.5 
    const sizeCol1 = pageWidth * (1/2) 
    const sizeCol2 = (pageWidth * (1/2)) * (1/3) 
    const sizeCol3 = (pageWidth * (1/2)) * (1/3) 
    const sizeCol4 = (pageWidth * (1/2)) * (1/3) 
    let tableTop = 0
    let tableBottom = 0
    const aPayerLeft = pageWidth * 0.6
    const aPayerRight = pageRight
    const aPayerWidth = aPayerRight - aPayerLeft
    let aPayerTop = 0
    let aPayerBottom = 0
    

    const contoursTableau = () => {
        tableBottom = yPos
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
        .moveTo(pageLeft + sizeCol1 + sizeCol2 + sizeCol3, tableTop)
        .lineTo(pageLeft + sizeCol1 + sizeCol2 + sizeCol3, tableBottom)
        .moveTo(pageRight, tableTop)
        .lineTo(pageRight, tableBottom)
        .strokeColor('black', 0.5)
        .stroke()

        tabPositions = []
        tableTop = 0
        tableBottom = 0
    }

    const contoursAPayer = () => {
        // lignes
        for(let i = 0; i < tabPositions.length; i += 2) {
            const from = tabPositions[i]
            const to = tabPositions[i+1]
            doc.moveTo(from.x, from.y)
            doc.lineTo(to.x, to.y)
        }
        // colonnes
        doc
        .moveTo(aPayerLeft, aPayerTop)
        .lineTo(aPayerLeft, aPayerBottom)
        .moveTo(aPayerRight, aPayerTop)
        .lineTo(aPayerRight, aPayerBottom)
        .strokeColor('black', 0.5)
        .stroke()

        tabPositions = []
        aPayerTop = 0
        aPayerBottom = 0
    }

    const enteteTableau = () => {
        yPos = doc.y

        // **** Ecriture ligne d'entête
        // l'écriture se fait par ligne en se décalant vers la droite afin de remplir chaque case
        doc.font(fontTitles).fontSize(fontSizeTitles)    
        // top ligne entête gauche
        tabPositions.push({x : pageLeft, y : yPos}) 
        // top ligne entête droite
        tabPositions.push({x : pageRight, y : yPos}) 
        tableTop = yPos
        yPos += paddingContent.top

        // col1
        maxHeightRow = tabRecapWriteFirstCol('Désignation', maxHeightRow, sizeCol1, pageLeft, 'center')

        // col2
        maxHeightRow = tabRecapWriteSecondCol('Prix unitaire HT', maxHeightRow, sizeCol2, sizeCol1, 'center')

        // col3
        maxHeightRow = tabRecapWriteThirdCol('Quantité', maxHeightRow, sizeCol3, sizeCol2, 'center')

        // col4
        maxHeightRow = tabRecapWriteFourthCol('Total HT', maxHeightRow, sizeCol4, sizeCol3, 'center')

        yPos += maxHeightRow
        // bottom ligne entête gauche
        tabPositions.push({x : pageLeft, y : yPos}) 
        // bottom ligne entête droite
        tabPositions.push({x : pageRight, y : yPos}) 
        doc.font(fontContent).fontSize(fontSizeContent)
    }

    const nextPage = () => {
        newPage()
        doc.y = yPos
        doc.moveDown(1)
        yPos = doc.y        
    }

    doc.moveDown(2)
    enteteTableau()

    // tabPositions.push({x : pageLeft, y : yPos}) // top 1ère ligne gauche
    // tabPositions.push({x : pageRight, y : yPos}) // top 1ère ligne droite

    // **** contenu du tableau
    doc.font(fontContent).fontSize(fontSizeContent)
    // test d'espace
    doc.fillColor('white', 0)
    maxHeightRow = 0
    content = avoir.Description
    maxHeightRow = tabRecapWriteFirstCol(content, maxHeightRow, sizeCol1, pageLeft, 'left')
    maxHeightRow = tabRecapWriteSecondCol(`${Number.parseFloat(avoir.Prix_HT / avoir.Vente.Nb_Personnes).toFixed(2)}€`, maxHeightRow, sizeCol2, sizeCol1, 'center')
    maxHeightRow = tabRecapWriteThirdCol(avoir.Vente.Nb_Personnes, maxHeightRow, sizeCol3, sizeCol2, 'center')
    maxHeightRow = tabRecapWriteFourthCol(`${avoir.Prix_HT}€`, maxHeightRow, sizeCol4, sizeCol3, 'center')

    // pas assez d'espace
    if((yPos + maxHeightRow + paddingContent.top + paddingPageContent.bottom) > pageDrawingSpace.bottom) {
        contoursTableau()
        nextPage()
        enteteTableau()
    }

    // on ajoute la padding top
    yPos += paddingContent.top

    // écriture
    doc.fillColor('black', 1)
    maxHeightRow = 0
    content = avoir.Description
    maxHeightRow = tabRecapWriteFirstCol(content, maxHeightRow, sizeCol1, pageLeft, 'left')
    maxHeightRow = tabRecapWriteSecondCol(`${Number.parseFloat(avoir.Prix_HT / avoir.Vente.Nb_Personnes).toFixed(2)}€`, maxHeightRow, sizeCol2, sizeCol1, 'center')
    maxHeightRow = tabRecapWriteThirdCol(avoir.Vente.Nb_Personnes, maxHeightRow, sizeCol3, sizeCol2, 'center')
    maxHeightRow = tabRecapWriteFourthCol(`${avoir.Prix_HT}€`, maxHeightRow, sizeCol4, sizeCol3, 'center')

    // on ajoute le padding bottom
    yPos += maxHeightRow
    // on ajoute la ligne du dessous de la row
    tabPositions.push({x : pageLeft, y : yPos}) 
    tabPositions.push({x : pageRight, y : yPos})   
    

    contoursTableau()
    
    let yPosInit = yPos
    let yTableauAPayer = 0

    const divAPayer = () => {
        // **** tableau A PAYER
        doc.font(fontTitles).fontSize(fontSizeTitles)    

        yPos += paddingTitles.top
        aPayerTop = yPos
        xPos = aPayerLeft + paddingTitles.left
        tabPositions.push({x : aPayerLeft, y : yPos})
        tabPositions.push({x : aPayerRight, y : yPos})

        yTableauAPayer = yPos

        // Montant HT
        maxHeightRow = 0
        options = {width : (aPayerWidth * 0.5) - paddingContent.left - paddingContent.right, align : 'left'}
        content = 'Montant HT'
        yPos += paddingContent.top
        doc.text(content, xPos, yPos, options)
        currentHeight = doc.heightOfString(content, options) + paddingContent.bottom
        maxHeightRow = currentHeight > maxHeightRow ? currentHeight : maxHeightRow
        options = {width : (aPayerWidth * 0.5) - paddingContent.left - paddingContent.right, align : 'right'}
        content = `${avoir.Prix_HT}€`
        doc.text(content, xPos + (aPayerWidth * 0.5), yPos, options)
        currentHeight = doc.heightOfString(content, options) + paddingContent.bottom
        maxHeightRow = currentHeight > maxHeightRow ? currentHeight : maxHeightRow
        yPos += maxHeightRow

        // TVA
        maxHeightRow = 0
        tabPositions.push({x : aPayerLeft, y : yPos})
        tabPositions.push({x : aPayerRight, y : yPos})
        options = {width : (aPayerWidth * 0.5) - paddingContent.left - paddingContent.right, align : 'left'}
        content = `TVA (${TVA}%)`
        yPos += paddingContent.top
        doc.text(content, xPos, yPos, options)
        currentHeight = doc.heightOfString(content, options) + paddingContent.bottom
        maxHeightRow = currentHeight > maxHeightRow ? currentHeight : maxHeightRow
        options = {width : (aPayerWidth * 0.5) - paddingContent.left - paddingContent.right, align : 'right'}
        content = `${Number.parseFloat(avoir.Prix_HT * (TVA / 100)).toFixed(2)}€`
        doc.text(content, xPos + (aPayerWidth * 0.5), yPos, options)
        currentHeight = doc.heightOfString(content, options) + paddingContent.bottom
        maxHeightRow = currentHeight > maxHeightRow ? currentHeight : maxHeightRow
        yPos += maxHeightRow

        // Montant TTC
        maxHeightRow = 0
        tabPositions.push({x : aPayerLeft, y : yPos})
        tabPositions.push({x : aPayerRight, y : yPos})
        options = {width : (aPayerWidth * 0.5) - paddingContent.left - paddingContent.right, align : 'left'}
        content = 'Montant TTC'
        yPos += paddingContent.top
        doc.text(content, xPos, yPos, options)
        currentHeight = doc.heightOfString(content, options) + paddingContent.bottom
        maxHeightRow = currentHeight > maxHeightRow ? currentHeight : maxHeightRow
        options = {width : (aPayerWidth * 0.5) - paddingContent.left - paddingContent.right, align : 'right'}
        content = `${Number.parseFloat(avoir.Prix_TTC).toFixed(2)}€`
        doc.text(content, xPos + (aPayerWidth * 0.5), yPos, options)
        currentHeight = doc.heightOfString(content, options) + paddingContent.bottom
        maxHeightRow = currentHeight > maxHeightRow ? currentHeight : maxHeightRow
        yPos += maxHeightRow

        // Net à payer
        maxHeightRow = 0
        tabPositions.push({x : aPayerLeft, y : yPos})
        tabPositions.push({x : aPayerRight, y : yPos})
        options = {width : (aPayerWidth * 0.5) - paddingContent.left - paddingContent.right, align : 'left'}
        content = 'Montant Avoir'
        yPos += paddingContent.top
        doc.text(content, xPos, yPos, options)
        currentHeight = doc.heightOfString(content, options) + paddingContent.bottom
        maxHeightRow = currentHeight > maxHeightRow ? currentHeight : maxHeightRow
        options = {width : (aPayerWidth * 0.5) - paddingContent.left - paddingContent.right, align : 'right'}
        content = `${avoir.Prix_TTC}€`
        doc.text(content, xPos + (aPayerWidth * 0.5), yPos, options)
        currentHeight = doc.heightOfString(content, options) + paddingContent.bottom
        maxHeightRow = currentHeight > maxHeightRow ? currentHeight : maxHeightRow
        yPos += maxHeightRow

        tabPositions.push({x : aPayerLeft, y : yPos})
        tabPositions.push({x : aPayerRight, y : yPos})
        aPayerBottom = yPos
    }

    // 157.415 hauteur mesurée du tableau à payer
    const heightTabAPayer = 157.415
    console.log(`suffisamment d'espace car besoin de ${(yPos + heightTabAPayer + paddingContent.top + paddingContent.bottom + paddingPageContent.bottom)} > ${pageDrawingSpace.bottom}`)
    // vérification approximative pour ne pas dessiner trop bas lors des tests et qu'il y ait des sauts de page générés automatiquement
    if((yPos + heightTabAPayer + paddingContent.top + paddingContent.bottom + paddingPageContent.bottom) > pageDrawingSpace.bottom) {
        nextPage()
        yPosInit = yPos
    }

    doc.fillColor('white', 0)
    divAPayer()
    // doc.moveDown(2)
    // drawReglement(yTableauAPayer)

    if((yPos + paddingContent.top + paddingContent.bottom + paddingPageContent.bottom) > pageDrawingSpace.bottom) {
        nextPage()
        yPosInit = yPos
    }
    
    yPos = yPosInit

    tabPositions = []
    doc.fillColor('black', 1)
    divAPayer()
    // drawReglement(yTableauAPayer)

    contoursAPayer()

    // drawRIB()
}

const drawReglement = (yTop) => {
    const pageLeft = doc.page.margins.left + paddingPageContent.left + paddingContent.left
    const pageRight = doc.page.width - (doc.page.margins.right + paddingPageContent.right)
    const pageWidth = pageRight - pageLeft
    const width = (pageWidth * 0.4) - paddingContent.right
    let options = { align : 'left', width }

    doc.y = yTop + paddingContent.top

    doc.font(fontContent).fontSize(fontSizeContent)
    doc.text('Mode de règlement : virement bancaire*', pageLeft, doc.y, options)

    if(avoir.Client.Type === 'Professionnel') {
        doc.y += paddingContent.top
        doc.text(`Date d'échéance : ${moment(avoir.Date_Creation).add(1, 'months').add(2, 'days').format('DD/MM/YYYY')}`, pageLeft, doc.y, options)
        doc.y += paddingContent.top
        doc.text(`Date d'exécution de la prestation : ${moment(avoir.Date_Evenement).format('DD/MM/YYYY')}`, pageLeft, doc.y, options)
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

    // FIXME:Image rib
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
    drawRefFactureDate()
    drawTablesRecap()
    doc.moveDown(2)

    yPos = doc.y
    xPos = doc.page.margins.left + paddingPageContent.left + paddingContent.left
    doc.fontSize(fontSizeContent).font(fontContent).fillColor('black', 1)
    content = "A la réception de ce courrier, merci de prendre contact avec nous, si ce n'est déjà fait, pour mettre en place les modalités de remboursement de l'avoir."
    width = largeurPage - (paddingPageContent.left + paddingPageContent.right + paddingContent.left + paddingContent.right)
    options = { width, align : 'left' }
    height = doc.heightOfString(content, options)

    if((yPos + height) > pageDrawingSpace.bottom) {
        newPage()
        doc.moveDown(2)
        yPos = doc.y
    }

    doc.text(content, xPos, yPos, options)

    yPos = doc.y
    xPos = doc.page.margins.left + paddingPageContent.left + paddingContent.left
}