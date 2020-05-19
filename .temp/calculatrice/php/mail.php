<?php
$message = '';
$stop = false;

if(!isset($_POST['nom']) || $_POST['nom'] == '') {
    $message = 'Le nom doit être défini.';
    $stop = true;
}
if(!isset($_POST['prenom']) || $_POST['prenom'] == '') {
    $message = 'Le prénom doit être défini.';
    $stop = true;
}
if(!isset($_POST['mail']) || $_POST['mail'] == '') {
    $message = "L'adresse e-mail doit être définie.";
    $stop = true;
}
if(!isset($_POST['date_event']) || $_POST['date_event'] == '') {
    $message = "La date de l'événement doit être définie.";
    $stop = true;
}
if(!(isset($_POST['sale']) && isset($_POST['sucre']) && isset($_POST['box']) && isset($_POST['brunch'])) || ($_POST['sale'] == 0 && $_POST['sucre'] == 0 && $_POST['box'] == 0 && $_POST['brunch'] == 0)) {
    $message = "Une formule doit être choisie.";
    $stop = true;
}

if($message != '' && $stop) {
    echo $message;
    exit();
}

ini_set('display_errors', 1);

$mail = $_POST['mail'];

$total = number_format($_POST['sale'] + $_POST['sucre'] + $_POST['box'] + $_POST['brunch'],2);
$totalttc = number_format((($_POST['sale'] + $_POST['sucre'] + $_POST['box'] + $_POST['brunch']) * 1.1),2);

if (!preg_match("#^[a-z0-9._-]+@(hotmail|live|msn).[a-z]{2,4}$#", $mail)) // On filtre les serveurs qui rencontrent des bogues.
{
    $passage_ligne = "\r\n";
}
else
{
    $passage_ligne = "\n";
}

$message_txt = '';
$message_html = "<!DOCTYPE HTML PUBLIC '-//W3C//DTD XHTML 1.0 Transitional //EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
<html xmlns='http://www.w3.org/1999/xhtml'>

<head>
    <title>Devis Chez mes soeurs</title>
    <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>


    <style type='text/css'>
        /* Fonts and Content */

        body,
        td {
            font-family: 'Raleway', sans-serif;
            font-size: 14px;
        }

        body {
            background-color: #e06128;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: none;
            -ms-text-size-adjust: none;
        }

        h2 {
            font-family: 'Raleway', sans-serif;
            padding-top: 12px;
            /* ne fonctionnera pas sous Outlook 2007+ */
            color: #e06128;
            font-size: 22px;
        }

        @media only screen and (max-width: 480px) {

            table[class=w275],
            td[class=w275],
            img[class=w275] {
                width: 135px !important;
            }
            table[class=w30],
            td[class=w30],
            img[class=w30] {
                width: 10px !important;
            }
            table[class=w580],
            td[class=w580],
            img[class=w580] {
                width: 280px !important;
            }
            table[class=w640],
            td[class=w640],
            img[class=w640] {
                width: 300px !important;
            }
            img {
                height: auto;
            }
            /*illisible, on passe donc sur 3 lignes */
            table[class=w180],
            td[class=w180],
            img[class=w180] {
                width: 280px !important;
                display: block;
            }
            td[class=w20] {
                display: none;
            }
        }

    </style>

</head>

<body style='margin:0px; padding:0px; -webkit-text-size-adjust:none;'>

    <table width='100%' cellpadding='0' cellspacing='0' border='0' style='background-color:rgb(42, 55, 78)'>
        <tbody>
            <tr>
                <td align='center' bgcolor='#e06128'>
                    <table cellpadding='0' cellspacing='0' border='0'>
                        <tbody>
                            <tr>
                                <td class='w640' width='640' height='10'></td>
                            </tr>

                            <tr>
                                <td align='center' class='w640' width='640' height='20'>
                                </td>
                            </tr>
                            <tr>
                                <td class='w640' width='640' height='10'></td>
                            </tr>


                            <tr class='pagetoplogo'>
                                <td class='w640' width='640'>
                                    <table class='w640' width='640' cellpadding='0' cellspacing='0' border='0' bgcolor='#F2F0F0'>
                                        <tbody>
                                            <tr>
                                                <td class='w30' width='30'></td>
                                                <td class='w580' width='580' valign='middle' align='center'>
                                                    <div class='pagetoplogo-content'>
                                                        <img class='w580' style='text-decoration: none; display: block; color:#476688; font-size:30px;  margin-top : 25px ; margin-bottom : 25px;' src='https://chezmessoeurs.fr/wp-content/uploads/2020/02/logo-chez-mes-soeurs-2020.png' alt='Mon Logo' width='250' ; />
                                                    </div>
                                                </td>
                                                <td class='w30' width='30'></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>


                            <tr>
                                <td class='w640' width='640' height='1' bgcolor='#d7d6d6'></td>
                            </tr>


                            <tr class='content'>
                                <td class='w640' class='w640' width='640' bgcolor='#ffffff'>
                                    <table class='w640' width='640' cellpadding='0' cellspacing='0' border='0'>
                                        <tbody>
                                            <tr>
                                                <td class='w30' width='30'></td>
                                                <td class='w580' width='580'>

                                                    
                                                    <table class='w580' width='580' cellpadding='0' cellspacing='0' border='0'>
                                                        <tbody>

                                                            <tr>
                                                                <td class='w580' width='580'>
                                                                    <h2 style='    color: #e06128;
                                                                        font-size: 30px;
                                                                         margin-top: 25px;
                                                                        padding-top: 25px;
                                                                        padding-bottom: 25px;
                                                                        text-align: center;
                                                                        /* margin: 0px 0 34px 0; */
                                                                        border-bottom: 1px solid #dedede;'>
                                                                        Voici votre estimation traiteur</h2>

                                                                    <div align='left' class='article-content' style='margin-bottom : 25px; font-weight:900;'>
                                                                        <p>Veuillez trouver ci-dessous le recaptitulatif de votre devis :</p>
                                                                    </div>

                                                        </tbody>
                                                    </table>
";

if(isset($_POST['isale']) && $_POST['isale'] != 0){
$sale ="                                               <table class='w580' width='580' cellspacing='0' cellpadding='0' border='0'>
                                                        <tbody>
                                                            <tr>
                                                                <td colspan='3'>
                                                                    <div align='left' class='article-content titresale' style='margin-bottom : 25px; margin-top : 25px; font-weight:900;'>
                                                                        <p>APÉRITIF</p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #3c3c3c;'>Nombre de convives :</p>
                                                                    </div>

                                                                </td>
                                                                <td class='w30' width='30' class='w30'></td>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128; '> ".$_POST["isale"]."</p>
                                                                    </div>

                                                                </td>


                                                            </tr>

                                                            <tr>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #3c3c3c;'>Nombre de pièces par personne :</p>
                                                                    </div>

                                                                </td>
                                                                <td class='w30' width='30' class='w30'></td>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128; '>".$_POST["psale"]."</p>
                                                                    </div>

                                                                </td>


                                                            </tr>

                                                            <tr>
                                                                <td colspan='3' class='w580' height='25' bgcolor='#fff'></td>
                                                            </tr>


                                                            <tr>
                                                                <td colspan='3' class='w580' height='1' bgcolor='#c7c5c5'></td>
                                                            </tr>

                                                        </tbody>
                                                    </table>
                                                    
                                                    
                                                    <table class='w580' width='580' cellspacing='0' cellpadding='0' border='0'>
                                                        <tbody>
                                                            <tr>
                                                                <td colspan='3'>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128;    font-weight: 900;'>Prix par personne</p>
                                                                    </div>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128;'>".number_format($_POST["sale"] / $_POST["isale"],2)." € HT</p>
                                                                    </div>
                                                                </td>
                                                                <td class='w30' width='30' class='w30'></td>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128;    font-weight: 900;'> Prix total </p>
                                                                    </div>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128;'>".number_format($_POST["sale"],2)." € HT</p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td colspan='3' class='w580' height='1' bgcolor='#c7c5c5'></td>
                                                            </tr>

                                                        </tbody>
                                                    </table>";
                                                    
}else{
    $sale = "";
}         
                                        
if(isset($_POST['isucre']) && $_POST['isucre'] != 0){
$sucre = "                                          <table class='w580' width='580' cellspacing='0' cellpadding='0' border='0'>
                                                        <tbody>
                                                            <tr>
                                                                <td colspan='3'>
                                                                    <div align='left' class='article-content titresale' style='margin-bottom : 25px; margin-top : 25px; font-weight:900;'>
                                                                        <p>COCKTAIL DÉJEUNATOIRE ET DÎNATOIRE</p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #3c3c3c;'>Nombre de convives :</p>
                                                                    </div>

                                                                </td>
                                                                <td class='w30' width='30' class='w30'></td>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128; '>".$_POST["isucre"]."</p>
                                                                    </div>

                                                                </td>


                                                            </tr>

                                                            <tr>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #3c3c3c;'>Nombre de pièces par personne :</p>
                                                                    </div>

                                                                </td>
                                                                <td class='w30' width='30' class='w30'></td>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128; '>".$_POST["psucre"]."</p>
                                                                    </div>

                                                                </td>


                                                            </tr>

                                                            <tr>
                                                                <td colspan='3' class='w580' height='25' bgcolor='#fff'></td>
                                                            </tr>


                                                            <tr>
                                                                <td colspan='3' class='w580' height='1' bgcolor='#c7c5c5'></td>
                                                            </tr>

                                                        </tbody>
                                                    </table>

<table class='w580' width='580' cellspacing='0' cellpadding='0' border='0'>
                                                        <tbody>
                                                            <tr>
                                                                <td colspan='3'>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128;    font-weight: 900;'>Prix par personne</p>
                                                                    </div>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128;'>".number_format($_POST["sucre"] / $_POST["isucre"],2)." € HT</p>
                                                                    </div>
                                                                </td>
                                                                <td class='w30' width='30' class='w30'></td>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128;    font-weight: 900;'> Prix total </p>
                                                                    </div>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128;'>".number_format($_POST["sucre"],2)." € HT</p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td colspan='3' class='w580' height='1' bgcolor='#c7c5c5'></td>
                                                            </tr>

                                                        </tbody>
                                                    </table>
";
}else{
    $sucre = "";
}    
if(isset($_POST['pbox']) && $_POST['pbox'] != 0){
$box = "                                        <table class='w580' width='580' cellspacing='0' cellpadding='0' border='0'>
                                                        <tbody>
                                                            <tr>
                                                                <td colspan='3'>
                                                                    <div align='left' class='article-content titresale' style='margin-bottom : 25px; margin-top : 25px; font-weight:900;'>
                                                                        <p>BOX DÉJEUNER</p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #3c3c3c;'>Nombre de convives :</p>
                                                                    </div>

                                                                </td>
                                                                <td class='w30' width='30' class='w30'></td>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128; '>".$_POST["pbox"]."</p>
                                                                    </div>

                                                                </td>


                                                            </tr>

                                                           

                                                            <tr>
                                                                <td colspan='3' class='w580' height='25' bgcolor='#fff'></td>
                                                            </tr>


                                                            <tr>
                                                                <td colspan='3' class='w580' height='1' bgcolor='#c7c5c5'></td>
                                                            </tr>

                                                        </tbody>
                                                    </table>


                                                    <table class='w580' width='580' cellspacing='0' cellpadding='0' border='0'>
                                                        <tbody>
                                                            <tr>
                                                                <td colspan='3'>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128;    font-weight: 900;'>Prix par personne</p>
                                                                    </div>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128;'>".number_format($_POST["box"] / $_POST["pbox"],2)." € HT</p>
                                                                    </div>
                                                                </td>
                                                                <td class='w30' width='30' class='w30'></td>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128;    font-weight: 900;'> Prix total </p>
                                                                    </div>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128;'>".number_format($_POST["box"],2)." € HT</p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td colspan='3' class='w580' height='1' bgcolor='#c7c5c5'></td>
                                                            </tr>

                                                        </tbody>
                                                    </table>
";  }                                                  
else{
 $box = "";
}  

if(isset($_POST['pbrunch']) && $_POST['pbrunch'] != 0){
$brunch = "                                         <table class='w580' width='580' cellspacing='0' cellpadding='0' border='0'>
                                                        <tbody>
                                                            <tr>
                                                                <td colspan='3'>
                                                                    <div align='left' class='article-content titresale' style='margin-bottom : 25px; margin-top : 25px; font-weight:900;'>
                                                                        <p>BRUNCH PRIVÉ</p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #3c3c3c;'>Nombre de convives :</p>
                                                                    </div>

                                                                </td>
                                                                <td class='w30' width='30' class='w30'></td>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128; '>".$_POST["pbrunch"]."</p>
                                                                    </div>

                                                                </td>


                                                            </tr>

                                                           <tr>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #3c3c3c;'>Formule salée :</p>
                                                                    </div>

                                                                </td>
                                                                <td class='w30' width='30' class='w30'></td>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128; '>".$_POST["fbrunchsale"]."</p>
                                                                    </div>

                                                                </td>


                                                            </tr>
                                                            
                                                            <tr> 
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #3c3c3c;'>Formule sucrée :</p>
                                                                    </div>

                                                                </td>
                                                                <td class='w30' width='30' class='w30'></td>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128; '>".$_POST["fbrunchsucree"]."</p>
                                                                    </div>

                                                                </td>


                                                            </tr>
                                                           

                                                            <tr>
                                                                <td colspan='3' class='w580' height='25' bgcolor='#fff'></td>
                                                            </tr>


                                                            <tr>
                                                                <td colspan='3' class='w580' height='1' bgcolor='#c7c5c5'></td>
                                                            </tr>

                                                        </tbody>
                                                    </table>

                                                    <table class='w580' width='580' cellspacing='0' cellpadding='0' border='0'>
                                                        <tbody>
                                                            <tr>
                                                                <td colspan='3'>

                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128;    font-weight: 900;'>Prix par personne</p>
                                                                    </div>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128;'>".number_format($_POST["ppbrunch"],2)." € HT</p>
                                                                    </div>
                                                                </td>
                                                                <td class='w30' width='30' class='w30'></td>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128;    font-weight: 900;'> Prix total </p>
                                                                    </div>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128;'>".number_format($_POST["brunch"],2)." € HT</p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td colspan='3' class='w580' height='1' bgcolor='#c7c5c5'></td>
                                                            </tr>

                                                        </tbody>
                                                    </table>
";
}else{
    $brunch = "";
}
$end ="                                               <table class='w580' width='580' cellspacing='0' cellpadding='0' border='0' style='margin-top : 100px;'>
                                                        <tbody>
                                                            <tr>
                                                                <td colspan='3'>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128;    font-weight: 900;'>Prix total HT</p>
                                                                    </div>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128;'>".$total." € HT</p>
                                                                    </div>
                                                                </td>
                                                                <td class='w30' width='30' class='w30'></td>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128;    font-weight: 900;'> Prix total TTC</p>
                                                                    </div>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #e06128;'>".$totalttc." € TTC</p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td colspan='3' class='w580' height='1' bgcolor='#c7c5c5'></td>
                                                            </tr>

                                                        </tbody>
                                                    </table>

                                                    <table class='w580' width='580' cellpadding='0' cellspacing='0' border='0'>
                                                        <tbody>

                                                            <tr>
                                                                <td class='w580' width='580'>
                                                                    <h2 style='    color: #3c3c3c;
    font-size: 30px;
    margin-top: 25px;
    padding-top: 25px;
    padding-bottom: 25px;
    text-align: center;
    /* margin: 0px 0 34px 0; */
    border-bottom: 1px solid #dedede;'>
                                                                        Vos coordonnées </h2>

                                                                    <div align='left' class='article-content' style='margin-bottom : 25px; font-weight:900;'>
                                                                        <p>Nous vous contacterons avec ces informations concernant votre devis.</p>
                                                                    </div>

                                                        </tbody>
                                                    </table>




                                                    <table class='w580' width='580' cellspacing='0' cellpadding='0' border='0'>
                                                        <tbody>

                                                            <tr>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #3c3c3c;'>Nom Prénom:</p>
                                                                    </div>

                                                                </td>
                                                                <td class='w30' width='30' class='w30'></td>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #3c3c3c; '>".$_POST["nom"]." ".$_POST["prenom"]."</p>
                                                                    </div>

                                                                </td>


                                                            </tr>

                                                            <tr>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #3c3c3c;'>Email :</p>
                                                                    </div>

                                                                </td>
                                                                <td class='w30' width='30' class='w30'></td>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #3c3c3c; '>".$_POST["mail"]."</p>
                                                                    </div>

                                                                </td>


                                                            </tr>

                                                            <tr>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #3c3c3c; '>Téléphone</p>
                                                                    </div>

                                                                </td>
                                                                <td class='w30' width='30' class='w30'></td>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #3c3c3c;'>".$_POST["tel"]."</p>
                                                                    </div>

                                                                </td>


                                                            </tr>
                                                            
                                                            
                                                            
                                                             <tr>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #3c3c3c; '>Date de l'événement</p>
                                                                    </div>

                                                                </td>
                                                                <td class='w30' width='30' class='w30'></td>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #3c3c3c;'>".date('d/m/Y', strtotime($_POST["date_event"]))."</p>
                                                                    </div>

                                                                </td>


                                                            </tr>
                                                            
                                                            
                                                                   <tr>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #3c3c3c; '>Commentaire</p>
                                                                    </div>

                                                                </td>
                                                                <td class='w30' width='30' class='w30'></td>
                                                                <td class='w275' width='275' valign='top'>
                                                                    <div align='left' class='article-content'>
                                                                        <p style='color : #3c3c3c;'>".$_POST["comm"]."</p>
                                                                    </div>

                                                                </td>


                                                            </tr>

                                                            <tr>
                                                                <td colspan='3' class='w580' height='25' bgcolor='#fff'></td>
                                                            </tr>


                                                            <tr>
                                                                <td colspan='3' class='w580' height='1' bgcolor='#c7c5c5'></td>
                                                            </tr>

                                                        </tbody>
                                                    </table>
                                                    </td>
                                                    <td class='w30' class='w30' width='30'></td>
                                                    </tr>
                                        </tbody>
                                    </table>
                                    </td>
                                    </tr>

                                    <tr>
                                        <td class='w640' width='640' height='0' bgcolor='#ffffff'></td>
                                    </tr>

                                    <tr class='pagebottom'>
                                        <td class='w640' width='640'>



                                            <table class='w640' width='640' cellpadding='0' cellspacing='0' border='0' bgcolor='#fff'>
                                                <tbody>
                                                    <tr>
                                                        <td colspan='5' height='10'></td>
                                                    </tr>
                                                    <tr>
                                                        <td class='w30' width='30'></td>
                                                        <td class='w580' width='580' valign='top'>

                                                            <p align='center' class='pagebottom-content-left'>
                                                                <a style='color:#3c3c3c;' href='www.chezmessoeurs.fr'><span style='color:#255D5C;'>Chez mes soeurs</span></a>
                                                            </p>

                                                            <p align='center' class='pagebottom-content-left'>
                                                                18 Avenue de la Concorde, 21000 Dijon - 06 61 91 80 12
                                                            </p>
                                                            <p align='center' class='pagebottom-content-left'>

                                                            </p>
                                                            <p align='center' class='pagebottom-content-left'>
                                                                Ouvert du lundi au jeudi de 8h à 18h et le vendredi de 8h à 17h.
                                                            </p>
                                                        </td>

                                                        <td class='w30' width='30'></td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan='5' height='10'></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class='w640' width='640' height='60'></td>
                                    </tr>
                        </tbody>
                    </table>
                    </td>
                    </tr>
        </tbody>
    </table>
</body>

</html>
";

$boundary = "-----=".md5(rand());
//==========

//=====Définition du sujet.
$sujet = "Devis traiteur Chez mes soeurs";

$header = "From: \"Chez mes soeurs\"<traiteur@chezmessoeurs.fr>".$passage_ligne;
	$header.= "Reply-to: \"Chez mes soeurs\" <traiteur@chezmessoeurs.fr>".$passage_ligne;
	$header.= "MIME-Version: 1.0".$passage_ligne;
	$header.= "Content-Type: multipart/alternative;".$passage_ligne." boundary=\"$boundary\"".$passage_ligne;
//==========

//=====Création du message.
	$message = $passage_ligne."--".$boundary.$passage_ligne;
//=====Ajout du message au format texte.
	$message.= "Content-Type: text/plain; charset=\"UTF-8\"".$passage_ligne;
	$message.= "Content-Transfer-Encoding: 8bit".$passage_ligne;
	$message.= $passage_ligne.$message_txt.$passage_ligne;
//==========
	$message.= $passage_ligne."--".$boundary.$passage_ligne;
//=====Ajout du message au format HTML
	$message.= "Content-Type: text/html; charset=\"UTF-8\"".$passage_ligne;
	$message.= "Content-Transfer-Encoding: 8bit".$passage_ligne;
	$message.= $passage_ligne.$message_html.$sale.$sucre.$box.$brunch.$end.$passage_ligne;
//==========
	$message.= $passage_ligne."--".$boundary."--".$passage_ligne;
	$message.= $passage_ligne."--".$boundary."--".$passage_ligne;
//==========

//=====Envoi de l'e-mail.
    //$test = mail($mail,$sujet,$message,$header);

    $sujet = "Devis traiteur Chez mes soeurs";

    $mail = 'traiteur@chezmessoeurs.fr';

$header = "From: \"Chez mes soeurs\"<$mail>".$passage_ligne;
	$header.= "Reply-to: \"Chez mes soeurs\" <$mail>".$passage_ligne;
	$header.= "MIME-Version: 1.0".$passage_ligne;
	$header.= "Content-Type: multipart/alternative;".$passage_ligne." boundary=\"$boundary\"".$passage_ligne;
//==========

//=====Création du message.
	$message = $passage_ligne."--".$boundary.$passage_ligne;
//=====Ajout du message au format texte.
	$message.= "Content-Type: text/plain; charset=\"UTF-8\"".$passage_ligne;
	$message.= "Content-Transfer-Encoding: 8bit".$passage_ligne;
	$message.= $passage_ligne.$message_txt.$passage_ligne;
//==========
	$message.= $passage_ligne."--".$boundary.$passage_ligne;
//=====Ajout du message au format HTML
	$message.= "Content-Type: text/html; charset=\"UTF-8\"".$passage_ligne;
	$message.= "Content-Transfer-Encoding: 8bit".$passage_ligne;
	$message.= $passage_ligne.$message_html.$sale.$sucre.$box.$brunch.$end.$passage_ligne;
//==========
	$message.= $passage_ligne."--".$boundary."--".$passage_ligne;
	$message.= $passage_ligne."--".$boundary."--".$passage_ligne;
//==========

//=====Envoi de l'e-mail.
$mail2 = "wendy@qualicom-conseil.fr";
$mail3 = "johan@qualicom-conseil.fr";

 //    $test = mail($mail,$sujet,$message,$header);
	// $test = mail($mail2,$sujet,$message,$header);
    // $test = mail($mail3,$sujet,$message,$header);
    // var_dump($test);