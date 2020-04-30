-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Jeu 30 Avril 2020 à 01:46
-- Version du serveur :  5.7.9
-- Version de PHP :  5.6.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `bumdufdcrm`
--
CREATE DATABASE IF NOT EXISTS `bumdufdcrm` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `bumdufdcrm`;

-- --------------------------------------------------------

--
-- Structure de la table `clients`
--

DROP TABLE IF EXISTS `clients`;
CREATE TABLE IF NOT EXISTS `clients` (
  `Id_Client` int(11) NOT NULL AUTO_INCREMENT,
  `Nom_Prenom` varchar(350) NOT NULL,
  `Adresse_Facturation` varchar(1000) DEFAULT '',
  `Email` varchar(320) NOT NULL,
  `Telephone` varchar(10) NOT NULL,
  `Type` enum('Professionnel','Particulier') NOT NULL DEFAULT 'Particulier',
  `Nombre_Prestations` int(4) UNSIGNED NOT NULL DEFAULT '0',
  `Dernier_Statut` varchar(50) DEFAULT NULL,
  `Paiement_En_Retard` int(4) UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id_Client`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `devis`
--

DROP TABLE IF EXISTS `devis`;
CREATE TABLE IF NOT EXISTS `devis` (
  `Id_Devis` int(11) NOT NULL AUTO_INCREMENT,
  `Date_Creation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Id_Client` int(11) NOT NULL,
  `Date_Evenement` datetime NOT NULL,
  `Adresse_Livraison` varchar(1000) NOT NULL,
  `Id_Estimation` int(11) DEFAULT NULL,
  `Id_Formule_Aperitif` int(11) DEFAULT NULL,
  `Id_Formule_Cocktail` int(11) DEFAULT NULL,
  `Id_Formule_Box` int(11) DEFAULT NULL,
  `Id_Formule_Brunch` int(11) DEFAULT NULL,
  `Commentaire` varchar(1000) DEFAULT NULL,
  `Statut` varchar(10) NOT NULL DEFAULT 'En cours',
  `Liste_Options` varchar(1000) DEFAULT NULL,
  `Id_Remise` int(11) DEFAULT NULL,
  `Prix_HT` float NOT NULL DEFAULT '0',
  `Prix_TTC` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id_Devis`),
  KEY `FK_Client_Devis` (`Id_Client`),
  KEY `FK_Estimation_Devis` (`Id_Estimation`),
  KEY `FK_Remise_Devis` (`Id_Remise`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `estimations`
--

DROP TABLE IF EXISTS `estimations`;
CREATE TABLE IF NOT EXISTS `estimations` (
  `Id_Estimation` int(11) NOT NULL AUTO_INCREMENT,
  `Date_Creation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Id_Client` int(11) NOT NULL,
  `Date_Evenement` datetime NOT NULL,
  `Id_Formule_Aperitif` int(11) DEFAULT NULL,
  `Id_Formule_Cocktail` int(11) DEFAULT NULL,
  `Id_Formule_Box` int(11) DEFAULT NULL,
  `Id_Formule_Brunch` int(11) DEFAULT NULL,
  `Commentaire` varchar(1000) DEFAULT NULL,
  `Statut` varchar(10) DEFAULT 'En cours',
  PRIMARY KEY (`Id_Estimation`),
  KEY `FK_Client_Estimations` (`Id_Client`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `factures`
--

DROP TABLE IF EXISTS `factures`;
CREATE TABLE IF NOT EXISTS `factures` (
  `Id_Facture` int(11) NOT NULL AUTO_INCREMENT,
  `Numero_Facture` varchar(100) NOT NULL,
  `Date_Creation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Id_Client` int(11) NOT NULL,
  `Date_Evenement` datetime NOT NULL,
  `Adresse_Livraison` varchar(1000) DEFAULT NULL,
  `Id_Devis` int(11) DEFAULT NULL,
  `Id_Formule_Aperitif` int(11) DEFAULT NULL,
  `Id_Formule_Cocktail` int(11) DEFAULT NULL,
  `Id_Formule_Box` int(11) DEFAULT NULL,
  `Id_Formule_Brunch` int(11) DEFAULT NULL,
  `Commentaire` varchar(1000) DEFAULT NULL,
  `Statut` varchar(30) NOT NULL DEFAULT 'En attente',
  `Liste_Options` varchar(1000) DEFAULT NULL,
  `Id_Remise` int(11) DEFAULT NULL,
  `Prix_HT` float NOT NULL DEFAULT '0',
  `Prix_TTC` float NOT NULL DEFAULT '0',
  `Acompte` float NOT NULL DEFAULT '0',
  `Reste_A_Payer` float NOT NULL DEFAULT '0',
  `Paiement_En_Retard` varchar(100) NOT NULL DEFAULT 'Non',
  `Nb_Relances` int(4) NOT NULL DEFAULT '0',
  `Date_Derniere_Relance` datetime DEFAULT NULL,
  PRIMARY KEY (`Id_Facture`),
  KEY `FK_Client_Factures` (`Id_Client`),
  KEY `FK_Devis_Factures` (`Id_Devis`),
  KEY `FK_Remise_Factures` (`Id_Remise`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `formules`
--

DROP TABLE IF EXISTS `formules`;
CREATE TABLE IF NOT EXISTS `formules` (
  `Id_Formule` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Type_Formule` int(11) NOT NULL,
  `Nb_Convives` int(4) NOT NULL DEFAULT '0',
  `Prix_HT` float NOT NULL DEFAULT '0',
  `Nb_Pieces_Salees` int(4) NOT NULL DEFAULT '0',
  `Nb_Pieces_Sucrees` int(4) NOT NULL DEFAULT '0',
  `Nb_Boissons` int(4) NOT NULL DEFAULT '0',
  `Liste_Id_Recettes_Salees` varchar(1000) DEFAULT NULL,
  `Liste_Id_Recettes_Sucrees` varchar(1000) DEFAULT NULL,
  `Liste_Id_Recettes_Boissons` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`Id_Formule`),
  KEY `FK_Type_Formule_Formule` (`Id_Type_Formule`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `prix_unitaire`
--

DROP TABLE IF EXISTS `prix_unitaire`;
CREATE TABLE IF NOT EXISTS `prix_unitaire` (
  `Id_Prix_Unitaire` int(11) NOT NULL AUTO_INCREMENT,
  `Nom_Type_Prestation` varchar(100) NOT NULL,
  `IsOption` int(1) NOT NULL DEFAULT '0',
  `Montant` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id_Prix_Unitaire`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

--
-- Contenu de la table `prix_unitaire`
--

INSERT INTO `prix_unitaire` (`Id_Prix_Unitaire`, `Nom_Type_Prestation`, `IsOption`, `Montant`) VALUES
(1, 'Pièce salée', 0, 1.6),
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

DROP TABLE IF EXISTS `recettes`;
CREATE TABLE IF NOT EXISTS `recettes` (
  `Id_Recette` int(11) NOT NULL AUTO_INCREMENT,
  `Categorie` varchar(10) NOT NULL,
  `Nom` varchar(256) NOT NULL,
  `Description` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`Id_Recette`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

--
-- Contenu de la table `recettes`
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
(10, 'Boisson', 'Jus d''orange', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `remises`
--

DROP TABLE IF EXISTS `remises`;
CREATE TABLE IF NOT EXISTS `remises` (
  `Id_Remise` int(11) NOT NULL AUTO_INCREMENT,
  `Nom` varchar(1000) NOT NULL,
  `IsPourcent` int(1) NOT NULL DEFAULT '0',
  `Valeur` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id_Remise`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
CREATE TABLE IF NOT EXISTS `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Contenu de la table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('001-create-type_formule.js'),
('002-create-remises.js'),
('003-create-recettes.js'),
('004-create-prix_unitaire.js'),
('005-create-clients.js'),
('006-create-formules.js'),
('007-create-estimations.js'),
('008-create-devis.js'),
('009-create-factures.js');

-- --------------------------------------------------------

--
-- Structure de la table `type_formule`
--

DROP TABLE IF EXISTS `type_formule`;
CREATE TABLE IF NOT EXISTS `type_formule` (
  `Id_Type_Formule` int(11) NOT NULL AUTO_INCREMENT,
  `Nom` varchar(100) NOT NULL,
  PRIMARY KEY (`Id_Type_Formule`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Contenu de la table `type_formule`
--

INSERT INTO `type_formule` (`Id_Type_Formule`, `Nom`) VALUES
(1, 'Apéritif'),
(2, 'Cocktail'),
(3, 'Box'),
(4, 'Brunch');

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `devis`
--
ALTER TABLE `devis`
  ADD CONSTRAINT `FK_Client_Devis` FOREIGN KEY (`Id_Client`) REFERENCES `clients` (`Id_Client`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_Estimation_Devis` FOREIGN KEY (`Id_Estimation`) REFERENCES `estimations` (`Id_Estimation`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_Remise_Devis` FOREIGN KEY (`Id_Remise`) REFERENCES `remises` (`Id_Remise`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `estimations`
--
ALTER TABLE `estimations`
  ADD CONSTRAINT `FK_Client_Estimations` FOREIGN KEY (`Id_Client`) REFERENCES `clients` (`Id_Client`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `factures`
--
ALTER TABLE `factures`
  ADD CONSTRAINT `FK_Client_Factures` FOREIGN KEY (`Id_Client`) REFERENCES `clients` (`Id_Client`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_Devis_Factures` FOREIGN KEY (`Id_Devis`) REFERENCES `devis` (`Id_Devis`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_Remise_Factures` FOREIGN KEY (`Id_Remise`) REFERENCES `remises` (`Id_Remise`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `formules`
--
ALTER TABLE `formules`
  ADD CONSTRAINT `FK_Type_Formule_Formule` FOREIGN KEY (`Id_Type_Formule`) REFERENCES `type_formule` (`Id_Type_Formule`) ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
