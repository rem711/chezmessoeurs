let tab = {
    prixsucre:5,
    prixbox: 15
}

let tab_prix_piece = {
    "4": 6.40,
    "5": 8.00,
    "6": 9.60,
    "7": 11.20,
    "8": 12.80,
    "9": 14.40,
    "10": 16.00,
    "11": 17.60,
    "12": 19.2,
    "13": 20.8,
    "14": 22.4,
    "15": 24,
    "16": 25.60
}

let tab_prix_piece_sucree = {
    "1": 1.45,
    "2": 2.90,
    "3": 4.35,
    "4": 5.80,
    "5": 7.25,
    "6": 8.70
}

let prix = {
    sale: 0,
    sucre: 0,
    box: 0,
    brunch: 0,
    fbrunchsale: "NON",
    fbrunchsucree: "NON"
}

let error = ["autor_label"];

$('#sale').hide();
$('#rsale').hide();
$('#sucre').hide();
$('#rsucre').hide();
$('#box').hide();
$('#rbox').hide();
$('#brunch').hide();
$('#rbrunch').hide();
$('#select_pieces_salee').hide();
$('#select_pieces_sucree').hide();
$('#prix').hide();
$('#recap').hide();
$('#btn-mail').hide();
$('#infos').hide();



$('#sale_title').click( () => {
    $('#sale').toggle();
    $('#rsale').toggle();
    changeSale();
});

$('#sucre_title').click( () => {
    $('#sucre').toggle();
    $('#rsucre').toggle();
    changeSucre();
});

$('#box_title').click( () => {
    $('#box').toggle();
    $('#rbox').toggle();
    changeBox();
});

$('#brunch_title').click( () => {
    $('#brunch').toggle();
    $('#rbrunch').toggle();
    changeBrunch();
});

$('#formule_salee').click( () => {
    $('#select_pieces_salee').toggle();
    changeBrunch();
});

$('#formule_sucree').click( () => {
    $('#select_pieces_sucree').toggle();
    changeBrunch();
});

$('#nb_pieces_par_personne_sale').change( (el) => {
    changeSale();  
});

$('#nb_invite_sale').change( (el) => {

    var value = $('#nb_invite_sale').val();
    
    if ((value !== '') && (value.indexOf('.') === -1)) {
        
        $('#nb_invite_sale').val(Math.max(Math.min(value, 100000), 6));
    }

    changeSale();    
});

$('#nb_pieces_par_personne_sale_cocktail').change( (el) => {
    changeSucre();
});

$('#nb_pieces_par_personne_sucre').change( (el) => {
    changeSucre();    
});

$('#nb_invite_sucre').change( (el) => {

    var value = $('#nb_invite_sucre').val();
    
    if ((value !== '') && (value.indexOf('.') === -1)) {
        
        $('#nb_invite_sucre').val(Math.max(Math.min(value, 100000), 6));
    }

    changeSucre();
});

$('#formule_sucree_choix').change( (el) => {
    changeBrunch();
});

$('#formule_salee_choix').change( (el) => {
    changeBrunch();
});


$('#nb_invite_brunch').change( (el) => {

    var value = $('#nb_invite_brunch').val();
    
    if ((value !== '') && (value.indexOf('.') === -1)) {
        
        $('#nb_invite_brunch').val(Math.max(Math.min(value, 100000), 15));
    }

    changeBrunch();
});


$('#nb_invite_box').change( (el) => {

    var value = $('#nb_invite_box').val();
    
    if ((value !== '') && (value.indexOf('.') === -1)) {
        
        $('#nb_invite_box').val(Math.max(Math.min(value, 100000), 4));
    }

    changeBox();
});


$('#btn-prix').click(() => {

    $('#prix').show();
    $('#recap').show();
    $('#btn-mail').show();
});

$('#btn-mail').click(() => {

    $('#infos').show();

});

$('#tel').on('keyup', (event) => {
    if ($('#tel').val().toString().length < 14) {
        let tab = $('#tel').val().toString().split(' ');
        let last = tab[tab.length - 1];
        if (last.length == 2) {
            $('#tel').val($('#tel').val() + " ");
        }
    }
});

$('#infos').submit((e) => {

    e.preventDefault();
    submitEstimation()
});

const submitEstimation = async () => {
    error = ["autor_label"];
    console.log(error);
    let form = $('form').serializeArray();
    form.forEach((value, index) =>{
        prix[value.name] = value.value;
        switch(value.name){
            case "nom":
                value.value.length == 0 ? error.push(value.name) : "";
            break;
            case "prenom":
                value.value.length == 0 ? error.push(value.name) : "";
            break;
            case "mail":
                var regex = new RegExp('^(([^<>()\\[\\]\\.,;:\\s@\\"]+(\\.[^<>()\\[\\]\\.,;:\\s@\\"]+)*)|(\\".+\\"))@(([^<>()[\\]\\.,;:\\s@\\"]+\\.)+[^<>()[\\]\\.,;:\\s@\\"]{2,})$', 'g');
                var found = value.value.match(regex);
                found == null ? error.push(value.name) : "";
            break;
            case "date_event":
                    value.value.length == 0 ? error.push(value.name) : "";
            break;
            case "autor":
                error.shift();
            break;   
        }
    });
    $('#nom').css('border', 'none');
    $('#prenom').css('border', 'none');
    $('#mail').css('border', 'none');
    $('#tel').css('border', 'none');
    $('#date_event').css('border', 'none');
    $('#autor_label').css('color', '#666666');
    $('form > p').css("visibility", "hidden");
    error.forEach((value, index) =>{
        if(value == "autor_label"){
            $('#autor_label').css('color', 'red');
        }else{
            $('#'+value).css('border', '1px solid red');
        }
    });

    if(error.length == 0){
        // envoie estimation
        const infos = await sendEstimation()

        // tout s'estbien passé, on envoie le mail
        if(infos === undefined || !infos.error) {
            $('#nom').val("");
            $('#prenom').val("");
            $('#mail').val("");
            $('#tel').val("");
            $('#date_event').val("");
            $('#comm').val("");
            $('#autor').prop('checked', false);

            // sendMail()        
            $('form > p').html("Le mail a bien été envoyé");
            $('form > p').css("visibility", "visible");
            $('form > p').css("color", "green");
        }
        else {
            $('form > p').html(infos.error);
            $('form > p').css("color", "red");
            $('form > p').css("visibility", "visible");
        }
    }else{
        $('form > p').css("color", "red");
        $('form > p').css("visibility", "visible");
    }
}

function changePrice(id, prixx){
    $(id).html(Number.parseFloat(prixx).toFixed(2)+" € HT");
    $('#prix_par_personne').html('');
    const prixTotalHT = Number.parseFloat(prix['sale']+prix['sucre']+prix['box']+prix['brunch']);
    const prixTotalTTC = prixTotalHT * 1.1;
    $('#prix_total').html(Number.parseFloat(prixTotalTTC).toFixed(2)+' € TTC');
    $('#prix_par_personne').html(Number.parseFloat(prixTotalHT).toFixed(2)+' € HT');
}

function changeBrunch(){
    let multiplicateur = 0;

    if($('#brunch_title').is(':checked')){

        if($('#formule_salee').is(':checked')){
            multiplicateur += Number.parseFloat($('#formule_salee_choix').children("option:selected").val());
            prix["fbrunchsale"] = $('#formule_salee_choix').children("option:selected").html();
        }else{
            prix["fbrunchsale"] = "NON";
        }
        if($('#formule_sucree').is(':checked')){
            multiplicateur += Number.parseFloat($('#formule_sucree_choix').children("option:selected").val());
            prix["fbrunchsucree"] = $('#formule_sucree_choix').children("option:selected").html();
        }else{
            prix["fbrunchsucree"] = "NON";
        }
        $("#ppbu").html(Number.parseFloat(multiplicateur).toFixed(2)+" € HT/pers");
        prix['brunch'] = multiplicateur * $('#nb_invite_brunch').val();

    }else{
        prix['brunch'] = 0;
        prix["pbrunch"] = null;
        prix["ppbrunch"] = null;
    }
    prix["pbrunch"] = $('#nb_invite_brunch').val();
    prix["ppbrunch"] = multiplicateur;
    changePrice('#prixbrunchp_personne', $('#nb_invite_brunch').val() * multiplicateur);
}

function changeBox(){

    if($('#box_title').is(':checked')){
        $("#ppbo").html(Number.parseFloat(tab['prixbox']).toFixed(2)+" € HT/pers");
        prix['box'] = $('#nb_invite_box').val() * tab['prixbox'];
    }else{
        prix['box'] = 0;
        prix["pbox"] = null;
    }
    prix["pbox"] = $('#nb_invite_box').val();
    changePrice('#prixbox_personne', $('#nb_invite_box').val() * tab['prixbox']);
}

function changeSale(){

    if($('#sale_title').is(':checked')){
        $("#ppsa").html(Number.parseFloat(tab_prix_piece[$('#nb_pieces_par_personne_sale').children("option:selected").val()]).toFixed(2)+" € HT/pers");
        prix['sale'] = $('#nb_invite_sale').val() * tab_prix_piece[$('#nb_pieces_par_personne_sale').children("option:selected").val()];
    }else{
        prix['sale'] = 0;
        prix["psale"] = null;
        prix["isale"] = null;
    }
    prix["isale"] = $('#nb_invite_sale').val();
    prix["psale"] = $('#nb_pieces_par_personne_sale').children("option:selected").val();
    changePrice('#prixsale_personne', $('#nb_invite_sale').val() * tab_prix_piece[$('#nb_pieces_par_personne_sale').children("option:selected").val()]);
}

function changeSucre(){

    if($('#sucre_title').is(':checked')){
        const prixUnit = Number.parseFloat(Number.parseFloat(tab_prix_piece[$('#nb_pieces_par_personne_sale_cocktail').children("option:selected").val()]) + Number.parseFloat(tab_prix_piece_sucree[$('#nb_pieces_par_personne_sucre').children("option:selected").val()])).toFixed(2);
        $("#ppsu").html(prixUnit +" € HT/pers");
        const prixSaleCocktail = $('#nb_invite_sucre').val() * tab_prix_piece[$('#nb_pieces_par_personne_sale_cocktail').children("option:selected").val()];
        const prixSucre = tab_prix_piece_sucree[$('#nb_pieces_par_personne_sucre').children("option:selected").val()] * $('#nb_invite_sucre').val();
        prix['sucre'] = prixSaleCocktail + prixSucre;
    }else{
        prix["isucre"] = null;
        prix["psucre"] = null;
        prix['sucre'] = 0;
    }
    prix["isucre"] = $('#nb_invite_sucre').val();
    prix["psucre"] = Number.parseInt($('#nb_pieces_par_personne_sale_cocktail').children("option:selected").val()) + Number.parseInt($('#nb_pieces_par_personne_sucre').children("option:selected").val());
    const prixTot = $('#nb_invite_sucre').val() * tab_prix_piece[$('#nb_pieces_par_personne_sale_cocktail').children("option:selected").val()] + tab_prix_piece_sucree[$('#nb_pieces_par_personne_sucre').children("option:selected").val()] * $('#nb_invite_sucre').val();
    changePrice('#prixsucre_personne', prixTot);
}

const sendMail = () => {
    $.ajax({
        method: 'POST',
        url: 'php/mail.php',
        data: prix
    }).done((event) => {
        $('form > p').html("Le mail a bien été envoyé");
        $('form > p').css("visibility", "visible");
        $('form > p').css("color", "green");
    });
}

const sendEstimation = async () => {    
    const Date_Evenement = document.getElementById('date_event').value
    const Commentaire = document.getElementById('comm').value
    const { isAperitif, nbConvivesAperitif, nbPiecesSaleesAperitif } = getAperitif()
    const { isCocktail, nbConvivesCocktail, nbPiecesSaleesCocktail, nbPiecesSucreesCocktail } = getCocktail()
    const { isBox, nbConvivesBox } = getBox()
    const { isBrunch, nbConvivesBrunch, isBrunchSale, typeBrunchSale, isBrunchSucre, typeBrunchSucre } = getBrunch()
    const { Nom_Prenom, Email, Telephone } = getClient()

    const url = 'http://localhost:3000/estimations'
    const params = {
        Date_Evenement, Commentaire,
        isAperitif, nbConvivesAperitif, nbPiecesSaleesAperitif,
        isCocktail, nbConvivesCocktail, nbPiecesSaleesCocktail, nbPiecesSucreesCocktail,
        isBox, nbConvivesBox,
        isBrunch, nbConvivesBrunch, isBrunchSale, typeBrunchSale, isBrunchSucre, typeBrunchSucre,
        Nom_Prenom, Email, Telephone
    }
    const options = {
        method : 'POST',
        body : JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const response = await fetch(url, options)

    const data = await response.json()
    const { infos, estimation } = data

    return infos
}

// récupère les infos d'un client
const getClient = () => {
    const Nom_Prenom = document.getElementById('nom').value + ' ' + document.getElementById('prenom').value
    const Email = document.getElementById('mail').value
    const Telephone = document.getElementById('tel').value
    
    return {
        Nom_Prenom,
        Email,
        Telephone
    }
}

// récupère les infos d'un apéritif
const getAperitif = () => {
    const isAperitif = document.getElementById('sale_title').checked
    let nbConvivesAperitif = 0
    let nbPiecesSaleesAperitif = 0

    if(isAperitif) {
        nbConvivesAperitif = document.getElementById('nb_invite_sale').value
        nbPiecesSaleesAperitif = document.getElementById('nb_pieces_par_personne_sale').value
    }

    return {
        isAperitif,
        nbConvivesAperitif,
        nbPiecesSaleesAperitif
    }
}

// récupère les infos d'un cocktail
const getCocktail = () => {
    const isCocktail = document.getElementById('sucre_title').checked
    let nbConvivesCocktail = 0
    let nbPiecesSaleesCocktail = 0
    let nbPiecesSucreesCocktail = 0

    if(isCocktail) {
        nbConvivesCocktail = document.getElementById('nb_invite_sucre').value
        nbPiecesSaleesCocktail = document.getElementById('nb_pieces_par_personne_sale_cocktail').value
        nbPiecesSucreesCocktail = document.getElementById('nb_pieces_par_personne_sucre').value
    }

    return {
        isCocktail,
        nbConvivesCocktail,
        nbPiecesSaleesCocktail,
        nbPiecesSucreesCocktail
    }
}

// récupère les infos d'une box
const getBox = () => {
    const isBox = document.getElementById('box_title').checked
    let nbConvivesBox = 0

    if(isBox) {
        nbConvivesBox = document.getElementById('nb_invite_box').value
    }

    return {
        isBox,
        nbConvivesBox
    }
}

// récupère les infos d'un brunch
const getBrunch = () => {
    const isBrunch = document.getElementById('brunch_title').checked
    let nbConvivesBrunch = 0
    let isBrunchSale = false
    let typeBrunchSale = undefined
    let isBrunchSucre = false
    let typeBrunchSucre = undefined

    if(isBrunch) {
        nbConvivesBrunch = document.getElementById('nb_invite_brunch').value
        isBrunchSale = document.getElementById('formule_salee').checked
        if(isBrunchSale) {
            const selectedIndex = document.getElementById('formule_salee_choix').selectedIndex
            typeBrunchSale = document.getElementById('formule_salee_choix')[selectedIndex].text
        }
        isBrunchSucre = document.getElementById('formule_sucree').checked
        if(isBrunchSucre) {
            const selectedIndex = document.getElementById('formule_sucree_choix').selectedIndex
            typeBrunchSucre = document.getElementById('formule_sucree_choix')[selectedIndex].text
        }
    }

    return {
        isBrunch,
        nbConvivesBrunch,
        isBrunchSale,
        typeBrunchSale,
        isBrunchSucre,
        typeBrunchSucre
    }
}
