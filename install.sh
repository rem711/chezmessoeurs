#!/bin/bash

fullInstall () {
    read -p "Nom de la branche à utiliser : " branch
    if [ -z "$branch" ]
    then
        branch=dev
    fi
    sh ./install/fullIntall.sh "$1" "$branch"
}

deployDB () {
    sh ./install/init-database.sh "$1"
}

echo -e "\nINSTALLEUR DE L'APPLICATION DE CHEZMESSOEURS \n"
echo "******************************************************************"
echo "Penser à démarrer le gestionnaire de Base de Données dès à présent"
echo "******************************************************************"
echo -e "\n"
echo -e "Quelle action à réaliser:\n"
echo -e "  1) Installation complète\n"
echo -e "  2) Déploiement/redéploiement de la BDD\n"
echo -e "  3) Déploiement de la BDD + tests\n"
while [ -z $action ]
do
    read -p "Choix : " action
    case $action in
        1 | 2 | 3)
            break
            ;;
        *)
            action=''
            ;;
    esac
done
echo -e "\n"
while [ -z $env ]
do
    read -p "Type d'environnement (dev / test / prod) : " env
    case $env in
        "dev" | "test" | "prod")
            break
            ;;
        *)
            env=''
    esac
done
if [ "$env" = "dev" ]
then
    env=development
fi
if [ "$env" = "prod" ]
then
    env=production
fi
case $action in
    1)
        fullInstall $env
        ;;
    2)
        deployDB $env
        ;;
    3)
        deployDB $env
        npm run test-collectCoverage
        ;;
    *)
        ;;
esac
read