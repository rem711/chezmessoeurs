-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le :  mer. 04 mars 2020 à 09:12
-- Version du serveur :  5.7.24
-- Version de PHP :  7.2.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `chezmessoeurs_bdd_dev`
--

-- --------------------------------------------------------

--
-- Structure de la table `clients`
--

CREATE TABLE `clients` (
  `Id_Client` int(11) NOT NULL,
  `Nom_Prenom` varchar(350) COLLATE utf8_bin NOT NULL,
  `Adresse_Facturation` varchar(1000) COLLATE utf8_bin NOT NULL,
  `Email` varchar(320) COLLATE utf8_bin NOT NULL,
  `Telephone` varchar(10) COLLATE utf8_bin NOT NULL,
  `Type` varchar(13) COLLATE utf8_bin NOT NULL COMMENT 'Professionnel / Particulier',
  `Nombre_Prestations` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'Incrémente à chaque nouvelle prestation',
  `Dernier_Statut` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT 'Devis en cours - Validé - Envoyé / Factures envoyée - payée - archivée',
  `Paiement_En_Retard` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'màj à chaque paiement si en retard'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Déchargement des données de la table `clients`
--

INSERT INTO `clients` (`Id_Client`, `Nom_Prenom`, `Adresse_Facturation`, `Email`, `Telephone`, `Type`, `Nombre_Prestations`, `Dernier_Statut`, `Paiement_En_Retard`) VALUES
(1, 'client1', 'adresse client1', 'client1@mail.com', '0000000001', 'Particulier', 0, NULL, 0),
(2, 'client2', 'adresse client2', 'client2@mail.com', '0000000002', 'Particulier', 0, NULL, 0),
(3, 'client3', 'adresse client3', 'client3@mail.com', '0000000003', 'Professionnel', 0, NULL, 0);

-- --------------------------------------------------------

--
-- Structure de la table `devis`
--

CREATE TABLE `devis` (
  `Id_Devis` int(11) NOT NULL,
  `Date_Creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Id_Client` int(11) NOT NULL,
  `Date_Evenement` timestamp NOT NULL,
  `Adresse_Livraison` varchar(1000) COLLATE utf8_bin NOT NULL,
  `Id_Estimation` int(11) NOT NULL,
  `Id_Formule_Aperitif` int(11) DEFAULT NULL,
  `Id_Formule_Cocktail` int(11) DEFAULT NULL,
  `Id_Formule_Box` int(11) DEFAULT NULL,
  `Id_Formule_Brunch` int(11) DEFAULT NULL,
  `Commentaire` varchar(1000) COLLATE utf8_bin DEFAULT NULL,
  `Statut` varchar(10) COLLATE utf8_bin NOT NULL COMMENT 'En cours / Envoyé / Validé / Archivé',
  `Liste_Options` varchar(1000) COLLATE utf8_bin DEFAULT NULL COMMENT 'Liste de (Prix_Unitaire.Id_Prix_Unitaire) où IsOption = true, séparés par un ";"',
  `Id_Remise` int(11) DEFAULT NULL,
  `Prix_HT` float NOT NULL DEFAULT '0',
  `Prix_TTC` float NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Déchargement des données de la table `devis`
--

INSERT INTO `devis` (`Id_Devis`, `Date_Creation`, `Id_Client`, `Date_Evenement`, `Adresse_Livraison`, `Id_Estimation`, `Id_Formule_Aperitif`, `Id_Formule_Cocktail`, `Id_Formule_Box`, `Id_Formule_Brunch`, `Commentaire`, `Statut`, `Liste_Options`, `Id_Remise`, `Prix_HT`, `Prix_TTC`) VALUES
(1, '2020-03-04 09:00:37', 1, '2020-03-20 11:00:00', 'Autre adresse que client1', 1, 1, NULL, NULL, NULL, NULL, 'En cours', '9;', NULL, 78.4, 86.24);

-- --------------------------------------------------------

--
-- Structure de la table `estimations`
--

CREATE TABLE `estimations` (
  `Id_Estimation` int(11) NOT NULL,
  `Date_Creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Id_Client` int(11) NOT NULL,
  `Date_Evenement` timestamp NOT NULL,
  `Id_Formule_Aperitif` int(11) DEFAULT NULL,
  `Id_Formule_Cocktail` int(11) DEFAULT NULL,
  `Id_Formule_Box` int(11) DEFAULT NULL,
  `Id_Formule_Brunch` int(11) DEFAULT NULL,
  `Commentaire` varchar(1000) COLLATE utf8_bin DEFAULT NULL,
  `Statut` varchar(10) COLLATE utf8_bin DEFAULT NULL COMMENT 'null ou Archivé'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Déchargement des données de la table `estimations`
--

INSERT INTO `estimations` (`Id_Estimation`, `Date_Creation`, `Id_Client`, `Date_Evenement`, `Id_Formule_Aperitif`, `Id_Formule_Cocktail`, `Id_Formule_Box`, `Id_Formule_Brunch`, `Commentaire`, `Statut`) VALUES
(1, '2020-03-04 08:56:49', 1, '2020-03-20 11:00:00', 1, NULL, NULL, NULL, NULL, 'Archivé');

-- --------------------------------------------------------

--
-- Structure de la table `factures`
--

CREATE TABLE `factures` (
  `Id_Facture` int(11) NOT NULL,
  `Numero_Facture` varchar(100) COLLATE utf8_bin NOT NULL COMMENT 'FA_{timestamp}_ID_Facture / FA_20190604_063',
  `Date_Creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Id_Client` int(11) NOT NULL,
  `Date_Evenement` timestamp NOT NULL,
  `Adresse_Livraison` varchar(1000) COLLATE utf8_bin DEFAULT NULL,
  `Id_Devis` int(11) NOT NULL,
  `Id_Formule_Aperitif` int(11) DEFAULT NULL,
  `Id_Formule_Cocktail` int(11) DEFAULT NULL,
  `Id_Formule_Box` int(11) DEFAULT NULL,
  `Id_Formule_Brunch` int(11) DEFAULT NULL,
  `Commentaire` varchar(1000) COLLATE utf8_bin DEFAULT NULL,
  `Statut` varchar(30) COLLATE utf8_bin NOT NULL DEFAULT 'En attente de paiement' COMMENT 'Payée / En attente de paiement / Archivée',
  `Liste_Options` varchar(1000) COLLATE utf8_bin DEFAULT NULL COMMENT 'Liste de (Prix_Unitaire.Id_Prix_Unitaire) où IsOption = true, séparés par un ";"	',
  `Id_Remise` int(11) DEFAULT NULL,
  `Prix_HT` float NOT NULL DEFAULT '0',
  `Prix_TTC` float NOT NULL DEFAULT '0',
  `Acompte` float NOT NULL DEFAULT '0',
  `Reste_A_Payer` float NOT NULL DEFAULT '0',
  `Paiement_En_Retard` varchar(100) COLLATE utf8_bin NOT NULL COMMENT 'j+32 / Non - (non = payée avant/le jour de l''évènement, +xj = nb de jour(s) après l''évènement',
  `Nb_Relances` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'incrément à chaque nouvelle relance',
  `Date_Derniere_Relance` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Structure de la table `formule`
--

CREATE TABLE `formule` (
  `Id_Formule` int(11) NOT NULL,
  `Id_Type_Formule` int(11) NOT NULL,
  `Nb_Convives` tinyint(4) NOT NULL DEFAULT '0',
  `Prix_HT` float NOT NULL DEFAULT '0',
  `Nb_Pieces_Salees` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'Voir pour brunch nb pièces pour petit (8) et grand (13) / Box = (entrée + plat) soit 2 salés',
  `Nb_Pieces_Sucrees` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'Voir pour brunch nb pièces pour petit (5) et grand (8) / Box = (dessert) soit 1 sucré',
  `Nb_Boissons` tinyint(4) NOT NULL DEFAULT '0',
  `Liste_Id_Recettes_Salees` varchar(1000) COLLATE utf8_bin DEFAULT NULL COMMENT 'Liste de (Recette.Id_Recette) séparés par un ";"',
  `Liste_Id_Recettes_Sucrees` varchar(1000) COLLATE utf8_bin DEFAULT NULL COMMENT 'Liste de (Recette.Id_Recette) séparés par un ";"',
  `Liste_Id_Recettes_Boissons` varchar(1000) COLLATE utf8_bin DEFAULT NULL COMMENT 'Liste de (Recette.Id_Recette) séparés par un ";"'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Déchargement des données de la table `formule`
--

INSERT INTO `formule` (`Id_Formule`, `Id_Type_Formule`, `Nb_Convives`, `Prix_HT`, `Nb_Pieces_Salees`, `Nb_Pieces_Sucrees`, `Nb_Boissons`, `Liste_Id_Recettes_Salees`, `Liste_Id_Recettes_Sucrees`, `Liste_Id_Recettes_Boissons`) VALUES
(1, 1, 6, 38.4, 4, 0, 0, '1;1;2;3', NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `prix_unitaire`
--

CREATE TABLE `prix_unitaire` (
  `Id_Prix_Unitaire` int(11) NOT NULL,
  `Nom_Type_Prestation` varchar(100) COLLATE utf8_bin NOT NULL,
  `IsOption` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'true(0) = (service sur place, livraison etc.)',
  `Montant` float NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Déchargement des données de la table `prix_unitaire`
--

INSERT INTO `prix_unitaire` (`Id_Prix_Unitaire`, `Nom_Type_Prestation`, `IsOption`, `Montant`) VALUES
(1, 'Pièce Salée', 0, 1.6),
(2, 'Pièce sucrée', 0, 1.45),
(3, 'Petit brunch salé', 0, 12.68),
(4, 'Grand brunch salé', 0, 20.86),
(5, 'Petit brunch sucré', 0, 6.96),
(6, 'Grand brunch sucré', 0, 11.36),
(7, 'Box', 0, 15),
(8, 'Service sur-place', 1, 120),
(9, 'Livraison sur-place', 1, 40),
(10, 'Décoration florale', 1, 70);

-- --------------------------------------------------------

--
-- Structure de la table `recettes`
--

CREATE TABLE `recettes` (
  `Id_Recette` int(11) NOT NULL,
  `Categorie` varchar(10) COLLATE utf8_bin NOT NULL COMMENT 'Salée / Sucrée / Boisson',
  `Nom` varchar(256) COLLATE utf8_bin NOT NULL,
  `Description` varchar(1000) COLLATE utf8_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Déchargement des données de la table `recettes`
--

INSERT INTO `recettes` (`Id_Recette`, `Categorie`, `Nom`, `Description`) VALUES
(1, 'Salée', 'Gougère à l’Époisse', NULL),
(2, 'Salée', 'Cannelé au chorizo', NULL),
(3, 'Salée', 'Bun au sésame noir avec sa garniture du moment', NULL),
(4, 'Salée', 'Verrine de tartare de légumes et sa brochette d’edamame', NULL),
(5, 'Sucrée', 'Petit cake au citron', NULL),
(6, 'Sucrée', 'Petit carrot cake', NULL),
(7, 'Sucrée', 'Brochette de fruits frais', NULL),
(8, 'Sucrée', 'Verrine de saison', NULL),
(9, 'Boisson', 'Coca-Cola', NULL),
(10, 'Boisson', 'Jus d\'orange', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `remises`
--

CREATE TABLE `remises` (
  `Id_Remise` int(11) NOT NULL,
  `Nom` varchar(1000) COLLATE utf8_bin NOT NULL,
  `IsPourcent` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'false = valeur à ajouter / true = pourcentage sur total HT',
  `Valeur` float NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Structure de la table `type_formule`
--

CREATE TABLE `type_formule` (
  `Id_Type_Formule` int(11) NOT NULL,
  `Nom` varchar(100) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Déchargement des données de la table `type_formule`
--

INSERT INTO `type_formule` (`Id_Type_Formule`, `Nom`) VALUES
(1, 'Apéritif'),
(2, 'Cocktail'),
(3, 'Box'),
(4, 'Brunch');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`Id_Client`);

--
-- Index pour la table `devis`
--
ALTER TABLE `devis`
  ADD PRIMARY KEY (`Id_Devis`),
  ADD KEY `FK_Client_Devis` (`Id_Client`),
  ADD KEY `FK_Estimation_Devis` (`Id_Estimation`),
  ADD KEY `FK_Formule_Aperitif_Devis` (`Id_Formule_Aperitif`),
  ADD KEY `FK_Formule_Cocktail_Devis` (`Id_Formule_Cocktail`),
  ADD KEY `FK_Formule_Box_Devis` (`Id_Formule_Box`),
  ADD KEY `FK_Formule_Brunch_Devis` (`Id_Formule_Brunch`),
  ADD KEY `FK_Remise_Devis` (`Id_Remise`);

--
-- Index pour la table `estimations`
--
ALTER TABLE `estimations`
  ADD PRIMARY KEY (`Id_Estimation`),
  ADD KEY `FK_Client_Estimations` (`Id_Client`) USING BTREE,
  ADD KEY `FK_Formule_Aperitif_Estimations` (`Id_Formule_Aperitif`) USING BTREE,
  ADD KEY `FK_Formule_Cocktail_Estimations` (`Id_Formule_Cocktail`) USING BTREE,
  ADD KEY `FK_Formule_Box_Estimations` (`Id_Formule_Box`) USING BTREE,
  ADD KEY `FK_Formule_Brunch_Estimations` (`Id_Formule_Brunch`) USING BTREE;

--
-- Index pour la table `factures`
--
ALTER TABLE `factures`
  ADD PRIMARY KEY (`Id_Facture`),
  ADD KEY `FK_Client_Factures` (`Id_Client`),
  ADD KEY `FK_Devis_Factures` (`Id_Devis`),
  ADD KEY `FK_Formule_Aperitif_Factures` (`Id_Formule_Aperitif`),
  ADD KEY `FK_Formule_Cocktail_Factures` (`Id_Formule_Cocktail`),
  ADD KEY `FK_Formule_Box_Factures` (`Id_Formule_Box`),
  ADD KEY `FK_Formule_Brunch_Factures` (`Id_Formule_Brunch`),
  ADD KEY `FK_Remise_Factures` (`Id_Remise`);

--
-- Index pour la table `formule`
--
ALTER TABLE `formule`
  ADD PRIMARY KEY (`Id_Formule`),
  ADD KEY `FK_Type_formule_Formule` (`Id_Type_Formule`) USING BTREE;

--
-- Index pour la table `prix_unitaire`
--
ALTER TABLE `prix_unitaire`
  ADD PRIMARY KEY (`Id_Prix_Unitaire`);

--
-- Index pour la table `recettes`
--
ALTER TABLE `recettes`
  ADD PRIMARY KEY (`Id_Recette`);

--
-- Index pour la table `remises`
--
ALTER TABLE `remises`
  ADD PRIMARY KEY (`Id_Remise`);

--
-- Index pour la table `type_formule`
--
ALTER TABLE `type_formule`
  ADD PRIMARY KEY (`Id_Type_Formule`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `clients`
--
ALTER TABLE `clients`
  MODIFY `Id_Client` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `devis`
--
ALTER TABLE `devis`
  MODIFY `Id_Devis` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `estimations`
--
ALTER TABLE `estimations`
  MODIFY `Id_Estimation` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `factures`
--
ALTER TABLE `factures`
  MODIFY `Id_Facture` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `formule`
--
ALTER TABLE `formule`
  MODIFY `Id_Formule` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `prix_unitaire`
--
ALTER TABLE `prix_unitaire`
  MODIFY `Id_Prix_Unitaire` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `recettes`
--
ALTER TABLE `recettes`
  MODIFY `Id_Recette` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `remises`
--
ALTER TABLE `remises`
  MODIFY `Id_Remise` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `type_formule`
--
ALTER TABLE `type_formule`
  MODIFY `Id_Type_Formule` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `devis`
--
ALTER TABLE `devis`
  ADD CONSTRAINT `FK_Client_Devis` FOREIGN KEY (`Id_Client`) REFERENCES `clients` (`Id_Client`),
  ADD CONSTRAINT `FK_Estimation_Devis` FOREIGN KEY (`Id_Estimation`) REFERENCES `estimations` (`Id_Estimation`),
  ADD CONSTRAINT `FK_Formule_Aperitif_Devis` FOREIGN KEY (`Id_Formule_Aperitif`) REFERENCES `formule` (`Id_Formule`),
  ADD CONSTRAINT `FK_Formule_Box_Devis` FOREIGN KEY (`Id_Formule_Box`) REFERENCES `formule` (`Id_Formule`),
  ADD CONSTRAINT `FK_Formule_Brunch_Devis` FOREIGN KEY (`Id_Formule_Brunch`) REFERENCES `formule` (`Id_Formule`),
  ADD CONSTRAINT `FK_Formule_Cocktail_Devis` FOREIGN KEY (`Id_Formule_Cocktail`) REFERENCES `formule` (`Id_Formule`),
  ADD CONSTRAINT `FK_Remise_Devis` FOREIGN KEY (`Id_Remise`) REFERENCES `remises` (`Id_Remise`);

--
-- Contraintes pour la table `estimations`
--
ALTER TABLE `estimations`
  ADD CONSTRAINT `FK_Client` FOREIGN KEY (`Id_Client`) REFERENCES `clients` (`Id_Client`),
  ADD CONSTRAINT `FK_Formule_Aperitif` FOREIGN KEY (`Id_Formule_Aperitif`) REFERENCES `formule` (`Id_Formule`),
  ADD CONSTRAINT `FK_Formule_Box` FOREIGN KEY (`Id_Formule_Box`) REFERENCES `formule` (`Id_Formule`),
  ADD CONSTRAINT `FK_Formule_Brunch` FOREIGN KEY (`Id_Formule_Brunch`) REFERENCES `formule` (`Id_Formule`),
  ADD CONSTRAINT `FK_Formule_Cocktail` FOREIGN KEY (`Id_Formule_Cocktail`) REFERENCES `formule` (`Id_Formule`);

--
-- Contraintes pour la table `factures`
--
ALTER TABLE `factures`
  ADD CONSTRAINT `FK_Client_Factures` FOREIGN KEY (`Id_Client`) REFERENCES `clients` (`Id_Client`),
  ADD CONSTRAINT `FK_Devis_Factures` FOREIGN KEY (`Id_Devis`) REFERENCES `devis` (`Id_Devis`),
  ADD CONSTRAINT `FK_Formule_Aperitif_Factures` FOREIGN KEY (`Id_Formule_Aperitif`) REFERENCES `formule` (`Id_Formule`),
  ADD CONSTRAINT `FK_Formule_Box_Factures` FOREIGN KEY (`Id_Formule_Box`) REFERENCES `formule` (`Id_Formule`),
  ADD CONSTRAINT `FK_Formule_Brunch_Factures` FOREIGN KEY (`Id_Formule_Brunch`) REFERENCES `formule` (`Id_Formule`),
  ADD CONSTRAINT `FK_Formule_Cocktail_Factures` FOREIGN KEY (`Id_Formule_Cocktail`) REFERENCES `formule` (`Id_Formule`),
  ADD CONSTRAINT `FK_Remise_Factures` FOREIGN KEY (`Id_Remise`) REFERENCES `remises` (`Id_Remise`);

--
-- Contraintes pour la table `formule`
--
ALTER TABLE `formule`
  ADD CONSTRAINT `FK_Type_formule` FOREIGN KEY (`Id_Type_Formule`) REFERENCES `type_formule` (`Id_Type_Formule`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
