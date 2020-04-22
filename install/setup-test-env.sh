cd src/
env="--env test"
npx sequelize-cli db:drop $env
npx sequelize-cli db:create $env
npx sequelize-cli db:migrate $env
npx sequelize-cli db:seed:all $env
cd ..
echo "Environnement de test prêt"
read