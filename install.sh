#!/bin/bash

echo -e "INSTALLEUR DE L\'APPLICATION DE CHEZMESSOEURS \n"
echo "Démarrer le gestionnaire de Base de Données"
read
read -p "Nom de la branche à utiliser : " branch
if [ "$branch" = "" ]
then
    branch=dev
fi

read -p "Type d'environnement (dev / test / production) : " env
if [ "$env" = "" ]
then
    env=development
fi

echo -e "Vérification de la branche \n"
git checkout $branch
echo -e "- Installation des dépendances de l'application : \n"
npm install
cd src/
echo -e "- Création de la BDD : \n"
npx sequelize-cli db:create --env $env
echo -e "- Migration de la BDD : \n"
npx sequelize-cli db:migrate --env $env
echo -e "- Remplissage de la BDD : \n"
npx sequelize-cli db:seed:all --env $env
cd ..
read