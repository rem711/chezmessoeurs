#!/bin/bash

if [ $# < 2]
then
    echo "Pas assez de paramètres"
    exit 1
fi
case $1 in 
    "development" | "test" | "production")
        ;;
    *)
    echo "Environnement inconnu"
    exit 1
    ;;
esac
env="$1"
if [ -z "$2" ]
then 
    echo "La branche ne peut être vide"
    exit 1
fi
branch="$2"
echo -e "Vérification de la branche \n"
git checkout $branch
echo -e "- Installation des dépendances de l'application : \n"
if [ $env != "production" ]
then
    npm install
else
    npm install --production
fi
sh ./install/init-database.sh "$env"
echo -e "Environnement de $env prêt \n"