-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Dim 08 Mars 2020 à 22:25
-- Version du serveur :  5.7.9
-- Version de PHP :  5.6.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `chezmessoeurs_bdd_test`
--

-- --------------------------------------------------------

--
-- Structure de la table `clients`
--

DROP TABLE IF EXISTS `clients`;
CREATE TABLE IF NOT EXISTS `clients` (
  `Id_Client` int(11) NOT NULL AUTO_INCREMENT,
  `Nom_Prenom` varchar(350) COLLATE utf8_bin NOT NULL,
  `Adresse_Facturation` varchar(1000) COLLATE utf8_bin NOT NULL,
  `Email` varchar(320) COLLATE utf8_bin NOT NULL,
  `Telephone` varchar(10) COLLATE utf8_bin NOT NULL,
  `Type` varchar(13) COLLATE utf8_bin NOT NULL COMMENT 'Professionnel / Particulier',
  `Nombre_Prestations` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'Incrémente à chaque nouvelle prestation',
  `Dernier_Statut` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT 'Devis en cours - Validé - Envoyé / Factures envoyée - payée - archivée',
  `Paiement_En_Retard` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'màj à chaque paiement si en retard',
  PRIMARY KEY (`Id_Client`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Structure de la table `devis`
--

DROP TABLE IF EXISTS `devis`;
CREATE TABLE IF NOT EXISTS `devis` (
  `Id_Devis` int(11) NOT NULL AUTO_INCREMENT,
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
  `Prix_TTC` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id_Devis`),
  KEY `FK_Client_Devis` (`Id_Client`),
  KEY `FK_Estimation_Devis` (`Id_Estimation`),
  KEY `FK_Formule_Aperitif_Devis` (`Id_Formule_Aperitif`),
  KEY `FK_Formule_Cocktail_Devis` (`Id_Formule_Cocktail`),
  KEY `FK_Formule_Box_Devis` (`Id_Formule_Box`),
  KEY `FK_Formule_Brunch_Devis` (`Id_Formule_Brunch`),
  KEY `FK_Remise_Devis` (`Id_Remise`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Structure de la table `estimations`
--

DROP TABLE IF EXISTS `estimations`;
CREATE TABLE IF NOT EXISTS `estimations` (
  `Id_Estimation` int(11) NOT NULL AUTO_INCREMENT,
  `Date_Creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Id_Client` int(11) NOT NULL,
  `Date_Evenement` timestamp NOT NULL,
  `Id_Formule_Aperitif` int(11) DEFAULT NULL,
  `Id_Formule_Cocktail` int(11) DEFAULT NULL,
  `Id_Formule_Box` int(11) DEFAULT NULL,
  `Id_Formule_Brunch` int(11) DEFAULT NULL,
  `Commentaire` varchar(1000) COLLATE utf8_bin DEFAULT NULL,
  `Statut` varchar(10) COLLATE utf8_bin DEFAULT NULL COMMENT 'null ou Archivé',
  PRIMARY KEY (`Id_Estimation`),
  KEY `FK_Client_Estimations` (`Id_Client`) USING BTREE,
  KEY `FK_Formule_Aperitif_Estimations` (`Id_Formule_Aperitif`) USING BTREE,
  KEY `FK_Formule_Cocktail_Estimations` (`Id_Formule_Cocktail`) USING BTREE,
  KEY `FK_Formule_Box_Estimations` (`Id_Formule_Box`) USING BTREE,
  KEY `FK_Formule_Brunch_Estimations` (`Id_Formule_Brunch`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Structure de la table `factures`
--

DROP TABLE IF EXISTS `factures`;
CREATE TABLE IF NOT EXISTS `factures` (
  `Id_Facture` int(11) NOT NULL AUTO_INCREMENT,
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
  `Date_Derniere_Relance` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Id_Facture`),
  KEY `FK_Client_Factures` (`Id_Client`),
  KEY `FK_Devis_Factures` (`Id_Devis`),
  KEY `FK_Formule_Aperitif_Factures` (`Id_Formule_Aperitif`),
  KEY `FK_Formule_Cocktail_Factures` (`Id_Formule_Cocktail`),
  KEY `FK_Formule_Box_Factures` (`Id_Formule_Box`),
  KEY `FK_Formule_Brunch_Factures` (`Id_Formule_Brunch`),
  KEY `FK_Remise_Factures` (`Id_Remise`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Structure de la table `formule`
--

DROP TABLE IF EXISTS `formule`;
CREATE TABLE IF NOT EXISTS `formule` (
  `Id_Formule` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Type_Formule` int(11) NOT NULL,
  `Nb_Convives` tinyint(4) NOT NULL DEFAULT '0',
  `Prix_HT` float NOT NULL DEFAULT '0',
  `Nb_Pieces_Salees` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'Voir pour brunch nb pièces pour petit (8) et grand (13) / Box = (entrée + plat) soit 2 salés',
  `Nb_Pieces_Sucrees` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'Voir pour brunch nb pièces pour petit (5) et grand (8) / Box = (dessert) soit 1 sucré',
  `Nb_Boissons` tinyint(4) NOT NULL DEFAULT '0',
  `Liste_Id_Recettes_Salees` varchar(1000) COLLATE utf8_bin DEFAULT NULL COMMENT 'Liste de (Recette.Id_Recette) séparés par un ";"',
  `Liste_Id_Recettes_Sucrees` varchar(1000) COLLATE utf8_bin DEFAULT NULL COMMENT 'Liste de (Recette.Id_Recette) séparés par un ";"',
  `Liste_Id_Recettes_Boissons` varchar(1000) COLLATE utf8_bin DEFAULT NULL COMMENT 'Liste de (Recette.Id_Recette) séparés par un ";"',
  PRIMARY KEY (`Id_Formule`),
  KEY `FK_Type_formule_Formule` (`Id_Type_Formule`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Structure de la table `prix_unitaire`
--

DROP TABLE IF EXISTS `prix_unitaire`;
CREATE TABLE IF NOT EXISTS `prix_unitaire` (
  `Id_Prix_Unitaire` int(11) NOT NULL AUTO_INCREMENT,
  `Nom_Type_Prestation` varchar(100) COLLATE utf8_bin NOT NULL,
  `IsOption` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'true(0) = (service sur place, livraison etc.)',
  `Montant` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id_Prix_Unitaire`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Structure de la table `recettes`
--

DROP TABLE IF EXISTS `recettes`;
CREATE TABLE IF NOT EXISTS `recettes` (
  `Id_Recette` int(11) NOT NULL AUTO_INCREMENT,
  `Categorie` varchar(10) COLLATE utf8_bin NOT NULL COMMENT 'Salée / Sucrée / Boisson',
  `Nom` varchar(256) COLLATE utf8_bin NOT NULL,
  `Description` varchar(1000) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`Id_Recette`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Structure de la table `remises`
--

DROP TABLE IF EXISTS `remises`;
CREATE TABLE IF NOT EXISTS `remises` (
  `Id_Remise` int(11) NOT NULL AUTO_INCREMENT,
  `Nom` varchar(1000) COLLATE utf8_bin NOT NULL,
  `IsPourcent` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'false = valeur à ajouter / true = pourcentage sur total HT',
  `Valeur` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id_Remise`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Structure de la table `type_formule`
--

DROP TABLE IF EXISTS `type_formule`;
CREATE TABLE IF NOT EXISTS `type_formule` (
  `Id_Type_Formule` int(11) NOT NULL AUTO_INCREMENT,
  `Nom` varchar(100) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`Id_Type_Formule`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `devis`
--
ALTER TABLE `devis`
  ADD CONSTRAINT `FK_Client_Devis` FOREIGN KEY (`Id_Client`) REFERENCES `clients` (`Id_Client`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_Estimation_Devis` FOREIGN KEY (`Id_Estimation`) REFERENCES `estimations` (`Id_Estimation`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_Formule_Aperitif_Devis` FOREIGN KEY (`Id_Formule_Aperitif`) REFERENCES `formule` (`Id_Formule`),
  ADD CONSTRAINT `FK_Formule_Box_Devis` FOREIGN KEY (`Id_Formule_Box`) REFERENCES `formule` (`Id_Formule`),
  ADD CONSTRAINT `FK_Formule_Brunch_Devis` FOREIGN KEY (`Id_Formule_Brunch`) REFERENCES `formule` (`Id_Formule`),
  ADD CONSTRAINT `FK_Formule_Cocktail_Devis` FOREIGN KEY (`Id_Formule_Cocktail`) REFERENCES `formule` (`Id_Formule`),
  ADD CONSTRAINT `FK_Remise_Devis` FOREIGN KEY (`Id_Remise`) REFERENCES `remises` (`Id_Remise`);

--
-- Contraintes pour la table `estimations`
--
ALTER TABLE `estimations`
  ADD CONSTRAINT `FK_Client_Estimations` FOREIGN KEY (`Id_Client`) REFERENCES `clients` (`Id_Client`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_Formule_Aperitif` FOREIGN KEY (`Id_Formule_Aperitif`) REFERENCES `formule` (`Id_Formule`),
  ADD CONSTRAINT `FK_Formule_Box` FOREIGN KEY (`Id_Formule_Box`) REFERENCES `formule` (`Id_Formule`),
  ADD CONSTRAINT `FK_Formule_Brunch` FOREIGN KEY (`Id_Formule_Brunch`) REFERENCES `formule` (`Id_Formule`),
  ADD CONSTRAINT `FK_Formule_Cocktail` FOREIGN KEY (`Id_Formule_Cocktail`) REFERENCES `formule` (`Id_Formule`);

--
-- Contraintes pour la table `factures`
--
ALTER TABLE `factures`
  ADD CONSTRAINT `FK_Client_Factures` FOREIGN KEY (`Id_Client`) REFERENCES `clients` (`Id_Client`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_Devis_Factures` FOREIGN KEY (`Id_Devis`) REFERENCES `devis` (`Id_Devis`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_Formule_Aperitif_Factures` FOREIGN KEY (`Id_Formule_Aperitif`) REFERENCES `formule` (`Id_Formule`),
  ADD CONSTRAINT `FK_Formule_Box_Factures` FOREIGN KEY (`Id_Formule_Box`) REFERENCES `formule` (`Id_Formule`),
  ADD CONSTRAINT `FK_Formule_Brunch_Factures` FOREIGN KEY (`Id_Formule_Brunch`) REFERENCES `formule` (`Id_Formule`),
  ADD CONSTRAINT `FK_Formule_Cocktail_Factures` FOREIGN KEY (`Id_Formule_Cocktail`) REFERENCES `formule` (`Id_Formule`),
  ADD CONSTRAINT `FK_Remise_Factures` FOREIGN KEY (`Id_Remise`) REFERENCES `remises` (`Id_Remise`);

--
-- Contraintes pour la table `formule`
--
ALTER TABLE `formule`
  ADD CONSTRAINT `FK_Type_formule` FOREIGN KEY (`Id_Type_Formule`) REFERENCES `type_formule` (`Id_Type_Formule`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
