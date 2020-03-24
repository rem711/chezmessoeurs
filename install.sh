#!/bin/bash

echo -e "INSTALLEUR DE L\'APPLICATION DE CHEZMESSOEURS \n"
echo Lancer WampServer et accéder à http://localhost/phpmyadmin/
echo "Utilisateur : root / Mot de passe : '' (vide)"
echo "Créer la base de données du nom : 'chezmessoeurs_bdd_dev'"
echo "Appuyer sur Entrer une fois que c'est fait"
read
echo -e "Vérification d'être sur la branche de développement \n"
git checkout dev
echo -e "- Installation des dépendances de l'application : \n"
npm install
cd src/
echo -e "- Migration de la BDD : \n"
npx sequelize-cli db:migrate
echo -e "- Remplissage de la BDD : \n"
npx sequelize-cli db:seed:all
cd ..
dossier=`pwd`
echo "**********************************************************************************************"
echo "Pour lancer l'application utiliser la commande 'npm run dev' depuis la racine de l'application"
echo "Càd : $dossier"
echo "**********************************************************************************************"
read