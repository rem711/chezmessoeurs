#!/bin/bash

if [ $# -eq 0 ]
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
cd src/
envString="--env $env"
echo -e "Déploiement de la base de données... \n"
npx sequelize-cli db:drop $envString
echo -e "- Création de la BDD : \n"
npx sequelize-cli db:create $envString
echo -e "- Migration de la BDD : \n"
npx sequelize-cli db:migrate $envString
echo -e "- Remplissage de la BDD : \n"
if [ $env != "production" ]
then
    npx sequelize-cli db:seed:all $envString
else
    npx sequelize-cli db:seed --seed 001-seed-type_formule.js 003-seed-recettes.js 004-seed-prix_unitaire.js 012-seed-compteurs.js $envString
fi
echo -e "Déploiement terminé. \n"
cd ..